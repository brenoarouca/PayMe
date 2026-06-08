import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsDate,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BillingStatus } from '../../common/enums';

export class CreateBillingDto {
  @ApiProperty({
    description: 'ID da despesa mestre',
    example: 'uuid-da-despesa',
  })
  @IsString()
  expenseId: string;

  @ApiProperty({
    description: 'Número da parcela (se aplicável)',
    example: 1,
    required: false,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  installmentNumber?: number;

  @ApiProperty({
    description: 'Data de referência (Mês/Ano)',
    example: '2026-05-01',
    required: false,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  referenceDate?: Date;

  @ApiProperty({
    description: 'Data de vencimento da cobrança',
    example: '2026-05-15',
  })
  @Type(() => Date)
  @IsDate()
  dueDate: Date;

  @ApiProperty({
    description: 'Valor total desta ocorrência da cobrança',
    example: 49.9,
  })
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiProperty({
    description: 'Status atual da cobrança',
    enum: BillingStatus,
    default: BillingStatus.PENDING,
  })
  @IsEnum(BillingStatus)
  @IsOptional()
  status?: BillingStatus;
}
