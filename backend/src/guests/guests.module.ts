import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestsService } from './guests.service';
import { GuestsController } from './guests.controller';
import { Guest } from '../entities/guest.entity';
import { Member } from '../entities/member.entity';
import { Session } from '../entities/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Guest, Member, Session])],
  providers: [GuestsService],
  controllers: [GuestsController],
  exports: [GuestsService],
})
export class GuestsModule {}
