import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Session, SessionType, SessionStatus } from '../entities/session.entity';
import { Attendance, AttendanceStatus } from '../entities/attendance.entity';
import { Field } from '../entities/field.entity';
import { Member } from '../entities/member.entity';
import { Transaction, TransactionType } from '../entities/transaction.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { BulkAttendanceDto } from './dto/mark-attendance.dto';
import { OnFieldCollectionDto } from './dto/onfield-collection.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Field)
    private fieldsRepository: Repository<Field>,
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    // Verify field exists
    const field = await this.fieldsRepository.findOne({ 
      where: { id: createSessionDto.fieldId } 
    });
    if (!field) {
      throw new NotFoundException(`Field with ID ${createSessionDto.fieldId} not found`);
    }

    const session = this.sessionsRepository.create({
      field,
      name: createSessionDto.name,
      scheduled_start: new Date(createSessionDto.scheduledStart),
      scheduled_end: createSessionDto.scheduledEnd ? new Date(createSessionDto.scheduledEnd) : undefined,
      session_type: createSessionDto.sessionType === 'practice' ? SessionType.PRACTICE : SessionType.MATCH,
      field_cost: createSessionDto.fieldCost || 0,
      transport_cost: createSessionDto.transportCost || 0,
      drinks_cost: createSessionDto.drinksCost || 0,
      emergency_fund: createSessionDto.emergencyFund || 0,
      other_costs: createSessionDto.otherCosts || 0,
      notes: createSessionDto.notes,
      status: SessionStatus.PLANNED,
    });

    return await this.sessionsRepository.save(session);
  }

  async findAll(
    status?: string,
    from?: string,
    to?: string,
  ): Promise<Session[]> {
    const queryBuilder = this.sessionsRepository.createQueryBuilder('session')
      .leftJoinAndSelect('session.field', 'field');

    if (status) {
      queryBuilder.andWhere('session.status = :status', { status });
    }

    if (from && to) {
      queryBuilder.andWhere('session.scheduled_start BETWEEN :from AND :to', {
        from: new Date(from),
        to: new Date(to),
      });
    } else if (from) {
      queryBuilder.andWhere('session.scheduled_start >= :from', {
        from: new Date(from),
      });
    } else if (to) {
      queryBuilder.andWhere('session.scheduled_start <= :to', {
        to: new Date(to),
      });
    }

    queryBuilder.orderBy('session.scheduled_start', 'DESC');

    return await queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Session> {
    const session = await this.sessionsRepository.findOne({
      where: { id },
      relations: ['field'],
    });
    
    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }
    
    return session;
  }

  async update(id: number, updateSessionDto: UpdateSessionDto): Promise<Session> {
    const session = await this.findOne(id);

    if (session.status === 'completed') {
      throw new BadRequestException('Cannot update a completed session');
    }

    if (updateSessionDto.fieldId !== undefined) {
      const field = await this.fieldsRepository.findOne({ 
        where: { id: updateSessionDto.fieldId } 
      });
      if (!field) {
        throw new NotFoundException(`Field with ID ${updateSessionDto.fieldId} not found`);
      }
      session.field_id = updateSessionDto.fieldId;
    }

    if (updateSessionDto.name !== undefined) session.name = updateSessionDto.name;
    if (updateSessionDto.scheduledStart !== undefined) session.scheduled_start = new Date(updateSessionDto.scheduledStart);
    if (updateSessionDto.scheduledEnd !== undefined) session.scheduled_end = new Date(updateSessionDto.scheduledEnd);
    if (updateSessionDto.sessionType !== undefined) session.session_type = updateSessionDto.sessionType === 'practice' ? SessionType.PRACTICE : SessionType.MATCH;
    if (updateSessionDto.fieldCost !== undefined) session.field_cost = updateSessionDto.fieldCost;
    if (updateSessionDto.transportCost !== undefined) session.transport_cost = updateSessionDto.transportCost;
    if (updateSessionDto.drinksCost !== undefined) session.drinks_cost = updateSessionDto.drinksCost;
    if (updateSessionDto.emergencyFund !== undefined) session.emergency_fund = updateSessionDto.emergencyFund;
    if (updateSessionDto.otherCosts !== undefined) session.other_costs = updateSessionDto.otherCosts;
    if (updateSessionDto.notes !== undefined) session.notes = updateSessionDto.notes;

    return await this.sessionsRepository.save(session);
  }

  async remove(id: number): Promise<{ message: string }> {
    const session = await this.findOne(id);
    
    if (session.status === 'completed') {
      throw new BadRequestException('Cannot delete a completed session. Cancel it first.');
    }

    await this.sessionsRepository.remove(session);
    return { message: `Session ${id} deleted successfully` };
  }

  async markAttendanceBulk(id: number, bulkAttendanceDto: BulkAttendanceDto): Promise<Attendance[]> {
    const session = await this.findOne(id);

    if (session.status === 'completed') {
      throw new BadRequestException('Cannot mark attendance for a completed session');
    }

    const attendances: Attendance[] = [];

    for (const att of bulkAttendanceDto.attendances) {
      // Verify member exists
      const member = await this.membersRepository.findOne({ 
        where: { id: att.memberId } 
      });
      if (!member) {
        throw new NotFoundException(`Member with ID ${att.memberId} not found`);
      }

      // Check if attendance already exists
      let attendance = await this.attendanceRepository.findOne({
        where: { 
          member_id: att.memberId,
          session_id: id,
        },
      });

      if (attendance) {
        // Update existing attendance
        attendance.status = att.status as AttendanceStatus;
        if (att.notes !== undefined) {
          attendance.notes = att.notes;
        }
      } else {
        // Create new attendance
        attendance = this.attendanceRepository.create({
          member_id: att.memberId,
          session_id: id,
          status: att.status as AttendanceStatus,
          notes: att.notes,
          charged_amount: 0,
          paid_amount: 0,
          paid_flag: false,
        });
      }

      const saved = await this.attendanceRepository.save(attendance);
      attendances.push(saved);
    }

    return attendances;
  }

  async getAttendance(id: number): Promise<Attendance[]> {
    await this.findOne(id); // Verify session exists

    return await this.attendanceRepository.find({
      where: { session_id: id },
      relations: ['member'],
      order: { created_at: 'ASC' },
    });
  }

  async recordOnFieldCollection(
    id: number,
    onFieldCollectionDto: OnFieldCollectionDto,
  ): Promise<Transaction> {
    const session = await this.findOne(id);

    if (!onFieldCollectionDto.memberId && !onFieldCollectionDto.guestName) {
      throw new BadRequestException('Either memberId or guestName must be provided');
    }

    let member: Member | null = null;
    if (onFieldCollectionDto.memberId) {
      member = await this.membersRepository.findOne({ 
        where: { id: onFieldCollectionDto.memberId } 
      });
      if (!member) {
        throw new NotFoundException(`Member with ID ${onFieldCollectionDto.memberId} not found`);
      }
    }

    // Create on-field payment transaction
    const transaction = this.transactionsRepository.create({
      member_id: member?.id,
      session_id: id,
      transaction_type: TransactionType.ONFIELD_PAYMENT,
      amount: onFieldCollectionDto.amount,
      currency: 'USD',
      method: onFieldCollectionDto.method as any,
      notes: onFieldCollectionDto.notes || (onFieldCollectionDto.guestName ? `Guest: ${onFieldCollectionDto.guestName}` : undefined),
      timestamp: new Date(),
    });

    await this.transactionsRepository.save(transaction);

    // If member payment, try to apply to their attendance dues
    if (member) {
      const attendance = await this.attendanceRepository.findOne({
        where: {
          member_id: member.id,
          session_id: id,
        },
      });

      if (attendance && !attendance.paid_flag) {
        const remainingDue = Number(attendance.charged_amount) - Number(attendance.paid_amount);
        const paymentToApply = Math.min(onFieldCollectionDto.amount, remainingDue);
        
        attendance.paid_amount = Number(attendance.paid_amount) + paymentToApply;
        
        if (Number(attendance.paid_amount) >= Number(attendance.charged_amount)) {
          attendance.paid_flag = true;
        }
        
        await this.attendanceRepository.save(attendance);
      }
    }

    return transaction;
  }

  async getTotalCost(id: number): Promise<number> {
    const session = await this.findOne(id);
    
    return Number(session.field_cost) + 
           Number(session.transport_cost) + 
           Number(session.drinks_cost) + 
           Number(session.emergency_fund) + 
           Number(session.other_costs);
  }
}
