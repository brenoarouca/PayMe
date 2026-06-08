import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Users, Search, ChevronRight, ChevronLeft, Check, CreditCard, Repeat, Calendar, Info, UserPlus } from 'lucide-react';
import { expenseService } from '../../api/expense.service';
import { participantService } from '../../api/participant.service';
import type { Expense, Participant } from '../../types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Modal from '@/components/ui/Modal';
import { Stepper } from '@/components/ui/stepper';
import { formatCurrency, getRecurrenceLabel, getExpenseTypeLabel } from '../../utils';

const STEPS = [
  { id: 'info', title: 'Informações', description: 'Dados básicos' },
  { id: 'participants', title: 'Participantes', description: 'Vincular pessoas' },
  { id: 'review', title: 'Resumo', description: 'Confirmar' }
];

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewParticipantModalOpen, setIsNewParticipantModalOpen] = useState(false);
  const [newParticipantData, setNewParticipantData] = useState({ name: '', email: '', phone: '' });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    expenseType: 'SUBSCRIPTION' as any,
    recurrence: 'MONTHLY' as any,
    totalAmount: 0,
    installmentsCount: 1,
    billingDay: 5,
    maxVacancies: undefined as number | undefined,
    selectedParticipants: [] as { participantId: string; vacanciesCount: number; name: string }[],
  });

  const fetchData = async () => {
    try {
      const [expData, partData] = await Promise.all([
        expenseService.list(),
        participantService.list(),
      ]);
      setExpenses(expData);
      setParticipants(partData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const { selectedParticipants, ...rest } = formData;
      const data = { ...rest };
      if (data.expenseType !== 'SUBSCRIPTION') {
        delete data.maxVacancies;
      }
      
      const createdExpense = await expenseService.create(data);
      
      if (selectedParticipants.length > 0) {
        await Promise.all(
          selectedParticipants.map(p => 
            expenseService.addParticipant({
              expenseId: createdExpense.id,
              participantId: p.participantId,
              vacanciesCount: p.vacanciesCount,
            })
          )
        );
      }

      setIsExpenseModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      alert('Erro ao criar despesa');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      expenseType: 'SUBSCRIPTION' as any,
      recurrence: 'MONTHLY' as any,
      totalAmount: 0,
      installmentsCount: 1,
      billingDay: 5,
      maxVacancies: undefined,
      selectedParticipants: [],
    });
    setCurrentStep(0);
  };

  const handleCreateParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...newParticipantData,
        email: newParticipantData.email || undefined
      };
      const created = await participantService.create(data);
      setParticipants([...participants, created]);
      setIsNewParticipantModalOpen(false);
      setNewParticipantData({ name: '', email: '', phone: '' });
      toggleParticipant(created);
    } catch (error) {
      alert('Erro ao criar participante');
    }
  };

  const toggleParticipant = (p: Participant) => {
    const isSelected = formData.selectedParticipants.find(sp => sp.participantId === p.id);
    if (isSelected) {
      setFormData({
        ...formData,
        selectedParticipants: formData.selectedParticipants.filter(sp => sp.participantId !== p.id)
      });
    } else {
      setFormData({
        ...formData,
        selectedParticipants: [...formData.selectedParticipants, { participantId: p.id, vacanciesCount: 1, name: p.name }]
      });
    }
  };

  const updateVacancies = (participantId: string, count: number) => {
    setFormData({
      ...formData,
      selectedParticipants: formData.selectedParticipants.map(sp => 
        sp.participantId === participantId ? { ...sp, vacanciesCount: count } : sp
      )
    });
  };

  const filteredParticipants = participants.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.phone.includes(searchTerm)
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta definição de despesa?')) return;
    await expenseService.delete(id);
    fetchData();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Definições de Despesas</h2>
          <p className="text-slate-500">Gerencie seus modelos de gastos e assinaturas recorrentes.</p>
        </div>
        <Button onClick={() => { resetForm(); setIsExpenseModalOpen(true); }} size={'lg'}>
          <Plus size={20} className="mr-2" /> Nova Despesa
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {expenses.map(exp => (
          <Card key={exp.id} className="overflow-hidden border-slate-200/60 hover:border-blue-300 transition-all duration-300 group">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{exp.title}</h3>
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full uppercase border border-blue-100">
                      {getExpenseTypeLabel(exp.expenseType)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-1">{exp.description || 'Sem descrição detalhada'}</p>
                </div>
                <Button variant={'secondary'} size={'icon'} 
                  onClick={() => handleDelete(exp.id)} 
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
                  <p className="text-sm font-bold text-slate-900">{formatCurrency(exp.totalAmount)}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Repeat size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Ciclo</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">{getRecurrenceLabel(exp.recurrence)}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Vencimento</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">Dia {exp.billingDay}</p>
                </div>
                {exp.expenseType === 'SUBSCRIPTION' && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Users size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Vagas</span>
                    </div>
                    <p className="text-sm font-bold text-emerald-600">{exp.maxVacancies || '∞'}</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    Participantes Fixos ({exp.participants?.length || 0})
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {exp.participants?.map(p => (
                    <div key={p.id} className="group/item flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-100 rounded-full transition-all">
                      <span className="text-xs font-semibold text-slate-700 group-hover/item:text-blue-700">{p.participant?.name}</span>
                      <div className="h-3 w-[1px] bg-slate-200" />
                      <span className="text-[10px] font-bold text-slate-400">{p.vacanciesCount}v</span>
                      <button 
                        onClick={() => { expenseService.removeParticipant(p.id).then(fetchData); }} 
                        className="text-slate-300 hover:text-red-500 ml-1 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  {exp.participants?.length === 0 && <p className="text-xs text-slate-400 italic">Nenhum participante vinculado.</p>}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal 
        isOpen={isExpenseModalOpen} 
        onClose={() => setIsExpenseModalOpen(false)} 
        title="Nova Definição de Despesa"
        className="max-w-4xl p-2"
      >
        <div className="flex flex-col h-full max-h-[85vh]">
          <div className="flex-1 pr-2 custom-scrollbar">
            <Stepper steps={STEPS} currentStep={currentStep} className="mb-20" />
            
            <div>
              {currentStep === 0 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Título da Despesa</label>
                      <Input placeholder="Ex: Netflix Premium" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Descrição (Opcional)</label>
                      <Input placeholder="Detalhes sobre a divisão..." value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
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
                      <Input type="number" step="0.01" required value={formData.totalAmount} onChange={e => setFormData({...formData, totalAmount: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dia de Cobrança</label>
                      <Input type="number" min="1" max="31" value={formData.billingDay} onChange={e => setFormData({...formData, billingDay: Number(e.target.value)})} />
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
              )}

              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex flex-col gap-4">
                    <div className="relative group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                      <input
                        type="text"
                        placeholder="Buscar por nome ou telefone..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="secondary" size={'lg'} onClick={() => setIsNewParticipantModalOpen(true)} className="w-full">
                      <UserPlus size={32} className="mr-2" /> Cadastrar Novo Participante
                    </Button>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredParticipants.map(p => {
                      const selected = formData.selectedParticipants.find(sp => sp.participantId === p.id);
                      return (
                        <div 
                          key={p.id} 
                          onClick={() => toggleParticipant(p)}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                            selected ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${selected ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                              {p.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{p.phone}</p>
                            </div>
                          </div>
                          {selected && <div className="bg-blue-500 rounded-full p-1"><Check size={14} className="text-white" /></div>}
                        </div>
                      );
                    })}
                  </div>

                  {formData.selectedParticipants.length > 0 && (
                    <div className="space-y-4 pt-6 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ajustar Vagas</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                          {formData.selectedParticipants.reduce((acc, curr) => acc + curr.vacanciesCount, 0)} vagas totais
                        </span>
                      </div>
                      <div className="grid gap-2">
                        {formData.selectedParticipants.map(sp => (
                          <div key={sp.participantId} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-sm font-bold text-slate-700">{sp.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Vagas:</span>
                              <input 
                                type="number" 
                                min="1" 
                                className="w-16 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-bold text-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                                value={sp.vacanciesCount}
                                onChange={(e) => updateVacancies(sp.participantId, Number(e.target.value))}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="bg-blue-600 rounded-3xl p-8 text-white space-y-8 shadow-xl shadow-blue-200">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">Resumo da Configuração</p>
                      <h4 className="text-3xl font-black">{formData.title}</h4>
                      <p className="text-sm opacity-80">{formData.description || 'Nenhuma descrição fornecida.'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/10">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Valor por Ciclo</p>
                        <p className="text-2xl font-black">{formatCurrency(formData.totalAmount)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Dia do Mês</p>
                        <p className="text-2xl font-black">{formData.billingDay}º</p>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-white/10 space-y-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Divisão Confirmada</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.selectedParticipants.map(sp => (
                          <div key={sp.participantId} className="px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                            <span className="text-xs font-bold">{sp.name}</span>
                            <span className="text-[10px] opacity-60">({sp.vacanciesCount}v)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex gap-3">
            {currentStep > 0 && (
              <Button variant="link" size={'lg'} onClick={handleBack} className="flex-1">
                <ChevronLeft size={18} className="mr-1" /> Voltar
              </Button>
            )}
            {currentStep < STEPS.length - 1 ? (
              <Button variant={'link'} size={'lg'} onClick={handleNext} className="flex-1" disabled={!formData.title || formData.totalAmount <= 0}>
                Próximo Passo <ChevronRight size={18} className="ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} size={'lg'} className="flex-1 bg-green-700 hover:bg-green-800 text-white border-none">
                Criar Despesa <Check size={18} className="ml-1" />
              </Button>
            )}
          </div>
        </div>
      </Modal>

      <Modal isOpen={isNewParticipantModalOpen} onClose={() => setIsNewParticipantModalOpen(false)} title="Novo Participante">
        <form onSubmit={handleCreateParticipant} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Nome</label>
            <Input placeholder="João da Silva" required value={newParticipantData.name} onChange={e => setNewParticipantData({...newParticipantData, name: e.target.value})} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">E-mail</label>
            <Input type="email" placeholder="joao@email.com" value={newParticipantData.email} onChange={e => setNewParticipantData({...newParticipantData, email: e.target.value})} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Telefone</label>
            <Input placeholder="11999999999" required maxLength={11} value={newParticipantData.phone} onChange={e => setNewParticipantData({...newParticipantData, phone: e.target.value})} />
          </div>
          <div className="flex gap-3 pt-6">
            <Button type="button" size={'lg'} variant="secondary" className="flex-1" onClick={() => setIsNewParticipantModalOpen(false)}>Cancelar</Button>
            <Button type="submit" className="flex-1 shadow-lg shadow-blue-100" size={'lg'} >Cadastrar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ExpensesPage;
