import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, CircleDashed, History, DollarSign, Plus } from 'lucide-react';
import { billingService } from '@/api/billing.service';
import type { Billing, BillingParticipant } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Modal from '@/components/ui/Modal';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatDate } from '@/utils';

const BillingDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [billing, setBilling] = useState<Billing | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedBP, setSelectedBP] = useState<BillingParticipant | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);

  const fetchDetails = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await billingService.get(id);
      setBilling(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBP) return;
    try {
      await billingService.addPayment({
        billingParticipantId: selectedBP.id,
        amount: paymentAmount,
        notes: 'Pagamento via Web App',
      });
      setIsPaymentModalOpen(false);
      fetchDetails();
    } catch (error) {
      alert('Erro ao registrar pagamento');
    }
  };

  if (loading) return <div className="animate-pulse h-64 bg-slate-100 rounded-2xl" />;
  if (!billing) return <div>Cobrança não encontrada.</div>;

  return (
    <div className="space-y-8">
      <button onClick={() => navigate('/billings')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium">
        <ArrowLeft size={20} /> Voltar para Cobranças
      </button>

      <section className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <DollarSign size={120} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <span className="px-2 py-1 bg-blue-600 rounded text-[10px] font-bold uppercase tracking-wider">
              {billing.status}
            </span>
            <h2 className="text-4xl font-bold mt-4">{billing.expense?.title}</h2>
            <p className="text-slate-400 mt-1">Vencimento: {formatDate(billing.dueDate)} · Parcela #{billing.installmentNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm font-medium uppercase">Valor Total</p>
            <p className="text-5xl font-bold">{formatCurrency(billing.totalAmount)}</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
           Participantes e Pagamentos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {billing.participants?.map((bp: any) => (
            <Card key={bp.id} className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 truncate">{bp.participant?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{bp.participant?.email}</p>
                </div>
                <div className={bp.status === 'PAID' ? 'text-green-500' : 'text-amber-500'}>
                  {bp.status === 'PAID' ? <CheckCircle2 size={24} /> : <CircleDashed size={24} />}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Valor Devido:</span>
                  <span className="font-bold text-slate-800">{formatCurrency(bp.amountDue)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Valor Pago:</span>
                  <span className="font-bold text-green-600">{formatCurrency(bp.amountPaid)}</span>
                </div>
              </div>

              {bp.status !== 'PAID' && (
                <Button variant="default" className="w-full text-xs py-2" onClick={() => { setSelectedBP(bp); setPaymentAmount(Number(bp.amountDue) - Number(bp.amountPaid)); setIsPaymentModalOpen(true); }}>
                   <Plus size={14} /> Registrar Pagamento
                </Button>
              )}

              {bp.payments && bp.payments.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                    <History size={12} /> Histórico
                  </p>
                  <div className="space-y-2">
                    {bp.payments.map((pay: any) => (
                      <div key={pay.id} className="flex justify-between items-center text-[10px] text-slate-600">
                        <span>{formatDate(pay.paymentDate)}</span>
                        <span className="font-bold">{formatCurrency(pay.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title="Registrar Pagamento">
        <form onSubmit={handleAddPayment} className="space-y-4">
           <p className="text-sm text-slate-500">Registrando pagamento para <strong>{selectedBP?.participant?.name}</strong></p>
           <div className="flex flex-col gap-1.5">
             <label className="text-sm font-semibold text-slate-700">Valor do Pagamento</label>
             <Input type="number" step="0.01" value={paymentAmount} onChange={e => setPaymentAmount(Number(e.target.value))} required />
           </div>
           <div className="flex gap-3 pt-4">
              <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsPaymentModalOpen(false)}>Cancelar</Button>
              <Button type="submit" className="flex-1">Confirmar Recebimento</Button>
           </div>
        </form>
      </Modal>
    </div>
  );
};

export default BillingDetailsPage;
