import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Field } from './field.entity';
import { Attendance } from './attendance.entity';
import { Transaction } from './transaction.entity';

export enum SessionType {
  PRACTICE = 'practice',
  MATCH = 'match',
}

export enum SessionStatus {
  PLANNED = 'planned',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  field_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'timestamp' })
  scheduled_start: Date;

  @Column({ type: 'timestamp', nullable: true })
  scheduled_end: Date;

  @Column({
    type: 'enum',
    enum: SessionType,
    default: SessionType.PRACTICE,
  })
  session_type: SessionType;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  field_cost: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  transport_cost: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  drinks_cost: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  emergency_fund: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  other_costs: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({
    type: 'enum',
    enum: SessionStatus,
    default: SessionStatus.PLANNED,
  })
  status: SessionStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Field, (field) => field.sessions, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'field_id' })
  field: Field;

  @OneToMany(() => Attendance, (attendance) => attendance.session)
  attendances: Attendance[];

  @OneToMany(() => Transaction, (transaction) => transaction.session)
  transactions: Transaction[];
}
