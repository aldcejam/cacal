import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import OverviewPage from './pages/OverviewPage';
import CardsPage from './pages/CardsPage';
import RecurringExpensesPage from './pages/RecurringExpensesPage';
import IncomesPage from './pages/IncomesPage';
import DesignSystemPage from './pages/DesignSystem';

import { MainLayout } from './components/templates/MainLayout'
import type { Page } from './types';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUsuarios } from './hooks/api/useUsuarios';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
    },
  },
});

const AppRoot = () => {
  const [currentPage, setCurrentPage] = useState<Page>('visao-geral');
  const { data: usuarios = [] } = useUsuarios();
  const currentUser = usuarios.length > 0 ? usuarios[0] : null;

  // menuItems removed as they are unused here

  const renderPage = () => {
    switch (currentPage) {
      case 'visao-geral':
        return <OverviewPage />;
      case 'entradas':
        return <IncomesPage />;
      case 'cartoes':
        return <CardsPage />;
      case 'gastos-recorrentes':
        return <RecurringExpensesPage />;
      case 'design-system':
        return <DesignSystemPage />;
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
    <MainLayout currentPage={currentPage} onNavigate={setCurrentPage} currentUser={currentUser}>
      <ToastContainer />
      {renderPage()}
    </MainLayout>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppRoot />
    </QueryClientProvider>
  </StrictMode>,
)