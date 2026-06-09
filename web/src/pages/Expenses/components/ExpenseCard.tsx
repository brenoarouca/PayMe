import React from 'react';
import { Trash2, CreditCard, Repeat, Calendar, Users } from 'lucide-react';
import type { Expense } from '../../../types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatCurrency, getRecurrenceLabel, getExpenseTypeLabel } from '../../../utils';

interface ExpenseCardProps {
  expense: Expense;
  onDelete: (id: string) => void;
  onRemoveParticipant: (id: string) => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onDelete, onRemoveParticipant }) => {
  return (
    <Card className="overflow-hidden border-slate-200/60 hover:border-blue-300 transition-all duration-300 group">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                {expense.title}
              </h3>
              <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full uppercase border border-blue-100">
                {getExpenseTypeLabel(expense.expenseType)}
              </span>
            </div>
            <p className="text-sm text-slate-500 line-clamp-1">
              {expense.description || 'Sem descrição detalhada'}
            </p>
          </div>
          <Button 
            variant={'secondary'} 
            size={'icon'} 
            onClick={() => onDelete(expense.id)} 
            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <Trash2 size={18} />
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-50">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <CreditCard size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Valor</span>
            </div>
            <p className="text-sm font-bold text-slate-900">{formatCurrency(expense.totalAmount)}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Repeat size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Ciclo</span>
            </div>
            <p className="text-sm font-semibold text-slate-700">{getRecurrenceLabel(expense.recurrence)}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Calendar size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Vencimento</span>
            </div>
            <p className="text-sm font-semibold text-slate-700">Dia {expense.billingDay}</p>
          </div>
          {expense.expenseType === 'SUBSCRIPTION' && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Users size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Vagas</span>
              </div>
              <p className="text-sm font-bold text-emerald-600">{expense.maxVacancies || '∞'}</p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              Participantes Fixos ({expense.participants?.length || 0})
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {expense.participants?.map(p => (
              <div key={p.id} className="group/item flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-100 rounded-full transition-all">
                <span className="text-xs font-semibold text-slate-700 group-hover/item:text-blue-700">{p.participant?.name}</span>
                <div className="h-3 w-[1px] bg-slate-200" />
                <span className="text-[10px] font-bold text-slate-400">{p.vacanciesCount}</span>
                <button 
                  onClick={() => onRemoveParticipant(p.id)} 
                  className="text-slate-300 hover:text-red-500 ml-1 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            {expense.participants?.length === 0 && <p className="text-xs text-slate-400 italic">Nenhum participante vinculado.</p>}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ExpenseCard;
