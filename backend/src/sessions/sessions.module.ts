import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { Session } from '../entities/session.entity';
import { Attendance } from '../entities/attendance.entity';
import { Field } from '../entities/field.entity';
import { Member } from '../entities/member.entity';
import { Transaction } from '../entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Session,
      Attendance,
      Field,
      Member,
      Transaction,
    ]),
  ],
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
