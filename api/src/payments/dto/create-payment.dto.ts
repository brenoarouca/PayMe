import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'ID do vínculo participante-cobrança',
    example: 'uuid-do-vinculo',
  })
  @IsString()
  billingParticipantId: string;

  @ApiProperty({ description: 'Valor pago', example: 25.0 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'Data em que o pagamento foi realizado',
    example: '2026-05-15',
    required: false,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  paymentDate?: Date;

  @ApiProperty({
    description: 'Observações adicionais',
    example: 'Pago via PIX',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
