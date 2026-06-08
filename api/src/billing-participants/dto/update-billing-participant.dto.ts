import { PartialType } from '@nestjs/swagger';
import { CreateBillingParticipantDto } from './create-billing-participant.dto';

export class UpdateBillingParticipantDto extends PartialType(
  CreateBillingParticipantDto,
) {}
