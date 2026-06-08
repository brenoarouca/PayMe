import api from './client';
import type { Participant } from '../types';

export const participantService = {
  list: async () => {
    const { data } = await api.get<Participant[]>('/participants');
    return data;
  },
  get: async (id: string) => {
    const { data } = await api.get<Participant>(`/participants/${id}`);
    return data;
  },
  create: async (payload: Partial<Participant>) => {
    const { data } = await api.post<Participant>('/participants', payload);
    return data;
  },
  update: async (id: string, payload: Partial<Participant>) => {
    const { data } = await api.patch<Participant>(`/participants/${id}`, payload);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/participants/${id}`);
  },
};
