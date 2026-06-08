import React from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

const Header: React.FC = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Visão Geral';
      case '/participants': return 'Participantes';
      case '/expenses': return 'Despesas';
      case '/billings': return 'Cobranças';
      default: return 'PayMe';
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center px-4 md:px-6 sticky top-0 z-10 shrink-0 gap-2">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <h1 className="text-xl font-semibold text-slate-800">{getPageTitle()}</h1>
    </header>
  );
};

export default Header;
