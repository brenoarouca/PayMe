import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit2, Mail, Phone } from 'lucide-react';
import { participantService } from '../../api/participant.service';
import type { Participant } from '../../types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Modal from '../../components/ui/Modal';
import { getInitials } from '../../utils';

const ParticipantsPage: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsNewModalOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const data = await participantService.list();
      setParticipants(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  const handleOpenCreate = () => {
    setEditingParticipant(null);
    setFormData({ name: '', email: '', phone: '' });
    setIsNewModalOpen(true);
  };

  const handleOpenEdit = (p: Participant) => {
    setEditingParticipant(p);
    setFormData({ name: p.name, email: p.email || '', phone: p.phone });
    setIsNewModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        email: formData.email || undefined
      };
      if (editingParticipant) {
        await participantService.update(editingParticipant.id, data);
      } else {
        await participantService.create(data);
      }
      setIsNewModalOpen(false);
      fetchParticipants();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao salvar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente remover este participante?')) return;
    try {
      await participantService.delete(id);
      fetchParticipants();
    } catch (error) {
      alert('Erro ao excluir');
    }
  };

  const filtered = participants.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar participantes..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleOpenCreate} size={'lg'} className="w-full md:w-auto">
          <Plus size={20} /> Novo Participante
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
          <Card key={p.id} className="group relative p-2 flex items-center gap-4 hover:shadow-md hover:border-blue-300 hover:bg-slate-50/50 transition-all duration-200 cursor-pointer">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold text-base shadow-sm">
                {getInitials(p.name)}
              </div>

              <div className='items-center justify-center text-xl'>
                <h1 className="font-semibold text-slate-800 truncate group-hover:text-blue-700 transition-colors">
                  {p.name}
                </h1>
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-0.5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-1 truncate">
                  <Mail size={12} className="shrink-0" />
                  <span className="truncate">{p.email || 'Sem e-mail'}</span>
                </div>
                <span className="hidden sm:inline text-slate-300">•</span>
                <div className="flex items-center gap-1">
                  <Phone size={12} className="shrink-0" />
                  <span>{p.phone || 'Sem telefone'}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0">
              <button
                onClick={() => handleOpenEdit(p)}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-150 hover:scale-105"
                aria-label="Editar"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-150 hover:scale-105"
                aria-label="Excluir"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </Card>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400">
              Nenhum participante encontrado.
            </div>
          )}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsNewModalOpen(false)} title={editingParticipant ? 'Editar Participante' : 'Novo Participante'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Nome</label>
            <Input placeholder="Ex: João Silva" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">E-mail</label>
            <Input type="email" placeholder="joao@exemplo.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Telefone</label>
            <Input placeholder="11999999999" required maxLength={11} value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsNewModalOpen(false)}>Cancelar</Button>
            <Button type="submit" className="flex-1">{editingParticipant ? 'Atualizar' : 'Cadastrar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ParticipantsPage;
