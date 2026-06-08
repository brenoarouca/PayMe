import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Billing } from './entities/billing.entity';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Billing)
    private billingRepository: Repository<Billing>,
  ) {}

  async create(dto: CreateBillingDto): Promise<Billing> {
    const { expenseId, ...rest } = dto;
    const billing = this.billingRepository.create({
      ...rest,
      expense: { id: expenseId },
    });
    return await this.billingRepository.save(billing);
  }

  async findAll(): Promise<Billing[]> {
    return await this.billingRepository.find({
      relations: ['expense', 'participants', 'participants.participant'],
    });
  }

  async findOne(id: string): Promise<Billing> {
    const billing = await this.billingRepository.findOne({
      where: { id },
      relations: ['expense', 'participants', 'participants.participant'],
    });
    if (!billing) {
      throw new NotFoundException('Billing not found');
    }
    return billing;
  }

  async update(id: string, dto: UpdateBillingDto): Promise<Billing> {
    const billing = await this.findOne(id);
    const { expenseId, ...rest } = dto;
    if (expenseId) {
      billing.expense = { id: expenseId } as any;
    }
    Object.assign(billing, rest);
    return await this.billingRepository.save(billing);
  }

  async remove(id: string): Promise<void> {
    const result = await this.billingRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Billing not found');
    }
  }
}
