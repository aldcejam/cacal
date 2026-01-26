import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import DashboardPage from './pages/DashboardPage'
import CardsPage from './pages/CardsPage'
import OverviewPage from './pages/OverviewPage'
import RecurringExpensesPage from './pages/RecurringExpensesPage'

import { MainLayout } from './components/templates/MainLayout'
import { getUsuarioAtual } from './mocks/usuario'

type Page = 'visao-geral' | 'cartoes' | 'gastos-recorrentes' | 'dashboard' | 'relatorios' | 'configuracoes';

const AppRoot = () => {
  const currentUser = getUsuarioAtual();
  const [currentPage, setCurrentPage] = useState<Page>(
    currentUser.isPrincipal ? 'visao-geral' : 'cartoes'
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'visao-geral':
        return <OverviewPage />;
      case 'cartoes':
        return <CardsPage />;
      case 'gastos-recorrentes':
        return <RecurringExpensesPage />;
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