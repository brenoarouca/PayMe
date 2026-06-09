import React from 'react';
import { Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ExpenseType, RecurrenceType } from '../../../../types';

export interface ExpenseFormData {
  title: string;
  description: string;
  expenseType: ExpenseType;
  recurrence: RecurrenceType;
  totalAmount: number;
  installmentsCount: number;
  billingDay: number;
  maxVacancies: number | undefined;
  selectedParticipants: { participantId: string; vacanciesCount: number; name: string }[];
}

interface StepInfoProps {
  formData: ExpenseFormData;
  setFormData: React.Dispatch<React.SetStateAction<ExpenseFormData>>;
}

const StepInfo: React.FC<StepInfoProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Título da Despesa</label>
          <Input 
            placeholder="Ex: Netflix Premium" 
            required 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})} 
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Descrição (Opcional)</label>
          <Input 
            placeholder="Detalhes sobre a divisão..." 
            value={formData.description || ''} 
            onChange={e => setFormData({...formData, description: e.target.value})} 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo</label>
          <Select 
            value={formData.expenseType} 
            onValueChange={value => setFormData({...formData, expenseType: value as any})}
          >
            <SelectTrigger className="w-full h-11 px-4 rounded-xl">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="SUBSCRIPTION">Assinatura</SelectItem>
              <SelectItem value="LOAN">Empréstimo</SelectItem>
              <SelectItem value="CREDIT_CARD">Cartão</SelectItem>
              <SelectItem value="OTHER">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recorrência</label>
          <Select 
            value={formData.recurrence} 
            onValueChange={value => setFormData({...formData, recurrence: value as any})}
          >
            <SelectTrigger className="w-full h-11 px-4 rounded-xl">
              <SelectValue placeholder="Selecione a recorrência" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="NONE">Única</SelectItem>
              <SelectItem value="MONTHLY">Mensal</SelectItem>
              <SelectItem value="ANNUAL">Anual</SelectItem>
            </SelectContent >
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Valor Total</label>
          <Input 
            type="number" 
            step="0.01" 
            required 
            value={formData.totalAmount} 
            onChange={e => setFormData({...formData, totalAmount: Number(e.target.value)})} 
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dia de Cobrança</label>
          <Input 
            type="number" 
            min="1" 
            max="31" 
            value={formData.billingDay} 
            onChange={e => setFormData({...formData, billingDay: Number(e.target.value)})} 
          />
        </div>
      </div>

      {formData.expenseType === 'SUBSCRIPTION' && (
        <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 animate-in zoom-in-95">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Limite de Vagas</label>
            <Input
              type="number" 
              min="1" 
              placeholder="Ex: 5" 
              className="bg-white"
              value={formData.maxVacancies || ''} 
              onChange={e => setFormData({...formData, maxVacancies: e.target.value ? Number(e.target.value) : undefined})} 
            />
          </div>
          <p className="text-[10px] text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <Info size={12} /> Define quantas pessoas podem dividir esta conta.
          </p>
        </div>
      )}
    </div>
  );
};

export default StepInfo;
