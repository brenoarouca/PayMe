export type ExpenseType = 'LOAN' | 'CREDIT_CARD' | 'SUBSCRIPTION' | 'OTHER';
export type RecurrenceType = 'NONE' | 'MONTHLY' | 'BIMONTHLY' | 'QUARTERLY' | 'SEMIANNUAL' | 'ANNUAL';
export type BillingStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'CANCELLED' | 'OVERDUE';
export type BillingParticipantStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'CANCELLED';

export interface Participant {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  title: string;
  description: string | null;
  expenseType: ExpenseType;
  recurrence: RecurrenceType;
  totalAmount: number;
  installmentsCount: number;
  billingDay: number | null;
  maxVacancies: number | null;
  isActive: boolean;
  participants?: ExpenseParticipant[];
  billings?: Billing[];
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseParticipant {
  id: string;
  expenseId: string;
  participantId: string;
  participant?: Participant;
  vacanciesCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Billing {
  id: string;
  expenseId: string;
  expense?: Expense;
  installmentNumber: number | null;
  referenceDate: string | null;
  dueDate: string;
  totalAmount: number;
  status: BillingStatus;
  participants?: BillingParticipant[];
  createdAt: string;
  updatedAt: string;
}

export interface BillingParticipant {
  id: string;
  billingId: string;
  participantId: string;
  participant?: Participant;
  amountDue: number;
  amountPaid: number;
  paidAt: string | null;
  status: BillingParticipantStatus;
  payments?: Payment[];
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  billingParticipantId: string;
  amount: number;
  paymentDate: string;
  notes: string | null;
  createdAt: string;
}
