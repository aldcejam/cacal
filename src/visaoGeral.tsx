import React, { useMemo, useState } from 'react';
// @ts-ignore
import { creditCards, type Card } from './mocks/cartao';
// @ts-ignore
import { gastosRecorrentesData } from './mocks/gastoRecorrente';
// @ts-ignore
import { usuarios, getUsuarioAtual } from './mocks/usuario';
// @ts-ignore
import { transactionsData } from './mocks/transacao';
// @ts-ignore
import { Carousel } from './components/Carousel';
// @ts-ignore
import { UserBlock } from './components/UserBlock';

// ==========================================
// 1. HELPERS
// ==========================================

const getCategoryStyle = (category: string) => {
  switch (category) {
    case 'Streaming': return 'bg-violet-500/20 text-violet-300 border-violet-500/30';
    case 'Alimentação': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    case 'Eletrônicos': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case 'Transporte': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    case 'Saúde': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    case 'Telecomunicações': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
    case 'Educação': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
    default: return 'bg-secondary text-secondary-foreground border-border';
  }
};

// ==========================================
// 2. COMPONENTES
// ==========================================

const Header = () => (
  <header className="flex items-center justify-between mb-8 pt-2 md:pt-0 pl-12 md:pl-0">
    <div>
      <h1 className="text-2xl font-bold text-foreground tracking-tight">Visão Geral</h1>
      <p className="text-sm text-muted-foreground hidden sm:block">Consolidação de cartões e gastos recorrentes de todos os usuários.</p>
    </div>
  </header>
);

