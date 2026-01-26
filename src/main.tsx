import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import DashboardPage from './pages/DashboardPage'
import OverviewPage from './pages/OverviewPage';
import CardsPage from './pages/CardsPage';
import RecurringExpensesPage from './pages/RecurringExpensesPage';
import DesignSystemPage from './pages/DesignSystem';

import { MainLayout } from './components/templates/MainLayout'
import { getUsuarioAtual } from './mocks/usuario'

type Page = 'visao-geral' | 'cartoes' | 'gastos-recorrentes' | 'dashboard' | 'relatorios' | 'configuracoes' | 'design-system';

const AppRoot = () => {
  const currentUser = getUsuarioAtual();
  const [currentPage, setCurrentPage] = useState<Page>(
    currentUser.isPrincipal ? 'visao-geral' : 'cartoes'
  );

  // Assuming menuItems is defined here or passed as a prop to MainLayout
  // The provided snippet suggests it might be defined within AppRoot
  const menuItems = [
    { id: 'visao-geral', label: 'Visão Geral', icon: 'ri-dashboard-line' },
    { id: 'cartoes', label: 'Gerenciamento de Cartões', icon: 'ri-bank-card-line' },
    { id: 'gastos-recorrentes', label: 'Gastos Recorrentes', icon: 'ri-calendar-check-line' },
    { id: 'design-system', label: 'Design System', icon: 'ri-palette-line' }, // Added Design System menu item
    { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line' }, // Existing item, re-added for completeness if this array is new
    { id: 'relatorios', label: 'Relatórios', icon: 'ri-file-chart-line' }, // Existing item, re-added for completeness
    { id: 'configuracoes', label: 'Configurações', icon: 'ri-settings-3-line' }, // Existing item, re-added for completeness
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'visao-geral':
        return <OverviewPage />;
      case 'cartoes':
        return <CardsPage />;
      case 'gastos-recorrentes':
        return <RecurringExpensesPage />;
      case 'design-system':
        return <DesignSystemPage />;
      case 'dashboard':
        return <DashboardPage />;
      // Mapping Relatorios to DashboardPage just so it's visible, assuming home.tsx was intended for that
      case 'relatorios':
        return <DashboardPage />;
      case 'configuracoes':
        return (
          <div className="flex-1 p-6 md:p-8 overflow-y-auto w-full flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-2">Configurações</h1>
              <p className="text-muted-foreground">Em breve...</p>
            </div>
          </div>
        );
      default:
        return <CardsPage />;
    }
  };

  return (
    <MainLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </MainLayout>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>,
)