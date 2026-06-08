import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { BillingParticipantStatus } from '../../common/enums';

export class CreateBillingParticipantDto {
  @ApiProperty({
    description: 'ID da ocorrência de cobrança',
    example: 'uuid-da-cobranca',
  })
  @IsString()
  billingId: string;

  @ApiProperty({
    description: 'ID do participante',
    example: 'uuid-do-participante',
  })
  @IsString()
  participantId: string;

  @ApiProperty({
    description: 'Valor individual a ser pago pelo participante',
    example: 25.0,
  })
  @IsNumber()
  @Min(0)
  amountDue: number;

  @ApiProperty({
    description: 'Status do pagamento individual',
    enum: BillingParticipantStatus,
    default: BillingParticipantStatus.PENDING,
  })
  @IsEnum(BillingParticipantStatus)
  @IsOptional()
  status?: BillingParticipantStatus;
}
