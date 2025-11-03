import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../entities/member.entity';
import { Transaction, TransactionType } from '../entities/transaction.entity';
import { Attendance } from '../entities/attendance.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { AddContributionDto } from './dto/add-contribution.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const member = this.membersRepository.create({
      name: createMemberDto.name,
      contact_number: createMemberDto.contactNumber,
      pin: createMemberDto.pin,
      balance: 0.00,
      consecutive_absences: 0,
      status: createMemberDto.status || 'active',
    });
    return await this.membersRepository.save(member);
  }

  async findAll(): Promise<Member[]> {
    return await this.membersRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Member> {
    const member = await this.membersRepository.findOne({ where: { id } });
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return member;
  }

  async findByPin(pin: string): Promise<Member> {
    const member = await this.membersRepository.findOne({ where: { pin } });
    if (!member) {
      throw new NotFoundException(`Member with PIN "${pin}" not found`);
    }
    return member;
  }

  async update(id: number, updateMemberDto: UpdateMemberDto): Promise<Member> {
    const member = await this.findOne(id);
    Object.assign(member, updateMemberDto);
    return await this.membersRepository.save(member);
  }

  async remove(id: number, mode: 'soft' | 'hard' = 'soft'): Promise<{ message: string }> {
    const member = await this.findOne(id);

    if (mode === 'hard') {
      // Hard delete: cascade delete will handle related records via database constraints
      await this.membersRepository.remove(member);
      return { message: `Member ${id} and all related data permanently deleted` };
    } else {
      // Soft delete: just deactivate
      member.status = 'inactive';
      await this.membersRepository.save(member);
      return { message: `Member ${id} deactivated (soft delete)` };
    }
  }

  async addContribution(id: number, addContributionDto: AddContributionDto): Promise<Transaction> {
    const member = await this.findOne(id);

    // Create contribution transaction
    const transaction = this.transactionsRepository.create({
      member_id: member.id,
      transaction_type: TransactionType.CONTRIBUTION,
      amount: addContributionDto.amount,
      currency: 'USD',
      method: addContributionDto.method as any,
      category_id: addContributionDto.categoryId,
      reference: addContributionDto.reference,
      notes: addContributionDto.notes,
      timestamp: new Date(),
    });

    await this.transactionsRepository.save(transaction);

    // Update member balance
    member.balance = Number(member.balance) + Number(addContributionDto.amount);
    await this.membersRepository.save(member);

    return transaction;
  }

  async findTransactions(id: number): Promise<Transaction[]> {
    await this.findOne(id); // Verify member exists
    return await this.transactionsRepository.find({
      where: { member: { id } },
      order: { timestamp: 'DESC' },
      relations: ['category', 'session'],
    });
  }

  async findAttendance(id: number): Promise<Attendance[]> {
    await this.findOne(id); // Verify member exists
    return await this.attendanceRepository.find({
      where: { member_id: id },
      order: { created_at: 'DESC' },
      relations: ['session', 'session.field'],
    });
  }

  async getTeamBalance(): Promise<{ teamBalance: number; totalMembers: number; positiveBalances: number; negativeBalances: number }> {
    const members = await this.membersRepository.find({
      where: { status: 'active' },
    });

    const teamBalance = members.reduce((sum, m) => sum + Number(m.balance), 0);
    const positiveBalances = members.filter(m => Number(m.balance) > 0).length;
    const negativeBalances = members.filter(m => Number(m.balance) < 0).length;

    return {
      teamBalance: Math.round(teamBalance * 100) / 100,
      totalMembers: members.length,
      positiveBalances,
      negativeBalances,
    };
  }
}
