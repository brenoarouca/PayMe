import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, Length } from 'class-validator';

export class ParticipantDto {
  @ApiProperty({
    description: 'Nome completo do participante',
    example: 'João Silva',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Endereço de e-mail',
    example: 'joao@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Número de telefone/WhatsApp',
    example: '11999999999',
  })
  @IsString()
  @Length(10, 11)
  phone: string;
}
