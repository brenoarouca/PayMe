import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseParticipant } from './entities/expense-participant.entity';
import { CreateExpenseParticipantDto } from './dto/create-expense-participant.dto';
import { UpdateExpenseParticipantDto } from './dto/update-expense-participant.dto';
import { Expense } from '../expenses/entities/expense.entity';

@Injectable()
export class ExpenseParticipantService {
  constructor(
    @InjectRepository(ExpenseParticipant)
    private epRepository: Repository<ExpenseParticipant>,
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
  ) {}

  async create(dto: CreateExpenseParticipantDto): Promise<ExpenseParticipant> {
    const { expenseId, participantId, vacanciesCount, ...rest } = dto;
    
    const expense = await this.expenseRepository.findOne({
      where: { id: expenseId },
      relations: ['participants'],
    });

    if (!expense) throw new NotFoundException('Expense not found');

    if (expense.maxVacancies) {
      const currentVacancies = expense.participants.reduce((sum, p) => sum + p.vacanciesCount, 0);
      if (currentVacancies + (vacanciesCount || 1) > expense.maxVacancies) {
        throw new BadRequestException('Expense vacancies limit exceeded');
      }
    }

    const ep = this.epRepository.create({
      ...rest,
      vacanciesCount,
      expense: { id: expenseId },
      participant: { id: participantId },
    });
    return await this.epRepository.save(ep);
  }

  async findAllByExpense(expenseId: string): Promise<ExpenseParticipant[]> {
    return await this.epRepository.find({
      where: { expense: { id: expenseId } },
      relations: ['participant'],
    });
  }

  async update(
    id: string,
    dto: UpdateExpenseParticipantDto,
  ): Promise<ExpenseParticipant> {
    const ep = await this.epRepository.findOneBy({ id });
    if (!ep) throw new NotFoundException('Expense link not found');
    Object.assign(ep, dto);
    return await this.epRepository.save(ep);
  }

  async remove(id: string): Promise<void> {
    await this.epRepository.delete(id);
  }
}
