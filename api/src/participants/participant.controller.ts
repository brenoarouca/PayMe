import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ParticipantService } from './participant.service';
import { ParticipantDto } from './dto/create-participant.dto';

@ApiTags('Participantes')
@Controller('participants')
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar um novo participante' })
  @ApiResponse({
    status: 201,
    description: 'O participante foi registrado com sucesso.',
  })
  create(@Body() participantDto: ParticipantDto) {
    return this.participantService.registerParticipant(participantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os participantes' })
  findAll() {
    return this.participantService.getAllParticipants();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter participante pelo ID' })
  findOne(@Param('id') id: string) {
    return this.participantService.getParticipantById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de um participante' })
  update(
    @Param('id') id: string,
    @Body() participantDto: Partial<ParticipantDto>,
  ) {
    return this.participantService.updateParticipant(id, participantDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um participante' })
  remove(@Param('id') id: string) {
    return this.participantService.deleteParticipant(id);
  }
}
