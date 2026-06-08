import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ExpenseParticipantService } from './expense-participant.service';
import { CreateExpenseParticipantDto } from './dto/create-expense-participant.dto';
import { UpdateExpenseParticipantDto } from './dto/update-expense-participant.dto';

@ApiTags('Vínculos de Despesa')
@Controller('expense-participants')
export class ExpenseParticipantController {
  constructor(private readonly epService: ExpenseParticipantService) {}

  @Post()
  @ApiOperation({ summary: 'Vincular um participante a uma despesa fixa' })
  create(@Body() dto: CreateExpenseParticipantDto) {
    return this.epService.create(dto);
  }

  @Get('expense/:expenseId')
  @ApiOperation({
    summary: 'Listar todos os participantes fixos de uma despesa',
  })
  findAllByExpense(@Param('expenseId') expenseId: string) {
    return this.epService.findAllByExpense(expenseId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar dados do vínculo (ex: quantidade de vagas)',
  })
  update(@Param('id') id: string, @Body() dto: UpdateExpenseParticipantDto) {
    return this.epService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um participante da lista fixa da despesa' })
  remove(@Param('id') id: string) {
    return this.epService.remove(id);
  }
}
