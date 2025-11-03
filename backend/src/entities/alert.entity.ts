import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Member } from './member.entity';

export enum AlertType {
  TREASURY_LOW = 'treasury_low',
  MEMBER_LOW_BALANCE = 'member_low_balance',
  FINE_APPLIED = 'fine_applied',
  CONSECUTIVE_ABSENCE = 'consecutive_absence',
}

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: AlertType,
  })
  alert_type: AlertType;

  @Column({ nullable: true })
  member_id: number;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'boolean', default: false })
  is_resolved: boolean;

  @Column({ type: 'timestamp', nullable: true })
  resolved_at: Date;

  @CreateDateColumn()
  triggered_at: Date;

  @ManyToOne(() => Member, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member: Member;
}
