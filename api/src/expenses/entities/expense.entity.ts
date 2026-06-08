import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ExpenseType, RecurrenceType } from '../../common/enums';
import { ExpenseParticipant } from '../../expense-participants/entities/expense-participant.entity';
import { Billing } from '../../billings/entities/billing.entity';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ExpenseType,
    name: 'expense_type',
  })
  expenseType: ExpenseType;

  @Column({
    type: 'enum',
    enum: RecurrenceType,
    default: RecurrenceType.NONE,
  })
  recurrence: RecurrenceType;

  @Column({ name: 'total_amount', type: 'numeric', precision: 12, scale: 2 })
  totalAmount: number;

  @Column({ name: 'installments_count', type: 'integer', default: 1 })
  installmentsCount: number;

  @Column({ name: 'billing_day', type: 'integer', nullable: true })
  billingDay: number;

  @Column({ name: 'max_vacancies', type: 'integer', nullable: true })
  maxVacancies: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => ExpenseParticipant, (ep) => ep.expense)
  participants: ExpenseParticipant[];

  @OneToMany(() => Billing, (b) => b.expense)
  billings: Billing[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
