import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { Member } from '../entities/member.entity';
import { Transaction } from '../entities/transaction.entity';
import { Attendance } from '../entities/attendance.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, Transaction, Attendance]),
  ],
  controllers: [MembersController],
  providers: [MembersService],
  exports: [MembersService],
})
export class MembersModule {}
