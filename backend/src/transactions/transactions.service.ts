import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere, In } from 'typeorm';
import { Transaction, TransactionType, TransactionMethod } from '../entities/transaction.entity';
import { Member } from '../entities/member.entity';
import { BulkPaymentDto, SplitType } from './dto/bulk-payment.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
  ) {}

  async findAll(
    memberId?: number,
    categoryId?: number,
    sessionId?: number,
    type?: string,
    from?: string,
    to?: string,
  ): Promise<Transaction[]> {
    const where: FindOptionsWhere<Transaction> = {};

    if (memberId) {
      where.member_id = memberId;
    }

    if (categoryId) {
      where.category_id = categoryId;
    }

    if (sessionId) {
      where.session_id = sessionId;
    }

    if (type) {
      where.transaction_type = type as TransactionType;
    }

    // Date range filtering
    if (from && to) {
      where.timestamp = Between(new Date(from), new Date(to));
    } else if (from) {
      // From date to now
      where.timestamp = Between(new Date(from), new Date());
    }

    return await this.transactionsRepository.find({
      where,
      relations: ['member', 'session', 'category'],
      order: {
        timestamp: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id },
      relations: ['member', 'session', 'category'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  async getStatsByType(): Promise<{
    type: string;
    count: number;
    total: number;
  }[]> {
    const stats = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .select('transaction.transaction_type', 'type')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(transaction.amount)', 'total')
      .groupBy('transaction.transaction_type')
      .getRawMany();

    return stats.map(stat => ({
      type: stat.type,
      count: parseInt(stat.count),
      total: parseFloat(stat.total) || 0,
    }));
  }

  async getStatsByCategory(): Promise<{
    categoryId: number;
    categoryName: string;
    count: number;
    total: number;
  }[]> {
    const stats = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .leftJoin('transaction.category', 'category')
      .select('category.id', 'categoryId')
      .addSelect('category.name', 'categoryName')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(transaction.amount)', 'total')
      .where('transaction.category_id IS NOT NULL')
      .groupBy('category.id')
      .addGroupBy('category.name')
      .getRawMany();

    return stats.map(stat => ({
      categoryId: parseInt(stat.categoryId),
      categoryName: stat.categoryName,
      count: parseInt(stat.count),
      total: parseFloat(stat.total) || 0,
    }));
  }

  async getStatsByMember(): Promise<{
    memberId: number;
    memberName: string;
    count: number;
    total: number;
  }[]> {
    const stats = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .leftJoin('transaction.member', 'member')
      .select('member.id', 'memberId')
      .addSelect('member.name', 'memberName')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(transaction.amount)', 'total')
      .where('transaction.member_id IS NOT NULL')
      .groupBy('member.id')
      .addGroupBy('member.name')
      .getRawMany();

    return stats.map(stat => ({
      memberId: parseInt(stat.memberId),
      memberName: stat.memberName,
      count: parseInt(stat.count),
      total: parseFloat(stat.total) || 0,
    }));
  }

  /**
   * Create a bulk payment split among multiple members
   */
  async createBulkPayment(bulkPaymentDto: BulkPaymentDto): Promise<{
    groupId: string;
    transactions: Transaction[];
    summary: {
      totalAmount: number;
      memberCount: number;
      splitType: string;
    };
  }> {
    const { memberIds, amount, splitType, customAmounts, notes } = bulkPaymentDto;

    // Verify all members exist
    const members = await this.membersRepository.find({
      where: { id: In(memberIds) },
    });
    if (members.length !== memberIds.length) {
      throw new NotFoundException('One or more members not found');
    }

    // Validate custom amounts
    if (splitType === SplitType.CUSTOM) {
      if (!customAmounts || customAmounts.length === 0) {
        throw new BadRequestException('Custom amounts required for custom split type');
      }

      // Verify custom amounts match member IDs
      const customMemberIds = customAmounts.map(ca => ca.memberId);
      const allMembersHaveAmount = memberIds.every(id => customMemberIds.includes(id));
      if (!allMembersHaveAmount) {
        throw new BadRequestException('All members must have a custom amount specified');
      }

      // Verify total matches
      const customTotal = customAmounts.reduce((sum, ca) => sum + ca.amount, 0);
      if (Math.abs(customTotal - amount) > 0.01) {
        throw new BadRequestException(
          `Custom amounts total (${customTotal}) must equal specified amount (${amount})`
        );
      }
    }

    // Generate unique group ID
    const groupId = randomUUID();

    // Calculate individual amounts
    const memberAmounts: Map<number, number> = new Map();

    if (splitType === SplitType.EQUAL) {
      const equalAmount = amount / memberIds.length;
      memberIds.forEach(id => memberAmounts.set(id, equalAmount));
    } else {
      customAmounts!.forEach(ca => memberAmounts.set(ca.memberId, ca.amount));
    }

    // Create transactions for each member
    const transactionPromises = members.map(async (member) => {
      const memberAmount = memberAmounts.get(member.id)!;

      // Create transaction
      const transaction = this.transactionsRepository.create({
        member,
        transaction_type: TransactionType.BULK_PAYMENT,
        amount: memberAmount,
        currency: 'USD',
        method: TransactionMethod.BANK,
        timestamp: new Date(),
        notes: notes || `Bulk payment group ${groupId}`,
        bulk_payment_group: groupId,
      });

      const savedTransaction = await this.transactionsRepository.save(transaction);

      // Update member balance
      member.balance = Number(member.balance) + memberAmount;
      await this.membersRepository.save(member);

      return savedTransaction;
    });

    const transactions = await Promise.all(transactionPromises);

    return {
      groupId,
      transactions,
      summary: {
        totalAmount: amount,
        memberCount: memberIds.length,
        splitType,
      },
    };
  }

  /**
   * Get all transactions in a bulk payment group
   */
  async findBulkPaymentGroup(groupId: string): Promise<{
    groupId: string;
    transactions: Transaction[];
    summary: {
      totalAmount: number;
      memberCount: number;
    };
  }> {
    const transactions = await this.transactionsRepository.find({
      where: { bulk_payment_group: groupId },
      relations: ['member'],
      order: { timestamp: 'ASC' },
    });

    if (transactions.length === 0) {
      throw new NotFoundException(`Bulk payment group ${groupId} not found`);
    }

    const totalAmount = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      groupId,
      transactions,
      summary: {
        totalAmount,
        memberCount: transactions.length,
      },
    };
  }
}
