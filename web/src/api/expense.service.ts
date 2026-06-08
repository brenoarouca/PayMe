import api from './client';
import type { Expense, ExpenseParticipant } from '../types';

export const expenseService = {
  list: async () => {
    const { data } = await api.get<Expense[]>('/expenses');
    return data;
  },
  get: async (id: string) => {
    const { data } = await api.get<Expense>(`/expenses/${id}`);
    return data;
  },
  create: async (payload: Partial<Expense>) => {
    const { data } = await api.post<Expense>('/expenses', payload);
    return data;
  },
  update: async (id: string, payload: Partial<Expense>) => {
    const { data } = await api.patch<Expense>(`/expenses/${id}`, payload);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/expenses/${id}`);
  },

  // Vinculos
  addParticipant: async (payload: { expenseId: string; participantId: string; vacanciesCount?: number }) => {
    const { data } = await api.post<ExpenseParticipant>('/expense-participants', payload);
    return data;
  },
  removeParticipant: async (id: string) => {
    await api.delete(`/expense-participants/${id}`);
  },
};
