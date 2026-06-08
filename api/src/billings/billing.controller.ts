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
import { BillingService } from './billing.service';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';

@ApiTags('Cobranças')
@Controller('billings')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post()
  @ApiOperation({ summary: 'Gerar uma nova ocorrência/parcela de cobrança' })
  create(@Body() createBillingDto: CreateBillingDto) {
    return this.billingService.create(createBillingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as ocorrências de cobrança' })
  findAll() {
    return this.billingService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de uma cobrança específica' })
  findOne(@Param('id') id: string) {
    return this.billingService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de uma cobrança' })
  update(@Param('id') id: string, @Body() updateBillingDto: UpdateBillingDto) {
    return this.billingService.update(id, updateBillingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma ocorrência de cobrança' })
  remove(@Param('id') id: string) {
    return this.billingService.remove(id);
  }
}
