import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { ExpenseType, RecurrenceType } from '../../common/enums';

export class CreateExpenseDto {
  @ApiProperty({ description: 'Título da despesa', example: 'Aluguel' })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Descrição detalhada',
    example: 'Aluguel mensal do apartamento',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Tipo da despesa', enum: ExpenseType })
  @IsEnum(ExpenseType)
  expenseType: ExpenseType;

  @ApiProperty({
    description: 'Tipo de recorrência',
    enum: RecurrenceType,
    default: RecurrenceType.NONE,
  })
  @IsEnum(RecurrenceType)
  @IsOptional()
  recurrence?: RecurrenceType;

  @ApiProperty({ description: 'Valor total da despesa', example: 1200.0 })
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiProperty({
    description: 'Quantidade de parcelas (se aplicável)',
    example: 1,
    default: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  installmentsCount?: number;

  @ApiProperty({
    description: 'Dia padrão para cobrança',
    example: 10,
    required: false,
  })
  @IsInt()
  @Min(1)
  @Max(31)
  @IsOptional()
  billingDay?: number;

  @ApiProperty({
    description: 'Quantidade máxima de pessoas participando',
    example: 5,
    required: false,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  maxVacancies?: number;
}
