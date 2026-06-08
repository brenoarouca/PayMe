import React, { useState, useEffect } from 'react';
import { ArrowUpRight, TrendingUp, Clock, Users, Receipt } from 'lucide-react';
import { billingService } from '../../api/billing.service';
import { participantService } from '../../api/participant.service';
import type { Billing } from '../../types';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '../../utils';

const DashboardPage: React.FC = () => {
  const [billings, setBillings] = useState<Billing[]>([]);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [billingsData, participantsData] = await Promise.all([
          billingService.list(),
          participantService.list(),
        ]);
        setBillings(billingsData);
        setParticipantsCount(participantsData.length);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalAmount = billings.reduce((sum, b) => sum + Number(b.totalAmount), 0);
  const totalPaid = billings.reduce((sum, b) => {
    const paid = b.participants?.reduce((s, p) => s + Number(p.amountPaid), 0) || 0;
    return sum + paid;
  }, 0);
  const totalPending = totalAmount - totalPaid;

  const stats = [
    { label: 'Total Cobrado', value: formatCurrency(totalAmount), icon: <Receipt size={24} />, color: 'blue' },
    { label: 'Total Recebido', value: formatCurrency(totalPaid), icon: <TrendingUp size={24} />, color: 'green' },
    { label: 'Total Pendente', value: formatCurrency(totalPending), icon: <Clock size={24} />, color: 'amber' },
    { label: 'Participantes', value: String(participantsCount), icon: <Users size={24} />, color: 'purple' },
  ];

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-2xl" />)}
    </div>
    <div className="h-64 bg-slate-200 rounded-2xl" />
  </div>;

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Panorama Financeiro</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <Card key={s.label} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{s.label}</p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-2">{s.value}</h3>
                </div>
                <div className={`p-3 rounded-xl bg-${s.color}-50 text-${s.color}-600`}>
                  {s.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Cobranças Recentes</h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            Ver todas <ArrowUpRight size={20} />
          </button>
        </div>
        
        <Card className="divide-y divide-slate-100">
          {billings.slice(0, 5).map(b => (
            <div key={b.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                  <Receipt size={20} />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{b.expense?.title || 'Cobrança Avulsa'}</p>
                  <p className="text-xs text-slate-500">Vencimento: {new Date(b.dueDate).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-800">{formatCurrency(b.totalAmount)}</p>
                <p className={`text-[10px] font-bold uppercase ${b.status === 'PAID' ? 'text-green-500' : 'text-amber-500'}`}>
                  {b.status}
                </p>
              </div>
            </div>
          ))}
          {billings.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              Nenhuma cobrança registrada ainda.
            </div>
          )}
        </Card>
      </section>
    </div>
  );
};

export default DashboardPage;
