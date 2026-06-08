import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillingService } from './billing.service';
import { Billing } from './entities/billing.entity';
import { BillingStatus } from '../common/enums';

describe('BillingService', () => {
  let service: BillingService;
  let repository: Repository<Billing>;

  const mockBilling = {
    id: 'bill-1',
    totalAmount: 55.9,
    status: BillingStatus.PENDING,
    expense: { id: 'exp-1' },
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockBilling),
    save: jest.fn().mockResolvedValue(mockBilling),
    find: jest.fn().mockResolvedValue([mockBilling]),
    findOne: jest.fn().mockResolvedValue(mockBilling),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingService,
        {
          provide: getRepositoryToken(Billing),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BillingService>(BillingService);
    repository = module.get<Repository<Billing>>(getRepositoryToken(Billing));
  });

  it('should create a billing instance', async () => {
    const dto = { expenseId: 'exp-1', totalAmount: 55.9, dueDate: new Date() };
    const result = await service.create(dto as any);
    expect(repository.create).toHaveBeenCalled();
    expect(result).toEqual(mockBilling);
  });
});
