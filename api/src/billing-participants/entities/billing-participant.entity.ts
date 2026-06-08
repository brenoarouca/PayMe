import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Billing } from '../../billings/entities/billing.entity';
import { Participant } from '../../participants/entities/participant.entity';
import { BillingParticipantStatus } from '../../common/enums';
import { Payment } from '../../payments/entities/payment.entity';

@Entity('billing_participants')
export class BillingParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Billing, (b) => b.participants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'billing_id' })
  billing: Billing;

  @ManyToOne(() => Participant, (p) => p.billingParticipants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'participant_id' })
  participant: Participant;

  @Column({ name: 'amount_due', type: 'numeric', precision: 12, scale: 2 })
  amountDue: number;

  @Column({
    name: 'amount_paid',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0,
  })
  amountPaid: number;

  @Column({ name: 'paid_at', type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({
    type: 'enum',
    enum: BillingParticipantStatus,
    default: BillingParticipantStatus.PENDING,
  })
  status: BillingParticipantStatus;

  @OneToMany(() => Payment, (p) => p.billingParticipant)
  payments: Payment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
