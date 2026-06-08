import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, Min } from 'class-validator';

export class CreateExpenseParticipantDto {
  @ApiProperty({ description: 'ID da despesa', example: 'uuid-da-despesa' })
  @IsString()
  expenseId: string;

  @ApiProperty({
    description: 'ID do participante',
    example: 'uuid-do-participante',
  })
  @IsString()
  participantId: string;

  @ApiProperty({
    description: 'Quantidade de cotas/vagas que o participante assume',
    example: 1,
    default: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  vacanciesCount?: number;
}
