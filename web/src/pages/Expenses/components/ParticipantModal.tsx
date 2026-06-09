import React, { useState } from 'react';
import { participantService } from '../../../api/participant.service';
import type { Participant } from '../../../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Modal from '@/components/ui/Modal';

interface ParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (participant: Participant) => void;
}

const ParticipantModal: React.FC<ParticipantModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [newParticipantData, setNewParticipantData] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleCreateParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...newParticipantData,
        email: newParticipantData.email || undefined
      };
      const created = await participantService.create(data);
      onSuccess(created);
      setNewParticipantData({ name: '', email: '', phone: '' });
      onClose();
    } catch (error) {
      alert('Erro ao criar participante');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Participante">
      <form onSubmit={handleCreateParticipant} className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Nome</label>
          <Input 
            placeholder="João da Silva" 
            required 
            value={newParticipantData.name} 
            onChange={e => setNewParticipantData({...newParticipantData, name: e.target.value})} 
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">E-mail</label>
          <Input 
            type="email" 
            placeholder="joao@email.com" 
            value={newParticipantData.email} 
            onChange={e => setNewParticipantData({...newParticipantData, email: e.target.value})} 
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Telefone</label>
          <Input 
            placeholder="11999999999" 
            required 
            maxLength={11} 
            value={newParticipantData.phone} 
            onChange={e => setNewParticipantData({...newParticipantData, phone: e.target.value})} 
          />
        </div>
        <div className="flex gap-3 pt-6">
          <Button 
            type="button" 
            size={'lg'} 
            variant="secondary" 
            className="flex-1" 
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="flex-1 shadow-lg shadow-blue-100" 
            size={'lg'}
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ParticipantModal;
