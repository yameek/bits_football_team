import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Member } from './member.entity';
import { Session } from './session.entity';

@Entity('guests')
export class Guest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  contact_number: string;

  @Column()
  session_id: number;

  @Column()
  brought_by_member_id: number;

  @Column({ nullable: true })
  paid_by_member_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount_paid: number;

  @Column({ type: 'boolean', default: false })
  converted_to_member: boolean;

  @Column({ nullable: true })
  converted_member_id: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Session, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @ManyToOne(() => Member, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'brought_by_member_id' })
  brought_by: Member;

  @ManyToOne(() => Member, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'paid_by_member_id' })
  paid_by: Member;

  @ManyToOne(() => Member, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'converted_member_id' })
  converted_member: Member;
}
