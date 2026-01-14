import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import 'remixicon/fonts/remixicon.css';

// ==========================================
// 0. CONFIGURAÇÃO DE CORES (JS)
// Para sincronizar gráficos com o CSS
// ==========================================
const THEME = {
  primary: '#10b981', // theme-10
  danger: '#ef4444',  // danger
  grid: '#334155',    // theme-30-border
  text: '#94a3b8',    // text-muted
  tooltipBg: '#1e293b', // theme-30
};

// ==========================================
// 1. DADOS MOCKADOS
// ==========================================

const chartData = [
  { name: 'Ago', Receitas: 11000, Despesas: 8500 },
  { name: 'Set', Receitas: 12500, Despesas: 9000 },
  { name: 'Out', Receitas: 11800, Despesas: 9800 },
  { name: 'Nov', Receitas: 12900, Despesas: 9500 },
  { name: 'Dez', Receitas: 13500, Despesas: 11500 },
  { name: 'Jan', Receitas: 7700,  Despesas: 747 },
];

const cardsData = [
  {
    id: 1,
    name: 'Nubank Roxinho',
    limit: 5000,
    available: 2660,
    closing: 15,
    due: 22,
    colorFrom: '#8b5cf6',
    colorTo: '#7c3aed',
    percent: 53.2
  },
  {
    id: 2,
    name: 'Inter Gold',
    limit: 8000,
    available: 3440,
    closing: 10,
    due: 17,
    colorFrom: '#f59e0b',
    colorTo: '#d97706',
    percent: 43
  },
  {
    id: 3,
    name: 'C6 Bank',
    limit: 3500,
    available: 2220,
    closing: 5,
    due: 12,
    colorFrom: '#10b981',
    colorTo: '#059669',
    percent: 63.4
  }
];

const projectionData = [
  { month: 'jan', value: 400, limit: 4600, percent: 8.0 },
  { month: 'fev', value: 400, limit: 4600, percent: 8.0 },
  { month: 'mar', value: 400, limit: 4600, percent: 8.0 },
  { month: 'abr', value: 400, limit: 4600, percent: 8.0 },
  { month: 'mai', value: 400, limit: 4600, percent: 8.0 },
  { month: 'jun', value: 300, limit: 4700, percent: 6.0 },
];

const transactionsData = [
  { id: 1, desc: 'Notebook Dell', category: 'Tecnologia', card: 'Nubank Roxinho', parcels: '3/12', value: 300, total: 3600, status: 'Pago', icon: 'ri-computer-line', color: 'blue' },
  { id: 2, desc: 'Netflix Premium', category: 'Lazer', card: 'Inter Gold', parcels: '1/1', value: 55.90, total: null, status: 'Pago', icon: 'ri-gamepad-line', color: 'violet' },
  { id: 3, desc: 'Academia SmartFit', category: 'Saúde', card: 'C6 Bank', parcels: '1/1', value: 89.90, total: null, status: 'Pago', icon: 'ri-heart-pulse-line', color: 'emerald' },
  { id: 4, desc: 'Spotify Duo', category: 'Lazer', card: 'Nubank Roxinho', parcels: '1/1', value: 21.90, total: null, status: 'Pago', icon: 'ri-music-line', color: 'violet' },
  { id: 5, desc: 'Restaurante', category: 'Alimentação', card: 'C6 Bank', parcels: '1/1', value: 180.00, total: null, status: 'Pago', icon: 'ri-restaurant-line', color: 'red' },
  { id: 6, desc: 'Curso Udemy', category: 'Educação', card: 'Nubank Roxinho', parcels: '1/6', value: 100.00, total: 600, status: 'Pago', icon: 'ri-book-open-line', color: 'cyan' },
];

// ==========================================
// 2. COMPONENTES DE UI (Base)
// ==========================================

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  // Uso: bg-theme-30 (30%) com opacidade para efeito glass
  <div className={`bg-theme-30/50 backdrop-blur-md border border-theme-30-border rounded-2xl p-6 shadow-xl ${className}`}>
    {children}
  </div>
);

