import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { BillingParticipant } from '../../billing-participants/entities/billing-participant.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => BillingParticipant, (bp) => bp.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'billing_participant_id' })
  billingParticipant: BillingParticipant;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount: number;

  @Column({ name: 'payment_date', type: 'timestamp', default: () => 'NOW()' })
  paymentDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
