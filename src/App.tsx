import React, { useState, useMemo } from 'react';
// @ts-ignore
import { transactionsData } from './mocks/transacao';
// @ts-ignore
import { creditCards, type Card } from './mocks/cartao';
// @ts-ignore
import { getUsuarioAtual, type Usuario } from './mocks/usuario';
// @ts-ignore
import { UserSelector } from './components/UserSelector';

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================
 
interface Transaction {
  id: string;
  cardId: string;
  description: string;
  category: string;
  value: number;
  parcels: string;
  total: number;
}

type SortKey = 'value' | 'parcels' | null;
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

// ==========================================
// 2. HELPERS
// ==========================================

const darkenColor = (hex: string, percent: number) => {
  let useHex = hex.replace(/^\s*#|\s*$/g, '');
  if (useHex.length === 3) useHex = useHex.replace(/(.)/g, '$1$1');

  const num = parseInt(useHex, 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = ((num >> 8) & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;

  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
};

const getCategoryStyle = (category: string) => {
  switch (category) {
    case 'Streaming': return 'bg-violet-500/20 text-violet-300 border-violet-500/30';
    case 'Alimentação': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    case 'Eletrônicos': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case 'Transporte': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    case 'Saúde': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    default: return 'bg-secondary text-secondary-foreground border-border';
  }
};

// ==========================================
// 3. COMPONENTES LOCAIS
// ==========================================

const Header = () => (
  <header className="flex items-center justify-between mb-8 pt-2 md:pt-0 pl-12 md:pl-0">
    {/* Padding e Margin ajustados para não colidir com o botão mobile flutuante */}
    <div>
      <h1 className="text-2xl font-bold text-foreground tracking-tight">Gerenciamento de Cartões</h1>
      <p className="text-sm text-muted-foreground hidden sm:block">Acompanhe seus limites e faturas em tempo real.</p>
    </div>
    
    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-md shadow-emerald-900/20 cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
      <span className="hidden sm:inline">Nova Despesa</span>
    </button>
  </header>
);

const CreditCardList = ({ 
  cards, 
  selectedIds, 
  onToggleCard 
}: { 
  cards: Card[], 
  selectedIds: string[], 
  onToggleCard: (id: string) => void 
}) => {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          <h2 className="text-lg font-semibold text-foreground">Meus Cartões</h2>
        </div>
        {selectedIds.length > 0 && (
           <span className="text-sm text-muted-foreground">{selectedIds.length} selecionado(s)</span>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map((card) => {
          const isSelected = selectedIds.includes(card.id);
          const primaryColor = card.bank.color; 
          const secondaryColor = darkenColor(primaryColor, 30);
          
          const gradientStyle = {
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
          };

          const opacityClass = isSelected 
            ? 'opacity-100 scale-[1.02] ring-2 ring-offset-2 ring-offset-background ring-primary' 
            : 'opacity-70 grayscale-[0.3] hover:grayscale-0 hover:opacity-100 hover:scale-[1.01]';
          
          return (
            <div 
              key={card.id}
              onClick={() => onToggleCard(card.id)}
              style={gradientStyle}
              className={`rounded-xl p-5 text-white shadow-lg transition-all duration-300 cursor-pointer select-none border border-white/10 ${opacityClass}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{card.bank.name} • {card.lastDigits}</h3>
                {isSelected && <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>}
              </div>
              <p className="text-xs uppercase tracking-wider opacity-70 mb-1 font-medium">Limite Total</p>
              <p className="text-2xl font-bold mb-3 tracking-tight">R$ {card.limit.toLocaleString('pt-BR')}</p>
              <div className="flex justify-between items-end">
                  <p className="text-sm opacity-80 font-medium">Disponível: R$ {card.available.toLocaleString('pt-BR')}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center p-12 bg-card/50 border border-dashed border-border rounded-xl text-center animate-in fade-in zoom-in duration-300">
    <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-muted-foreground opacity-50">
        <path d="M5 12h14"></path>
        <path d="M12 5v14"></path>
      </svg>
    </div>
    <h3 className="text-lg font-medium text-muted-foreground">Nenhum cartão selecionado</h3>
    <p className="text-sm text-muted-foreground/60 max-w-sm mt-2">
      Clique nos cartões acima para visualizar o detalhamento das despesas.
    </p>
  </div>
);

const TransactionsTable = ({
  transactions,
  cards,
  sortConfig,
  onSort,
  selectedIds,
  selectedNames
}: {
  transactions: Transaction[],
  cards: Card[],
  sortConfig: SortConfig,
  onSort: (key: SortKey) => void,
  selectedIds: string[],
  selectedNames: string
}) => {
  const totalValue = transactions.reduce((acc, t) => acc + t.value, 0);
  const totalFull = transactions.reduce((acc, t) => acc + t.total, 0);

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
            {selectedIds.length > 0 ? `Despesas: ${selectedNames}` : 'Despesas'}
        </h2>
      </div>

      {selectedIds.length === 0 ? <EmptyState /> : (
        <div className="bg-card rounded-xl border border-border/50 overflow-hidden shadow-sm">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b border-border/50 transition-colors hover:bg-transparent bg-secondary/20">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Cartão</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Descrição</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Categoria</th>
                  
                  {/* Sortable Headers */}
                  <th 
                    className="h-12 px-4 align-middle font-medium text-muted-foreground text-right cursor-pointer hover:text-foreground transition-colors group"
                    onClick={() => onSort('value')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Valor
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${sortConfig.key === 'value' && sortConfig.direction === 'desc' ? 'rotate-180' : ''} ${sortConfig.key === 'value' ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </div>
                  </th>
                  <th 
                    className="h-12 px-4 align-middle font-medium text-muted-foreground text-center cursor-pointer hover:text-foreground transition-colors group"
                    onClick={() => onSort('parcels')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Parcelas
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${sortConfig.key === 'parcels' && sortConfig.direction === 'desc' ? 'rotate-180' : ''} ${sortConfig.key === 'parcels' ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </div>
                  </th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Total</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {transactions.length > 0 ? (
                  transactions.map((t) => {
                    const card = cards.find(c => c.id === t.cardId);
                    return (
                      <tr key={t.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="p-4 align-middle font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: card?.bank.color }}></span>
                            {card?.bank.name}
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
                      Nenhuma despesa encontrada para os cartões selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
              {transactions.length > 0 && (
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
      )}
    </section>
  );
};

// ==========================================
// 4. COMPONENTE PRINCIPAL (APP)
// ==========================================

export default function App() {
  const currentUser = getUsuarioAtual();
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(
    currentUser.isPrincipal ? [currentUser.id] : [currentUser.id]
  );
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]); 
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

  // --- Handlers ---

  const handleToggleUser = (userId: string) => {
    setSelectedUserIds(prev => {
      if (prev.includes(userId)) {
        const newIds = prev.filter(id => id !== userId);
        // Se desmarcou usuário, remove seus cartões da seleção
        if (newIds.length > 0) {
          const cardsToKeep = creditCards
            .filter(c => newIds.includes(c.user.id))
            .map(c => c.id);
          setSelectedCardIds(prevCards => 
            prevCards.filter(cardId => cardsToKeep.includes(cardId))
          );
        } else {
          setSelectedCardIds([]);
        }
        return newIds;
      }
      return [...prev, userId];
    });
  };

  const handleToggleCard = (id: string) => {
    setSelectedCardIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(cardId => cardId !== id);
      }
      return [...prev, id];
    });
  };

  const handleSort = (key: SortKey) => {
    if (!key) return;
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // --- Derived State ---

  // Filtrar cartões pelos usuários selecionados
  const availableCards = useMemo(() => {
    return creditCards.filter(card => selectedUserIds.includes(card.user.id));
  }, [selectedUserIds]);

  // Auto-selecionar primeiro cartão quando usuários mudam
  useMemo(() => {
    if (availableCards.length > 0 && selectedCardIds.length === 0) {
      setSelectedCardIds([availableCards[0].id]);
    } else if (availableCards.length > 0) {
      // Manter apenas cartões dos usuários selecionados
      const validCardIds = availableCards.map(c => c.id);
      setSelectedCardIds(prev => prev.filter(id => validCardIds.includes(id)));
    } else {
      setSelectedCardIds([]);
    }
  }, [availableCards]);

  const filteredTransactions = useMemo(() => {
    let data = transactionsData;

    // Primeiro filtrar por cartões dos usuários selecionados
    const userCardIds = availableCards.map(c => c.id);
    data = data.filter(t => userCardIds.includes(t.cardId));

    // Depois filtrar por cartões selecionados
    if (selectedCardIds.length > 0) {
      data = data.filter(t => selectedCardIds.includes(t.cardId));
    } else {
      return []; 
    }

    if (sortConfig.key) {
      data = [...data].sort((a, b) => {
        let valA: number, valB: number;

        if (sortConfig.key === 'value') {
          valA = a.value;
          valB = b.value;
        } else {
          valA = parseInt(a.parcels.split('/')[0]) || 1;
          valB = parseInt(b.parcels.split('/')[0]) || 1;
        }

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [selectedCardIds, sortConfig, availableCards]);

  const getSelectedCardNames = () => {
    if (selectedCardIds.length === 0) return '';
    if (selectedCardIds.length === availableCards.length) return 'Todos os Cartões';
    
    const names = availableCards
      .filter(c => selectedCardIds.includes(c.id))
      .map(c => `${c.bank.name} ${c.lastDigits}`);
    
    if (names.length <= 2) return names.join(' e ');
    return `${names[0]} e mais ${names.length - 1}`;
  };

  return (
    // Container Principal da Página
    <div className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
      <Header />
      
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        <UserSelector
          selectedUserIds={selectedUserIds}
          onToggleUser={handleToggleUser}
          currentUser={currentUser}
        />

        <CreditCardList 
          cards={availableCards}
          selectedIds={selectedCardIds}
          onToggleCard={handleToggleCard}
        />

        <TransactionsTable 
          transactions={filteredTransactions}
          cards={availableCards}
          sortConfig={sortConfig}
          onSort={handleSort}
          selectedIds={selectedCardIds}
          selectedNames={getSelectedCardNames()}
        />
      </div>
    </div>
  );
}