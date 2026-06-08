import api from './client';
import type { Billing, Payment } from '../types';

export const billingService = {
  list: async () => {
    const { data } = await api.get<Billing[]>('/billings');
    return data;
  },
  get: async (id: string) => {
    const { data } = await api.get<Billing>(`/billings/${id}`);
    return data;
  },
  create: async (payload: any) => {
    const { data } = await api.post<Billing>('/billings', payload);
    return data;
  },
  update: async (id: string, payload: any) => {
    const { data } = await api.patch<Billing>(`/billings/${id}`, payload);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/billings/${id}`);
  },

  // Pagamentos
  addPayment: async (payload: { billingParticipantId: string; amount: number; paymentDate?: Date; notes?: string }) => {
    const { data } = await api.post<Payment>('/payments', payload);
    return data;
  },
  deletePayment: async (id: string) => {
    await api.delete(`/payments/${id}`);
  },
};
