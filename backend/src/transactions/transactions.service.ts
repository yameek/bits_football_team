import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { Transaction, TransactionType } from '../entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
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
}
