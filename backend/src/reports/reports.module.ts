import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Member } from '../entities/member.entity';
import { Session } from '../entities/session.entity';
import { Transaction } from '../entities/transaction.entity';
import { Attendance } from '../entities/attendance.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, Session, Transaction, Attendance]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
