import { PartialType } from '@nestjs/swagger';
import { CreateExpenseParticipantDto } from './create-expense-participant.dto';

export class UpdateExpenseParticipantDto extends PartialType(
  CreateExpenseParticipantDto,
) {}
