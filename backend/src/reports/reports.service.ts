import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Member } from '../entities/member.entity';
import { Session } from '../entities/session.entity';
import { Transaction } from '../entities/transaction.entity';
import { Attendance } from '../entities/attendance.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>,
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  async getTeamBalanceReport(): Promise<{
    totalBalance: number;
    totalMembers: number;
    positiveBalances: number;
    negativeBalances: number;
    zeroBalances: number;
    averageBalance: number;
    members: {
      id: number;
      name: string;
      balance: number;
      transactionCount: number;
    }[];
  }> {
    const members = await this.membersRepository.find({
      relations: ['transactions'],
    });

    const totalBalance = members.reduce((sum, m) => sum + Number(m.balance), 0);
    const positiveBalances = members.filter(m => Number(m.balance) > 0).length;
    const negativeBalances = members.filter(m => Number(m.balance) < 0).length;
    const zeroBalances = members.filter(m => Number(m.balance) === 0).length;

    return {
      totalBalance,
      totalMembers: members.length,
      positiveBalances,
      negativeBalances,
      zeroBalances,
      averageBalance: members.length > 0 ? totalBalance / members.length : 0,
      members: members.map(m => ({
        id: m.id,
        name: m.name,
        balance: Number(m.balance),
        transactionCount: m.transactions?.length || 0,
      })),
    };
  }

  async getSpendingByCategory(from?: string, to?: string): Promise<{
    categoryId: number;
    categoryName: string;
    totalAmount: number;
    transactionCount: number;
    percentage: number;
  }[]> {
    let transactions = await this.transactionsRepository.find({
      relations: ['category'],
    });

    // Filter by date and category
    transactions = transactions.filter(t => {
      if (!t.category) return false;
      
      if (from && to) {
        const timestamp = new Date(t.timestamp);
        return timestamp >= new Date(from) && timestamp <= new Date(to);
      } else if (from) {
        return new Date(t.timestamp) >= new Date(from);
      }
      
      return true;
    });

    const categoryMap = new Map<number, {
      categoryId: number;
      categoryName: string;
      totalAmount: number;
      transactionCount: number;
    }>();

    let grandTotal = 0;

    for (const transaction of transactions) {
      if (transaction.category) {
        const key = transaction.category.id;
        const existing = categoryMap.get(key);
        const amount = Number(transaction.amount);
        
        if (existing) {
          existing.totalAmount += amount;
          existing.transactionCount++;
        } else {
          categoryMap.set(key, {
            categoryId: transaction.category.id,
            categoryName: transaction.category.name,
            totalAmount: amount,
            transactionCount: 1,
          });
        }
        
        grandTotal += amount;
      }
    }

    return Array.from(categoryMap.values()).map(cat => ({
      ...cat,
      percentage: grandTotal > 0 ? (cat.totalAmount / grandTotal) * 100 : 0,
    }));
  }

  async getSessionCostAnalytics(from?: string, to?: string): Promise<{
    totalSessions: number;
    completedSessions: number;
    plannedSessions: number;
    canceledSessions: number;
    totalCosts: number;
    totalCollected: number;
    averageCostPerSession: number;
    averageAttendancePerSession: number;
    sessions: {
      id: number;
      name: string;
      date: Date;
      status: string;
      totalCost: number;
      attendeeCount: number;
      perHeadFee: number;
    }[];
  }> {
    const whereCondition: any = {};

    if (from && to) {
      whereCondition.scheduled_start = Between(new Date(from), new Date(to));
    }

    const sessions = await this.sessionsRepository.find({
      where: whereCondition,
      relations: ['attendances'],
    });

    const totalCosts = sessions.reduce((sum, s) => 
      sum + Number(s.field_cost) + Number(s.transport_cost) + 
      Number(s.drinks_cost) + Number(s.emergency_fund) + Number(s.other_costs), 0
    );

    const completedSessions = sessions.filter(s => s.status === 'completed');
    const totalCollected = completedSessions.reduce((sum, s) => {
      const attendeeCount = s.attendances?.filter(a => 
        a.status === 'present' || a.status === 'late'
      ).length || 0;
      const totalCost = Number(s.field_cost) + Number(s.transport_cost) + 
                       Number(s.drinks_cost) + Number(s.emergency_fund) + Number(s.other_costs);
      return sum + (attendeeCount > 0 ? totalCost : 0);
    }, 0);

    const totalAttendees = sessions.reduce((sum, s) => 
      sum + (s.attendances?.filter(a => a.status === 'present' || a.status === 'late').length || 0), 0
    );

    return {
      totalSessions: sessions.length,
      completedSessions: sessions.filter(s => s.status === 'completed').length,
      plannedSessions: sessions.filter(s => s.status === 'planned').length,
      canceledSessions: sessions.filter(s => s.status === 'canceled').length,
      totalCosts,
      totalCollected,
      averageCostPerSession: sessions.length > 0 ? totalCosts / sessions.length : 0,
      averageAttendancePerSession: sessions.length > 0 ? totalAttendees / sessions.length : 0,
      sessions: sessions.map(s => {
        const totalCost = Number(s.field_cost) + Number(s.transport_cost) + 
                         Number(s.drinks_cost) + Number(s.emergency_fund) + Number(s.other_costs);
        const attendeeCount = s.attendances?.filter(a => 
          a.status === 'present' || a.status === 'late'
        ).length || 0;
        
        return {
          id: s.id,
          name: s.name || 'Unnamed session',
          date: s.scheduled_start,
          status: s.status,
          totalCost,
          attendeeCount,
          perHeadFee: attendeeCount > 0 ? totalCost / attendeeCount : 0,
        };
      }),
    };
  }

  async getAttendanceSummary(from?: string, to?: string): Promise<{
    totalAttendanceRecords: number;
    presentCount: number;
    lateCount: number;
    absentCount: number;
    attendanceRate: number;
    memberAttendance: {
      memberId: number;
      memberName: string;
      totalSessions: number;
      presentCount: number;
      lateCount: number;
      absentCount: number;
      attendanceRate: number;
    }[];
  }> {
    let attendanceRecords = await this.attendanceRepository.find({
      relations: ['member', 'session'],
    });

    // Filter by date if provided
    if (from || to) {
      attendanceRecords = attendanceRecords.filter(a => {
        const sessionDate = a.session.scheduled_start;
        if (from && to) {
          return sessionDate >= new Date(from) && sessionDate <= new Date(to);
        } else if (from) {
          return sessionDate >= new Date(from);
        }
        return true;
      });
    }

    const presentCount = attendanceRecords.filter(a => a.status === 'present').length;
    const lateCount = attendanceRecords.filter(a => a.status === 'late').length;
    const absentCount = attendanceRecords.filter(a => a.status === 'absent').length;

    // Group by member
    const memberMap = new Map<number, {
      memberId: number;
      memberName: string;
      totalSessions: number;
      presentCount: number;
      lateCount: number;
      absentCount: number;
    }>();

    for (const record of attendanceRecords) {
      if (record.member) {
        const key = record.member.id;
        const existing = memberMap.get(key);
        
        if (existing) {
          existing.totalSessions++;
          if (record.status === 'present') existing.presentCount++;
          if (record.status === 'late') existing.lateCount++;
          if (record.status === 'absent') existing.absentCount++;
        } else {
          memberMap.set(key, {
            memberId: record.member.id,
            memberName: record.member.name,
            totalSessions: 1,
            presentCount: record.status === 'present' ? 1 : 0,
            lateCount: record.status === 'late' ? 1 : 0,
            absentCount: record.status === 'absent' ? 1 : 0,
          });
        }
      }
    }

    return {
      totalAttendanceRecords: attendanceRecords.length,
      presentCount,
      lateCount,
      absentCount,
      attendanceRate: attendanceRecords.length > 0 
        ? ((presentCount + lateCount) / attendanceRecords.length) * 100 
        : 0,
      memberAttendance: Array.from(memberMap.values()).map(m => ({
        ...m,
        attendanceRate: m.totalSessions > 0 
          ? ((m.presentCount + m.lateCount) / m.totalSessions) * 100 
          : 0,
      })),
    };
  }

  async getMemberBalanceHistory(memberId: number): Promise<{
    memberId: number;
    memberName: string;
    currentBalance: number;
    transactions: {
      id: number;
      date: Date;
      type: string;
      amount: number;
      balanceAfter: number;
      notes: string;
    }[];
  }> {
    const member = await this.membersRepository.findOne({
      where: { id: memberId },
      relations: ['transactions'],
    });

    if (!member) {
      throw new Error(`Member with ID ${memberId} not found`);
    }

    // Sort transactions by timestamp
    const sortedTransactions = [...(member.transactions || [])].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    let runningBalance = 0;
    const transactionHistory = sortedTransactions.map(t => {
      runningBalance += Number(t.amount);
      return {
        id: t.id,
        date: t.timestamp,
        type: t.transaction_type,
        amount: Number(t.amount),
        balanceAfter: runningBalance,
        notes: t.notes || '',
      };
    });

    return {
      memberId: member.id,
      memberName: member.name,
      currentBalance: Number(member.balance),
      transactions: transactionHistory,
    };
  }
}
