import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async create(dto: CreatePaymentDto): Promise<Payment> {
    const { billingParticipantId, ...rest } = dto;
    const payment = this.paymentRepository.create({
      ...rest,
      billingParticipant: { id: billingParticipantId },
    });
    return await this.paymentRepository.save(payment);
  }

  async findByBillingParticipant(bpId: string): Promise<Payment[]> {
    return await this.paymentRepository.find({
      where: { billingParticipant: { id: bpId } },
      order: { paymentDate: 'DESC' },
    });
  }

  async remove(id: string): Promise<void> {
    await this.paymentRepository.delete(id);
  }
}
