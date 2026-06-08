import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ParticipantModule } from './participants/participant.module';
import { BillingModule } from './billings/billing.module';
import { BillingParticipantModule } from './billing-participants/billing-participant.module';
import { ExpenseModule } from './expenses/expense.module';
import { ExpenseParticipantModule } from './expense-participants/expense-participant.module';
import { PaymentModule } from './payments/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    ParticipantModule,
    BillingModule,
    BillingParticipantModule,
    ExpenseModule,
    ExpenseParticipantModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
