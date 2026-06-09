import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/Modal';
import { Stepper } from '@/components/ui/stepper';
import { expenseService } from '../../../api/expense.service';
import type { Participant } from '../../../types';
import StepInfo, { type ExpenseFormData } from './steps/StepInfo';
import StepParticipants from './steps/StepParticipants';
import StepReview from './steps/StepReview';
import ParticipantModal from './ParticipantModal';

const STEPS = [
  { id: 'info', title: 'Informações', description: 'Dados básicos' },
  { id: 'participants', title: 'Participantes', description: 'Vincular pessoas' },
  { id: 'review', title: 'Resumo', description: 'Confirmar' }
];

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
  onRefresh: () => void;
  onParticipantCreated: (participant: Participant) => void;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({ 
  isOpen, 
  onClose, 
  participants, 
  onRefresh,
  onParticipantCreated
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isNewParticipantModalOpen, setIsNewParticipantModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<ExpenseFormData>({
    title: '',
    description: '',
    expenseType: 'SUBSCRIPTION',
    recurrence: 'MONTHLY',
    totalAmount: 0,
    installmentsCount: 1,
    billingDay: 5,
    maxVacancies: undefined,
    selectedParticipants: [],
  });

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      expenseType: 'SUBSCRIPTION',
      recurrence: 'MONTHLY',
      totalAmount: 0,
      installmentsCount: 1,
      billingDay: 5,
      maxVacancies: undefined,
      selectedParticipants: [],
    });
    setCurrentStep(0);
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
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

      onRefresh();
      onClose();
    } catch (error) {
      alert('Erro ao criar despesa');
    } finally {
      setLoading(false);
    }
  };

  const handleParticipantCreated = (participant: Participant) => {
    onParticipantCreated(participant);
    setFormData(prev => ({
      ...prev,
      selectedParticipants: [
        ...prev.selectedParticipants, 
        { participantId: participant.id, vacanciesCount: 1, name: participant.name }
      ]
    }));
  };

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title="Nova Definição de Despesa"
        className="max-w-4xl p-2"
      >
        <div className="flex flex-col h-full max-h-[85vh]">
          <div className="flex-1 pr-2 custom-scrollbar">
            <Stepper steps={STEPS} currentStep={currentStep} className="mb-20" />
            
            <div>
              {currentStep === 0 && (
                <StepInfo formData={formData} setFormData={setFormData} />
              )}

              {currentStep === 1 && (
                <StepParticipants 
                  participants={participants} 
                  formData={formData} 
                  setFormData={setFormData}
                  onOpenParticipantModal={() => setIsNewParticipantModalOpen(true)}
                />
              )}

              {currentStep === 2 && (
                <StepReview formData={formData} />
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex gap-3">
            {currentStep > 0 && (
              <Button variant="link" size={'lg'} onClick={handleBack} className="flex-1" disabled={loading}>
                <ChevronLeft size={18} className="mr-1" /> Voltar
              </Button>
            )}
            {currentStep < STEPS.length - 1 ? (
              <Button 
                variant={'link'} 
                size={'lg'} 
                onClick={handleNext} 
                className="flex-1" 
                disabled={!formData.title || formData.totalAmount <= 0}
              >
                Próximo Passo <ChevronRight size={18} className="ml-1" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                size={'lg'} 
                className="flex-1 bg-green-700 hover:bg-green-800 text-white border-none"
                disabled={loading}
              >
                {loading ? 'Criando...' : 'Criar Despesa'} <Check size={18} className="ml-1" />
              </Button>
            )}
          </div>
        </div>
      </Modal>

      <ParticipantModal 
        isOpen={isNewParticipantModalOpen} 
        onClose={() => setIsNewParticipantModalOpen(false)}
        onSuccess={handleParticipantCreated}
      />
    </>
  );
};

export default ExpenseModal;
