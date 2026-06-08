import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParticipantService } from './participant.service';
import { Participant } from './entities/participant.entity';
import { NotFoundException } from '@nestjs/common';

describe('ParticipantService', () => {
  let service: ParticipantService;
  let repository: Repository<Participant>;

  const mockParticipant = {
    id: 'uuid-1',
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '11999999999',
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockParticipant),
    save: jest.fn().mockResolvedValue(mockParticipant),
    find: jest.fn().mockResolvedValue([mockParticipant]),
    findOneBy: jest.fn().mockResolvedValue(mockParticipant),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParticipantService,
        {
          provide: getRepositoryToken(Participant),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ParticipantService>(ParticipantService);
    repository = module.get<Repository<Participant>>(
      getRepositoryToken(Participant),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerParticipant', () => {
    it('should create and save a participant', async () => {
      const dto = {
        name: 'João Silva',
        email: 'joao@example.com',
        phone: '11999999999',
      };
      const result = await service.registerParticipant(dto);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(mockParticipant);
    });
  });

  describe('getParticipantById', () => {
    it('should return a participant if found', async () => {
      const result = await service.getParticipantById('uuid-1');
      expect(result).toEqual(mockParticipant);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepository.findOneBy.mockResolvedValueOnce(null);
      await expect(service.getParticipantById('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteParticipant', () => {
    it('should delete a participant', async () => {
      await service.deleteParticipant('uuid-1');
      expect(repository.delete).toHaveBeenCalledWith('uuid-1');
    });

    it('should throw NotFoundException if nothing deleted', async () => {
      mockRepository.delete.mockResolvedValueOnce({ affected: 0 });
      await expect(service.deleteParticipant('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
