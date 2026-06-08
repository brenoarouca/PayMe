import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillingParticipant } from './entities/billing-participant.entity';
import { CreateBillingParticipantDto } from './dto/create-billing-participant.dto';
import { UpdateBillingParticipantDto } from './dto/update-billing-participant.dto';

@Injectable()
export class BillingParticipantService {
  constructor(
    @InjectRepository(BillingParticipant)
    private bpRepository: Repository<BillingParticipant>,
  ) {}

  async create(dto: CreateBillingParticipantDto): Promise<BillingParticipant> {
    const { billingId, participantId, ...rest } = dto;
    const bp = this.bpRepository.create({
      ...rest,
      billing: { id: billingId },
      participant: { id: participantId },
    });
    return await this.bpRepository.save(bp);
  }

  async findByBilling(billingId: string): Promise<BillingParticipant[]> {
    return await this.bpRepository.find({
      where: { billing: { id: billingId } },
      relations: ['participant', 'payments'],
    });
  }

  async findOne(id: string): Promise<BillingParticipant> {
    const bp = await this.bpRepository.findOne({
      where: { id },
      relations: ['participant', 'billing', 'payments'],
    });
    if (!bp) throw new NotFoundException('Billing participant not found');
    return bp;
  }

  async update(
    id: string,
    dto: UpdateBillingParticipantDto,
  ): Promise<BillingParticipant> {
    const bp = await this.findOne(id);
    Object.assign(bp, dto);
    return await this.bpRepository.save(bp);
  }

  async remove(id: string): Promise<void> {
    await this.bpRepository.delete(id);
  }
}
