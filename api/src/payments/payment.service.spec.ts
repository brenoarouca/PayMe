import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentService } from './payment.service';
import { Payment } from './entities/payment.entity';

describe('PaymentService', () => {
  let service: PaymentService;
  let repository: Repository<Payment>;

  const mockPayment = {
    id: 'pay-1',
    amount: 20.0,
    billingParticipant: { id: 'bp-1' },
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockPayment),
    save: jest.fn().mockResolvedValue(mockPayment),
    find: jest.fn().mockResolvedValue([mockPayment]),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: getRepositoryToken(Payment),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    repository = module.get<Repository<Payment>>(getRepositoryToken(Payment));
  });

  it('should register a payment', async () => {
    const dto = { billingParticipantId: 'bp-1', amount: 20.0 };
    const result = await service.create(dto);
    expect(repository.create).toHaveBeenCalled();
    expect(result).toEqual(mockPayment);
  });
});
