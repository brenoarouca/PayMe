import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Billing } from '../billings/entities/billing.entity';
import { Participant } from '../participants/entities/participant.entity';
import { BillingParticipant } from '../billing-participants/entities/billing-participant.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { ExpenseParticipant } from '../expense-participants/entities/expense-participant.entity';
import { Payment } from '../payments/entities/payment.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'payme',
  entities: [
    Billing,
    Participant,
    BillingParticipant,
    Expense,
    ExpenseParticipant,
    Payment,
  ],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: ['src/database/subscribers/*.ts'],
  synchronize: false,
  logging: true,
  migrationsTableName: '_typeorm_migrations',
});
