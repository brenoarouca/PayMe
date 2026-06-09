import React, { useState } from 'react';
import { Search, UserPlus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Participant } from '../../../../types';
import type { ExpenseFormData } from './StepInfo';

interface StepParticipantsProps {
  participants: Participant[];
  formData: ExpenseFormData;
  setFormData: React.Dispatch<React.SetStateAction<ExpenseFormData>>;
  onOpenParticipantModal: () => void;
}

const StepParticipants: React.FC<StepParticipantsProps> = ({ 
  participants, 
  formData, 
  setFormData, 
  onOpenParticipantModal 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParticipants = participants.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.phone.includes(searchTerm)
  );

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

  return (
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
        <Button variant="secondary" size={'lg'} onClick={onOpenParticipantModal} className="w-full">
          <UserPlus size={20} className="mr-2" /> Cadastrar Novo Participante
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
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StepParticipants;
