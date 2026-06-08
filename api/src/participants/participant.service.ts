import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participant } from './entities/participant.entity';
import { ParticipantDto } from './dto/create-participant.dto';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,
  ) {}

  async registerParticipant(dto: ParticipantDto): Promise<Participant> {
    const newParticipant = this.participantRepository.create(dto);
    return await this.participantRepository.save(newParticipant);
  }

  async getAllParticipants(): Promise<Participant[]> {
    return await this.participantRepository.find();
  }

  async getParticipantById(id: string): Promise<Participant> {
    const participant = await this.participantRepository.findOneBy({ id });
    if (!participant) {
      throw new NotFoundException('Participant not found');
    }
    return participant;
  }

  async updateParticipant(
    id: string,
    data: Partial<ParticipantDto>,
  ): Promise<Participant> {
    await this.participantRepository.update(id, data);
    return await this.getParticipantById(id);
  }

  async deleteParticipant(id: string): Promise<void> {
    const result = await this.participantRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Participant not found');
    }
  }
}
