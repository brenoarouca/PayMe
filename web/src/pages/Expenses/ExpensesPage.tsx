import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { expenseService } from '../../api/expense.service';
import { participantService } from '../../api/participant.service';
import type { Expense, Participant } from '../../types';
import { Button } from '@/components/ui/button';
import ExpenseCard from './components/ExpenseCard';
import ExpenseModal from './components/ExpenseModal';

const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [expData, partData] = await Promise.all([
        expenseService.list(),
        participantService.list(),
      ]);
      setExpenses(expData);
      setParticipants(partData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Excluir esta definição de despesa?')) return;
    try {
      await expenseService.delete(id);
      fetchData();
    } catch (error) {
      alert('Erro ao excluir despesa');
    }
  };

  const handleRemoveParticipant = async (participantExpenseId: string) => {
    try {
      await expenseService.removeParticipant(participantExpenseId);
      fetchData();
    } catch (error) {
      alert('Erro ao remover participante');
    }
  };

  const handleParticipantCreated = (participant: Participant) => {
    setParticipants(prev => [...prev, participant]);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Definições de Despesas</h2>
          <p className="text-slate-500">Gerencie seus modelos de gastos e assinaturas recorrentes.</p>
        </div>
        <Button onClick={() => setIsExpenseModalOpen(true)} size={'lg'}>
          <Plus size={20} className="mr-2" /> Nova Despesa
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {expenses.map(exp => (
          <ExpenseCard 
            key={exp.id} 
            expense={exp} 
            onDelete={handleDeleteExpense}
            onRemoveParticipant={handleRemoveParticipant}
          />
        ))}
        {expenses.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">Nenhuma despesa cadastrada ainda.</p>
          </div>
        )}
      </div>

      <ExpenseModal 
        isOpen={isExpenseModalOpen} 
        onClose={() => setIsExpenseModalOpen(false)}
        participants={participants}
        onRefresh={fetchData}
        onParticipantCreated={handleParticipantCreated}
      />
    </div>
  );
};

export default ExpensesPage;
