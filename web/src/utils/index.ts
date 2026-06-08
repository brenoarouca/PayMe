import type { RecurrenceType, ExpenseType, BillingStatus } from "../types";

export const formatCurrency = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return numValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const formatDate = (date: string | Date | null): string => {
  if (!date) return '-';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('pt-BR');
};

export const getRecurrenceLabel = (recurrence: RecurrenceType): string => {
  const labels: Record<RecurrenceType, string> = {
    NONE: 'Nenhuma',
    MONTHLY: 'Mensal',
    BIMONTHLY: 'Bimestral',
    QUARTERLY: 'Trimestral',
    SEMIANNUAL: 'Semestral',
    ANNUAL: 'Anual',
  };
  return labels[recurrence] || recurrence;
};

export const getExpenseTypeLabel = (type: ExpenseType): string => {
  const labels: Record<ExpenseType, string> = {
    LOAN: 'Empréstimo',
    CREDIT_CARD: 'Cartão de Crédito',
    SUBSCRIPTION: 'Assinatura',
    OTHER: 'Outro',
  };
  return labels[type] || type;
};

export const getBillingStatusLabel = (status: BillingStatus): string => {
  const labels: Record<BillingStatus, string> = {
    PENDING: 'Pendente',
    PARTIAL: 'Parcial',
    PAID: 'Pago',
    CANCELLED: 'Cancelado',
    OVERDUE: 'Atrasado',
  };
  return labels[status] || status;
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};
