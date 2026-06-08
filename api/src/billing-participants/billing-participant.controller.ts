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
import { BillingParticipantService } from './billing-participant.service';
import { CreateBillingParticipantDto } from './dto/create-billing-participant.dto';
import { UpdateBillingParticipantDto } from './dto/update-billing-participant.dto';

@ApiTags('Participantes da Cobrança')
@Controller('billing-participants')
export class BillingParticipantController {
  constructor(private readonly bpService: BillingParticipantService) {}

  @Post()
  @ApiOperation({
    summary: 'Vincular participante a uma ocorrência de cobrança',
  })
  create(@Body() dto: CreateBillingParticipantDto) {
    return this.bpService.create(dto);
  }

  @Get('billing/:billingId')
  @ApiOperation({
    summary: 'Listar participantes e valores de uma cobrança específica',
  })
  findByBilling(@Param('billingId') billingId: string) {
    return this.bpService.findByBilling(billingId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter detalhes do débito de um participante em uma cobrança',
  })
  findOne(@Param('id') id: string) {
    return this.bpService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados do débito individual' })
  update(@Param('id') id: string, @Body() dto: UpdateBillingParticipantDto) {
    return this.bpService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover participante de uma ocorrência de cobrança',
  })
  remove(@Param('id') id: string) {
    return this.bpService.remove(id);
  }
}
