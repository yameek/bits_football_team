import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Member } from './member.entity';
import { Session } from './session.entity';
import { Category } from './category.entity';

export enum TransactionType {
  CONTRIBUTION = 'contribution',
  SESSION_FEE = 'session_fee',
  ONFIELD_PAYMENT = 'onfield_payment',
  REFUND = 'refund',
  ADJUSTMENT = 'adjustment',
  BULK_PAYMENT = 'bulk_payment',
  FINE = 'fine',
}

export enum TransactionMethod {
  CASH = 'cash',
  BANK = 'bank',
  MOBILE = 'mobile',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  member_id: number;

  @Column({ nullable: true })
  session_id: number;

  @Column({ nullable: true })
  category_id: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  transaction_type: TransactionType;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({
    type: 'enum',
    enum: TransactionMethod,
    nullable: true,
  })
  method: TransactionMethod;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  reference: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  bulk_payment_group: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  payment_provider: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Member, (member) => member.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @ManyToOne(() => Session, (session) => session.transactions, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @ManyToOne(() => Category, (category) => category.transactions, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
