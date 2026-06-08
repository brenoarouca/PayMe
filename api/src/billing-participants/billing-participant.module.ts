import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingParticipant } from './entities/billing-participant.entity';
import { BillingParticipantService } from './billing-participant.service';
import { BillingParticipantController } from './billing-participant.controller';
import { ParticipantModule } from '../participants/participant.module';
import { BillingModule } from '../billings/billing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BillingParticipant]),
    ParticipantModule,
    BillingModule,
  ],
  controllers: [BillingParticipantController],
  providers: [BillingParticipantService],
})
export class BillingParticipantModule {}
