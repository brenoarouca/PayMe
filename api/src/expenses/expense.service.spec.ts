import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseService } from './expense.service';
import { Expense } from './entities/expense.entity';
import { ExpenseType, RecurrenceType } from '../common/enums';
import { NotFoundException } from '@nestjs/common';

describe('ExpenseService', () => {
  let service: ExpenseService;
  let repository: Repository<Expense>;

  const mockExpense = {
    id: 'exp-1',
    title: 'Netflix',
    totalAmount: 55.9,
    expenseType: ExpenseType.SUBSCRIPTION,
    recurrence: RecurrenceType.MONTHLY,
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockExpense),
    save: jest.fn().mockResolvedValue(mockExpense),
    find: jest.fn().mockResolvedValue([mockExpense]),
    findOne: jest.fn().mockResolvedValue(mockExpense),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpenseService,
        {
          provide: getRepositoryToken(Expense),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ExpenseService>(ExpenseService);
    repository = module.get<Repository<Expense>>(getRepositoryToken(Expense));
  });

  it('should create an expense', async () => {
    const dto = { title: 'Netflix', totalAmount: 55.9, expenseType: ExpenseType.SUBSCRIPTION };
    const result = await service.create(dto as any);
    expect(repository.create).toHaveBeenCalled();
    expect(result).toEqual(mockExpense);
  });

  it('should find one expense', async () => {
    const result = await service.findOne('exp-1');
    expect(result).toEqual(mockExpense);
  });

  it('should throw error if expense not found', async () => {
    mockRepository.findOne.mockResolvedValueOnce(null);
    await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
  });
});