const ResumoCards = ({ totalGastos, totalCartoes, totalLimite, totalDisponivel }: {
  totalGastos: number;
  totalCartoes: number;
  totalLimite: number;
  totalDisponivel: number;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Gastos Recorrentes</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <p className="text-2xl font-bold text-foreground">R$ {totalGastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        <p className="text-xs text-muted-foreground mt-1">Total mensal</p>
      </div>

      <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Cartões</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
          </svg>
        </div>
        <p className="text-2xl font-bold text-foreground">{totalCartoes}</p>
        <p className="text-xs text-muted-foreground mt-1">Total de cartões</p>
      </div>

      <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Limite Total</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <p className="text-2xl font-bold text-foreground">R$ {totalLimite.toLocaleString('pt-BR')}</p>
        <p className="text-xs text-muted-foreground mt-1">Soma de todos os limites</p>
      </div>

      <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Disponível</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <p className="text-2xl font-bold text-emerald-500">R$ {totalDisponivel.toLocaleString('pt-BR')}</p>
        <p className="text-xs text-muted-foreground mt-1">Crédito disponível</p>
      </div>
    </div>
  );
};

const TabelaGastos = ({ selectedCardIds }: { selectedCardIds: string[] }) => {
  // Filtrar transações pelos cartões selecionados
  const filteredTransactions = useMemo(() => {
    if (selectedCardIds.length === 0) return [];
    return transactionsData.filter(t => selectedCardIds.includes(t.cardId));
  }, [selectedCardIds]);

  const totalValue = filteredTransactions.reduce((acc, t) => acc + t.value, 0);
  const totalFull = filteredTransactions.reduce((acc, t) => acc + t.total, 0);

  if (selectedCardIds.length === 0) {
    return (
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h2 className="text-lg font-semibold text-foreground">Gastos dos Cartões Selecionados</h2>
        </div>
        <div className="flex flex-col items-center justify-center p-12 bg-card/50 border border-dashed border-border rounded-xl text-center">
          <p className="text-muted-foreground">Selecione cartões nos blocos acima para visualizar os gastos.</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h2 className="text-lg font-semibold text-foreground">Gastos dos Cartões Selecionados</h2>
        <span className="text-sm text-muted-foreground">({selectedCardIds.length} cartão{selectedCardIds.length > 1 ? 'ões' : ''} selecionado{selectedCardIds.length > 1 ? 's' : ''})</span>
      </div>

      <div className="bg-card rounded-xl border border-border/50 overflow-hidden shadow-sm">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b border-border/50 transition-colors hover:bg-transparent bg-secondary/20">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Cartão</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Descrição</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Categoria</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Valor</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-center">Parcelas</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Total</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => {
                  const card = creditCards.find(c => c.id === t.cardId);
                  const user = usuarios.find(u => u.id === card?.user.id);
                  return (
                    <tr key={t.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="p-4 align-middle font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          {user && (
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: user.color }}
                            ></div>
                          )}
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: card?.bank.color }}></span>
                          {card?.bank.name} • {card?.lastDigits}
                        </div>
                      </td>
                      <td className="p-4 align-middle text-foreground font-medium">{t.description}</td>
                      <td className="p-4 align-middle">
                        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${getCategoryStyle(t.category)}`}>
                          {t.category}
                        </div>
                      </td>
                      <td className="p-4 align-middle text-right text-foreground font-medium">
                        R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 align-middle text-center text-muted-foreground tabular-nums">
                        {t.parcels}
                      </td>
                      <td className="p-4 align-middle text-right text-foreground font-semibold">
                        R$ {t.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Nenhuma transação encontrada para os cartões selecionados.
                  </td>
                </tr>
              )}
            </tbody>
            {filteredTransactions.length > 0 && (
              <tfoot className="font-medium bg-secondary/20 border-t border-border/50">
                <tr>
                  <td className="p-4 align-middle font-semibold text-foreground" colSpan={3}>Total</td>
                  <td className="p-4 align-middle text-right font-bold text-primary">
                    R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 align-middle"></td>
                  <td className="p-4 align-middle text-right font-bold text-primary">
                    R$ {totalFull.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 3. COMPONENTE PRINCIPAL
// ==========================================

export default function VisaoGeral() {
  const currentUser = getUsuarioAtual();
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);

  // Se não for usuário principal, não mostra nada
  if (!currentUser.isPrincipal) {
    return (
      <div className="flex-1 p-6 md:p-8 overflow-y-auto w-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Acesso Restrito</h1>
          <p className="text-muted-foreground">Apenas o usuário principal pode acessar esta página.</p>
        </div>
      </div>
    );
  }

  // Agrupar dados por usuário
  const usersData = useMemo(() => {
    return usuarios
      .filter(u => !u.isPrincipal) // Excluir o usuário principal dos blocos
      .map(user => {
        const userCards = creditCards.filter(c => c.user.id === user.id);
        const userGastos = gastosRecorrentesData.filter(g => g.userId === user.id);
        return { user, cards: userCards, gastos: userGastos };
      });
  }, []);

  // Calcular totais
  const totalGastos = useMemo(() => {
    return gastosRecorrentesData.reduce((acc, g) => acc + g.valor, 0);
  }, []);

  const totalCartoes = creditCards.length;
  const totalLimite = creditCards.reduce((acc, c) => acc + c.limit, 0);
  const totalDisponivel = creditCards.reduce((acc, c) => acc + c.available, 0);

  const handleToggleCard = (cardId: string) => {
    setSelectedCardIds(prev => {
      if (prev.includes(cardId)) {
        return prev.filter(id => id !== cardId);
      }
      return [...prev, cardId];
    });
  };

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
      <Header />
      
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        <ResumoCards
          totalGastos={totalGastos}
          totalCartoes={totalCartoes}
          totalLimite={totalLimite}
          totalDisponivel={totalDisponivel}
        />

        {/* Carrossel de Blocos de Usuários */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <h2 className="text-lg font-semibold text-foreground">Usuários</h2>
          </div>

          <Carousel>
            {usersData.map(({ user, cards, gastos }) => (
              <UserBlock
                key={user.id}
                user={user}
                cards={cards}
                gastosRecorrentes={gastos}
                selectedCardIds={selectedCardIds}
                onToggleCard={handleToggleCard}
              />
            ))}
          </Carousel>
        </section>

        {/* Tabela de Gastos (reage à seleção de cartões) */}
        <TabelaGastos selectedCardIds={selectedCardIds} />
      </div>
    </div>
  );
}
