import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// @ts-ignore
import App from './App.tsx'

// --- Ícones (Reutilizáveis) ---
const Icons = {
  Home: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  CreditCard: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>,
  PieChart: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg>,
  Settings: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.35a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>,
  Menu: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>,
};

// --- Componente Sidebar ---
const Sidebar = ({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar: () => void }) => {
  const menuItems = [
    { name: 'Dashboard', icon: <Icons.Home />, active: false },
    { name: 'Meus Cartões', icon: <Icons.CreditCard />, active: true },
    { name: 'Relatórios', icon: <Icons.PieChart />, active: false },
    { name: 'Configurações', icon: <Icons.Settings />, active: false },
  ];

  return (
    <>
      {/* Overlay Mobile */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />

      {/* Container da Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-50 h-screen bg-card border-r border-border
        transition-all duration-300 ease-in-out flex flex-col whitespace-nowrap overflow-hidden
        ${isOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'}
      `}>
        {/* Header da Sidebar (Com o botão Burger Integrado) */}
        <div className={`h-16 flex items-center px-4 border-b border-border/50 transition-all ${isOpen ? 'justify-between' : 'justify-center'}`}>

          {/* Logo e Nome (Visíveis quando aberto) */}
          <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
            <div className="w-8 h-8 min-w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-900/20">
              <div className="w-4 h-4 bg-white rounded-full opacity-90" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">MinhasContas</span>
          </div>

          {/* Botão Burger (Dentro da Sidebar) */}
          {/* No mobile, este botão fecha a sidebar. No desktop, alterna entre expandido/colapsado. */}
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors ${!isOpen && 'md:mx-auto'}`}
            title={isOpen ? "Recolher Menu" : "Expandir Menu"}
          >
            <Icons.Menu />
          </button>
        </div>

        {/* Navegação */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => (
            <button
              key={item.name}
              title={!isOpen ? item.name : ''}
              className={`
                w-full flex items-center rounded-lg text-sm font-medium transition-all duration-200 group
                ${item.active
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}
                ${isOpen ? 'px-3 py-2.5 gap-3' : 'justify-center py-3 px-0'}
              `}
            >
              <span className="min-w-[20px]">{item.icon}</span>
              <span className={`transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                {item.name}
              </span>

              {/* Tooltip simples para modo colapsado */}
              {!isOpen && (
                <div className="hidden md:group-hover:block absolute left-16 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-md border border-border z-50 whitespace-nowrap ml-2">
                  {item.name}
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Footer / Usuário */}
        <div className="p-4 border-t border-border/50">
          <div className={`flex items-center rounded-xl bg-secondary/30 border border-border/50 transition-all ${isOpen ? 'gap-3 p-3' : 'justify-center p-2'}`}>
            <div className="w-8 h-8 min-w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />
            <div className={`flex-1 overflow-hidden transition-all duration-200 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>
              <p className="text-sm font-medium truncate text-foreground">Usuário</p>
              <p className="text-xs text-muted-foreground truncate">plano pro</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

// --- Layout Principal ---
const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar Mobile para estado inicial
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Se for mobile, começa fechado. Se desktop, começa aberto.
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground overflow-x-hidden">

      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <main className="flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out min-w-0 relative">

        {/* Botão Trigger Flutuante (Apenas Mobile quando fechado) */}
        {/* Como a sidebar fecha completamente no mobile, precisamos desse botão fora dela para abrir */}
        <div className={`md:hidden absolute top-6 left-4 z-30 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <button
            onClick={toggleSidebar}
            className="p-2 bg-card border border-border rounded-md shadow-sm text-foreground"
          >
            <Icons.Menu />
          </button>
        </div>

        <App />
      </main>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Layout />
  </StrictMode>,
)