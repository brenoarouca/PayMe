import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@ApiTags('Pagamentos')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar um novo pagamento financeiro' })
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Get('billing-participant/:bpId')
  @ApiOperation({
    summary:
      'Listar histórico de pagamentos de um participante em uma cobrança',
  })
  findByBillingParticipant(@Param('bpId') bpId: string) {
    return this.paymentService.findByBillingParticipant(bpId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um registro de pagamento (estorno)' })
  remove(@Param('id') id: string) {
    return this.paymentService.remove(id);
  }
}
