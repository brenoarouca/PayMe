import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ExpenseParticipant } from '../../expense-participants/entities/expense-participant.entity';
import { BillingParticipant } from '../../billing-participants/entities/billing-participant.entity';

@Entity('participants')
export class Participant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 11 })
  phone: string;

  @OneToMany(() => ExpenseParticipant, (ep) => ep.participant)
  expenseParticipants: ExpenseParticipant[];

  @OneToMany(() => BillingParticipant, (bp) => bp.participant)
  billingParticipants: BillingParticipant[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
