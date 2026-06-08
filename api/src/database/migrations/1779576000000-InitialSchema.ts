import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1779576000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // EXTENSIONS
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

    // ENUMS
    await queryRunner.query(
      `CREATE TYPE expense_type AS ENUM ('LOAN', 'CREDIT_CARD', 'SUBSCRIPTION', 'OTHER');`,
    );
    await queryRunner.query(
      `CREATE TYPE recurrence_type AS ENUM ('NONE', 'MONTHLY', 'BIMONTHLY', 'QUARTERLY', 'SEMIANNUAL', 'ANNUAL');`,
    );
    await queryRunner.query(
      `CREATE TYPE billing_status AS ENUM ('PENDING', 'PARTIAL', 'PAID', 'CANCELLED', 'OVERDUE');`,
    );
    await queryRunner.query(
      `CREATE TYPE billing_participant_status AS ENUM ('PENDING', 'PARTIAL', 'PAID', 'CANCELLED');`,
    );

    // PARTICIPANTS
    await queryRunner.query(`
            CREATE TABLE participants (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255),
                phone VARCHAR(11) NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW()
            );
        `);

    // EXPENSES
    await queryRunner.query(`
            CREATE TABLE expenses (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                title VARCHAR(255) NOT NULL,
                description TEXT,
                expense_type expense_type NOT NULL,
                recurrence recurrence_type NOT NULL DEFAULT 'NONE',
                total_amount NUMERIC(12,2) NOT NULL,
                installments_count INTEGER NOT NULL DEFAULT 1,
                billing_day INTEGER,
                max_vacancies INTEGER,
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                CONSTRAINT chk_installments_count CHECK (installments_count > 0),
                CONSTRAINT chk_billing_day CHECK (billing_day IS NULL OR billing_day BETWEEN 1 AND 31),
                CONSTRAINT chk_max_vacancies CHECK (max_vacancies IS NULL OR max_vacancies > 0)
            );
        `);

    // EXPENSE_PARTICIPANTS
    await queryRunner.query(`
            CREATE TABLE expense_participants (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                expense_id UUID NOT NULL,
                participant_id UUID NOT NULL,
                vacancies_count INTEGER NOT NULL DEFAULT 1,
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                CONSTRAINT fk_expense_participants_expense FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
                CONSTRAINT fk_expense_participants_participant FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
                CONSTRAINT uk_expense_participant UNIQUE (expense_id, participant_id),
                CONSTRAINT chk_vacancies_count CHECK (vacancies_count > 0)
            );
        `);

    // BILLINGS
    await queryRunner.query(`
            CREATE TABLE billings (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                expense_id UUID NOT NULL,
                installment_number INTEGER,
                reference_date DATE,
                due_date DATE NOT NULL,
                total_amount NUMERIC(12,2) NOT NULL,
                status billing_status NOT NULL DEFAULT 'PENDING',
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                CONSTRAINT fk_billings_expense FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
                CONSTRAINT chk_total_amount_billing CHECK (total_amount >= 0),
                CONSTRAINT chk_installment_number CHECK (installment_number IS NULL OR installment_number > 0)
            );
        `);

    // BILLING_PARTICIPANTS
    await queryRunner.query(`
            CREATE TABLE billing_participants (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                billing_id UUID NOT NULL,
                participant_id UUID NOT NULL,
                amount_due NUMERIC(12,2) NOT NULL,
                amount_paid NUMERIC(12,2) NOT NULL DEFAULT 0,
                paid_at TIMESTAMP,
                status billing_participant_status NOT NULL DEFAULT 'PENDING',
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                CONSTRAINT fk_billing_participants_billing FOREIGN KEY (billing_id) REFERENCES billings(id) ON DELETE CASCADE,
                CONSTRAINT fk_billing_participants_participant FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
                CONSTRAINT uk_billing_participant UNIQUE (billing_id, participant_id),
                CONSTRAINT chk_amount_due CHECK (amount_due >= 0),
                CONSTRAINT chk_amount_paid CHECK (amount_paid >= 0 AND amount_paid <= amount_due)
            );
        `);

    // PAYMENTS
    await queryRunner.query(`
            CREATE TABLE payments (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                billing_participant_id UUID NOT NULL,
                amount NUMERIC(12,2) NOT NULL,
                payment_date TIMESTAMP NOT NULL DEFAULT NOW(),
                notes TEXT,
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                CONSTRAINT fk_payments_billing_participant FOREIGN KEY (billing_participant_id) REFERENCES billing_participants(id) ON DELETE CASCADE,
                CONSTRAINT chk_amount_payment CHECK (amount > 0)
            );
        `);

    // INDEXES
    await queryRunner.query(
      `CREATE INDEX idx_expense_participants_expense_id ON expense_participants(expense_id);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_expense_participants_participant_id ON expense_participants(participant_id);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_billings_expense_id ON billings(expense_id);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_billings_due_date ON billings(due_date);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_billings_reference_date ON billings(reference_date);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_billings_status ON billings(status);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_billing_participants_billing_id ON billing_participants(billing_id);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_billing_participants_participant_id ON billing_participants(participant_id);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_billing_participants_status ON billing_participants(status);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_payments_billing_participant_id ON payments(billing_participant_id);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_payments_payment_date ON payments(payment_date);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS payments;`);
    await queryRunner.query(`DROP TABLE IF EXISTS billing_participants;`);
    await queryRunner.query(`DROP TABLE IF EXISTS billings;`);
    await queryRunner.query(`DROP TABLE IF EXISTS expense_participants;`);
    await queryRunner.query(`DROP TABLE IF EXISTS expenses;`);
    await queryRunner.query(`DROP TABLE IF EXISTS participants;`);
    await queryRunner.query(`DROP TYPE IF EXISTS billing_participant_status;`);
    await queryRunner.query(`DROP TYPE IF EXISTS billing_status;`);
    await queryRunner.query(`DROP TYPE IF EXISTS recurrence_type;`);
    await queryRunner.query(`DROP TYPE IF EXISTS expense_type;`);
  }
}