const Badge = ({ color, children }: { color?: string; children: React.ReactNode }) => {
  // Ajustado para usar opacidades das cores funcionais
  const colors: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-400',
    violet: 'bg-violet-500/10 text-violet-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    red: 'bg-red-500/10 text-red-400',
    cyan: 'bg-cyan-500/10 text-cyan-400',
    default: 'bg-theme-30 text-text-muted'
  };
  const colorClass = colors[color ?? 'default'] || colors.default;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap border border-white/5 ${colorClass}`}>
      {children}
    </span>
  );
};

// ==========================================
// 3. COMPONENTES FUNCIONAIS (Features)
// ==========================================

const Header = () => (
  // Uso: bg-theme-60-alt (Variação do 60%)
  <header className="sticky top-0 z-40 bg-theme-60-alt/80 backdrop-blur-md border-b border-theme-30-border">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-theme-10/20 rounded-lg flex items-center justify-center">
            <i className="ri-wallet-3-fill text-2xl text-theme-10"></i>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">FinanceFlow</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex bg-theme-30 rounded-full p-1 gap-1">
            <button className="px-4 py-1.5 rounded-full text-sm font-medium bg-theme-10 text-white shadow-lg shadow-theme-10/20">Minhas Finanças</button>
            <button className="px-4 py-1.5 rounded-full text-sm font-medium text-text-muted hover:text-white transition-colors">Finanças do Grupo</button>
          </div>
          {/* Botão de Ação Principal (10%) com hover semântico */}
          <button className="bg-theme-10 hover:bg-theme-10-hover text-white px-5 py-2.5 rounded-lg font-medium shadow-lg shadow-theme-10/20 flex items-center gap-2 transition-all active:scale-95">
            <i className="ri-add-line text-lg"></i>
            <span className="hidden sm:inline">Nova Despesa</span>
          </button>
        </div>
      </div>
    </div>
  </header>
);

const KPIGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Card Especial (Destaque) - Mantendo gradient específico pois é identidade visual */}
    <div className="rounded-2xl p-6 shadow-xl bg-gradient-to-br from-theme-10 to-theme-10-hover relative overflow-hidden text-white">
      <div className="relative z-10">
        <div className="flex justify-between mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm"><i className="ri-wallet-3-line text-2xl"></i></div>
          <span className="text-emerald-50 font-medium text-sm">Saldo Atual</span>
        </div>
        <h3 className="text-3xl font-bold mb-1">R$ 6.952,30</h3>
        <p className="text-emerald-50 text-sm">Positivo este mês</p>
      </div>
      <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
    </div>

    {/* Card Receitas - Uso de text-muted (30%) e text-theme-10 (10%) */}
    <GlassCard> 
      <div className="flex justify-between mb-4">
        <div className="w-12 h-12 bg-theme-10/10 rounded-xl flex items-center justify-center"><i className="ri-arrow-down-line text-2xl text-theme-10"></i></div>
        <span className="text-text-muted text-sm font-medium">Receitas do Mês</span>
      </div>
      <h3 className="text-3xl font-bold text-white mb-1">R$ 7.700,00</h3>
      <p className="text-text-muted text-sm">2 entrada(s)</p>
    </GlassCard>

    {/* Card Despesas - Uso de Cores Funcionais */}
    <GlassCard>
      <div className="flex justify-between mb-4">
        <div className="w-12 h-12 bg-danger/10 rounded-xl flex items-center justify-center"><i className="ri-arrow-up-line text-2xl text-danger"></i></div>
        <span className="text-text-muted text-sm font-medium">Despesas do Mês</span>
      </div>
      <h3 className="text-3xl font-bold text-white mb-1">R$ 747,70</h3>
      <p className="text-text-muted text-sm">6 despesa(s)</p>
    </GlassCard>
  </div>
);

const FinancialChart = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <GlassCard className="lg:col-span-2">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <i className="ri-line-chart-line text-theme-10"></i> Fluxo de Caixa Mensal
      </h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            {/* Usando constantes THEME para sincronia */}
            <CartesianGrid strokeDasharray="3 3" stroke={THEME.grid} opacity={0.5} vertical={false} />
            <XAxis dataKey="name" stroke={THEME.text} axisLine={false} tickLine={false} dy={10} />
            <YAxis stroke={THEME.text} axisLine={false} tickLine={false} dx={-10} />
            <Tooltip 
              contentStyle={{ backgroundColor: THEME.tooltipBg, borderColor: THEME.grid, color: '#fff' }} 
              itemStyle={{ color: '#fff' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
            <Line type="monotone" dataKey="Receitas" stroke={THEME.primary} strokeWidth={3} dot={{ r: 4, fill: THEME.primary }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="Despesas" stroke={THEME.danger} strokeWidth={3} dot={{ r: 4, fill: THEME.danger }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>

    <GlassCard>
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <i className="ri-information-line text-theme-10"></i> Resumo Financeiro
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-theme-30/50 rounded-xl border border-theme-30-border">
          <span className="text-text-muted">Taxa de Economia</span>
          <span className="text-xl font-bold text-theme-10">90.3%</span>
        </div>
        <div className="flex justify-between items-center p-4 bg-theme-30/50 rounded-xl border border-theme-30-border">
          <span className="text-text-muted">Média Diária</span>
          <span className="text-xl font-bold text-white">R$ 24,92</span>
        </div>
        <div className="flex justify-between items-center p-4 bg-theme-30/50 rounded-xl border border-theme-30-border">
          <span className="text-text-muted">Fixas</span>
          <span className="text-xl font-bold text-warning">8</span>
        </div>
      </div>
    </GlassCard>
  </div>
);

const CreditCardGrid = () => (
  <div>
    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
      <i className="ri-bank-card-line text-theme-10"></i> Gerenciamento de Cartões
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cardsData.map((card) => (
        <div 
          key={card.id} 
          className="rounded-2xl p-6 relative overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer shadow-lg"
          style={{ background: `linear-gradient(135deg, ${card.colorFrom}, ${card.colorTo})` }}
        >
          <div className="relative z-10 text-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">{card.name}</h3>
              <i className="ri-bank-card-2-fill text-2xl opacity-50"></i>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-white/70 text-xs uppercase tracking-wider mb-1">Limite Total</p>
                <p className="text-2xl font-bold">R$ {card.limit.toLocaleString('pt-BR')}</p>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-white/80">Disponível: R$ {card.available.toLocaleString('pt-BR')}</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-2">
                  <div 
                    className="bg-white h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${card.percent}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between pt-2 border-t border-white/20 text-xs">
                  <div><span className="opacity-70">Fecha:</span> <strong>Dia {card.closing}</strong></div>
                  <div><span className="opacity-70">Vence:</span> <strong>Dia {card.due}</strong></div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        </div>
      ))}
    </div>
  </div>
);

const ProjectionTable = () => (
  <GlassCard className="xl:col-span-1 h-fit">
    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
      <i className="ri-calendar-line text-theme-10"></i> Projeção (Nubank)
    </h3>
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-text-muted uppercase bg-theme-30/50">
          <tr>
            <th className="px-3 py-3 rounded-l-lg">Mês</th>
            <th className="px-3 py-3 text-right">Valor</th>
            <th className="px-3 py-3 text-right rounded-r-lg">%</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-theme-30-border">
          {projectionData.map((row, idx) => (
            <tr key={idx} className="hover:bg-theme-30-border/30 transition-colors">
              <td className="px-3 py-3 font-medium text-white capitalize">{row.month}</td>
              <td className="px-3 py-3 text-right text-danger">R$ {row.value},00</td>
              <td className="px-3 py-3 text-right">
                <span className="bg-theme-10/10 text-theme-10 px-2 py-0.5 rounded text-xs font-bold">
                  {row.percent}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </GlassCard>
);

const TransactionList = () => (
  <div className="xl:col-span-2 space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <i className="ri-list-check text-theme-10"></i> Lista de Despesas
      </h2>
      <div className="flex gap-2">
          <select className="bg-theme-30 border border-theme-30-border text-text-muted text-sm rounded-lg focus:ring-theme-10 focus:border-theme-10 block p-2.5">
            <option>Todas Categorias</option>
            <option>Tecnologia</option>
            <option>Lazer</option>
          </select>
          <select className="bg-theme-30 border border-theme-30-border text-text-muted text-sm rounded-lg focus:ring-theme-10 focus:border-theme-10 block p-2.5">
            <option>Status: Todos</option>
            <option>Pago</option>
          </select>
      </div>
    </div>

    <GlassCard className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-text-muted">
          <thead className="text-xs uppercase bg-theme-30/80 text-text-muted">
            <tr>
              <th className="px-6 py-4">Descrição</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Cartão</th>
              <th className="px-6 py-4 text-center">Parc.</th>
              <th className="px-6 py-4 text-right">Valor</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme-30-border">
            {transactionsData.map((t) => (
              <tr key={t.id} className="hover:bg-theme-30-border/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${t.color}-500/10`}>
                      <i className={`${t.icon} text-lg text-${t.color}-500`}></i>
                    </div>
                    <div>
                      <div className="text-white font-medium">{t.desc}</div>
                      {t.total && <div className="text-xs">Total: R$ {t.total}</div>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge color={t.color}>{t.category}</Badge>
                </td>
                <td className="px-6 py-4">{t.card}</td>
                <td className="px-6 py-4 text-center font-medium text-white">{t.parcels}</td>
                <td className="px-6 py-4 text-right">
                    <div className="font-bold text-white">R$ {t.value.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-theme-10/10 text-theme-10 px-2 py-1 rounded-full text-xs font-bold uppercase">
                    {t.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                      <button className="p-2 hover:bg-theme-30-border rounded-lg transition-colors text-text-muted hover:text-white"><i className="ri-pencil-line"></i></button>
                      <button className="p-2 hover:bg-danger/20 rounded-lg transition-colors text-text-muted hover:text-danger"><i className="ri-delete-bin-line"></i></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  </div>
);

// ==========================================
// 4. APP PRINCIPAL
// ==========================================

export default function App() {
  return (
    // bg-theme-60 (Fundo padrão 60%)
    <div className="min-h-screen bg-theme-60 text-text-main font-sans selection:bg-theme-10 selection:text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <KPIGrid />
        <FinancialChart />
        <CreditCardGrid />
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <ProjectionTable />
          <TransactionList />
        </div>
      </main>
    </div>
  );
}