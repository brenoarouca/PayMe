import React from 'react';
import { formatCurrency } from '../../../../utils';
import type { ExpenseFormData } from './StepInfo';

interface StepReviewProps {
  formData: ExpenseFormData;
}

const StepReview: React.FC<StepReviewProps> = ({ formData }) => {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Cabeçalho */}
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{formData.title}</h3>
          {formData.description && (
            <p className="text-sm text-gray-500 mt-1">{formData.description}</p>
          )}
        </div>

        {/* Valores principais */}
        <div className="p-5 border-b border-gray-100 bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Valor</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(formData.totalAmount)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Dia do mês</p>
              <p className="text-2xl font-bold text-gray-900">{formData.billingDay}º</p>
            </div>
          </div>
        </div>

        {/* Lista de participantes */}
        <div className="p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">
            Participantes ({formData.selectedParticipants.length})
          </p>
          <div className="space-y-3">
            {formData.selectedParticipants.map(sp => (
              <div 
                key={sp.participantId} 
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{sp.name}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500">{sp.vacanciesCount} vaga(s)</span>
                </div>
              </div>
            ))}
            {formData.selectedParticipants.length === 0 && (
              <p className="text-sm text-gray-400 italic">Nenhum participante selecionado.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepReview;
