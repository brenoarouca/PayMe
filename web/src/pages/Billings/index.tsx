import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ChevronRight } from 'lucide-react';
import { billingService } from '../../api/billing.service';
import { expenseService } from '../../api/expense.service';
import type { Billing, Expense } from '../../types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Modal from '@/components/ui/Modal';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatDate, getBillingStatusLabel } from '../../utils';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const BillingsPage: React.FC = () => {
  const [billings, setBillings] = useState<Billing[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    expenseId: '',
    dueDate: '',
    totalAmount: 0,
    installmentNumber: 1,
  });

  const fetchData = async () => {
    try {
      const [billData, expData] = await Promise.all([
        billingService.list(),
        expenseService.list(),
      ]);
      setBillings(billData);
      setExpenses(expData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await billingService.create(formData);
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert('Erro ao criar cobrança');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Ocorrências de Cobrança</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> Nova Cobrança
        </Button>
      </div>

      <Card>
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Despesa</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Vencimento</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Parcela</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Valor Total</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {billings.map(b => (
              <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <p className="font-semibold text-slate-800">{b.expense?.title || 'Avulsa'}</p>
                </td>
                <td className="p-4 text-slate-600 font-medium">{formatDate(b.dueDate)}</td>
                <td className="p-4 text-slate-500">#{b.installmentNumber || 1}</td>
                <td className="p-4 font-bold text-slate-800">{formatCurrency(b.totalAmount)}</td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    b.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {getBillingStatusLabel(b.status)}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Link to={`/billings/${b.id}`} className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm font-bold">
                    Detalhes <ChevronRight size={16} />
                  </Link>
                </td>
              </tr>
            ))}
            {billings.length === 0 && (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-400 italic">Nenhuma cobrança gerada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Gerar Nova Ocorrência">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Selecione a Despesa Mestre</label>
            <Select 
              required 
              value={formData.expenseId}
              onValueChange={value => {
                const exp = expenses.find(ex => ex.id === value);
                setFormData({...formData, expenseId: value, totalAmount: exp?.totalAmount || 0});
              }}
            >
              <SelectTrigger className="w-full h-10 px-4">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent position="popper">
                {expenses.map(e => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Data de Vencimento</label>
            <Input type="date" required value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Valor Total</label>
            <Input type="number" step="0.01" value={formData.totalAmount} required onChange={e => setFormData({...formData, totalAmount: Number(e.target.value)})} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Número da Parcela</label>
            <Input type="number" min="1" value={formData.installmentNumber} onChange={e => setFormData({...formData, installmentNumber: Number(e.target.value)})} />
          </div>
          <div className="flex gap-3 pt-4">
             <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
             <Button type="submit" className="flex-1">Gerar Cobrança</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BillingsPage;
