import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseParticipant } from './entities/expense-participant.entity';
import { ExpenseParticipantService } from './expense-participant.service';
import { ExpenseParticipantController } from './expense-participant.controller';
import { Expense } from '../expenses/entities/expense.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExpenseParticipant, Expense])],
  controllers: [ExpenseParticipantController],
  providers: [ExpenseParticipantService],
  exports: [ExpenseParticipantService],
})
export class ExpenseParticipantModule {}
