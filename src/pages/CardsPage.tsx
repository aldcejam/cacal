import { useState, useMemo, useEffect } from 'react';
import { useTransacoes } from '../hooks/api/useTransacoes';
import { useCartoes } from '../hooks/api/useCartoes';
import { useUsuarios } from '../hooks/api/useUsuarios';

import { UserSelector } from '../components/organisms/UserSelector';
import { CreditCardList } from '../components/organisms/CreditCardList';
import { TransactionTable } from '../components/organisms/TransactionTable';

interface SortConfig {
    key: any;
    direction: 'asc' | 'desc';
}

export default function CardsPage() {
    const { data: transactions = [], isLoading: loadingTrans, error: errorTrans } = useTransacoes();
    const { data: creditCards = [], isLoading: loadingCards, error: errorCards } = useCartoes();
    const { data: usuarios = [], isLoading: loadingUsers, error: errorUsers } = useUsuarios();

    const loading = loadingTrans || loadingCards || loadingUsers;
    const error = errorTrans || errorCards || errorUsers ? "Failed to load cards data" : null;

    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

    // Fetch Data -- Removed manual fetch

    useEffect(() => {
        // Initialize selected user being the first one (simulating current user)
        if (usuarios.length > 0 && selectedUserIds.length === 0) {
            const firstId = usuarios[0].id;
            if (firstId) setSelectedUserIds([firstId]);
        }
    }, [usuarios]);

    const currentUser = usuarios.length > 0 ? usuarios[0] : null;

    // --- Handlers ---

    const handleToggleUser = (userId: string) => {
        setSelectedUserIds(prev => {
            if (prev.includes(userId)) {
                const newIds = prev.filter(id => id !== userId);
                // Se desmarcou usuário, remove seus cartões da seleção
                if (newIds.length > 0) {
                    const cardsToKeep = creditCards
                        .filter(c => c.user?.id && newIds.includes(c.user.id))
                        .map(c => c.id || '');
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

    const handleSort = (key: any) => {
        if (!key) return;
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    // --- Derived State ---

    // Filtrar cartões pelos usuários selecionados
    const availableCards = useMemo(() => {
        return creditCards.filter(card => card.user?.id && selectedUserIds.includes(card.user.id));
    }, [selectedUserIds, creditCards]);

    // Auto-selecionar primeiro cartão quando usuários mudam
    useMemo(() => {
        if (availableCards.length > 0 && selectedCardIds.length === 0) {
            const firstId = availableCards[0].id;
            if (firstId) setSelectedCardIds([firstId]);
        } else if (availableCards.length > 0) {
            // Manter apenas cartões dos usuários selecionados
            const validCardIds = availableCards.map(c => c.id || '').filter(id => id !== '');
            setSelectedCardIds(prev => prev.filter(id => validCardIds.includes(id)));
        } else {
            setSelectedCardIds([]);
        }
    }, [availableCards]); // Careful with dependency loop here, technically safe as selectedCardIds update won't trigger this again unless availableCards changes

    const filteredTransactions = useMemo(() => {
        let data = transactions;

        // Primeiro filtrar por cartões dos usuários selecionados
        const userCardIds = availableCards.map(c => c.id || '').filter(id => id !== '');
        data = data.filter(t => t.card?.id && userCardIds.includes(t.card.id));

        // Depois filtrar por cartões selecionados
        if (selectedCardIds.length > 0) {
            data = data.filter(t => t.card?.id && selectedCardIds.includes(t.card.id));
        } else {
            return [];
        }

        if (sortConfig.key) {
            data = [...data].sort((a, b) => {
                let valA: number, valB: number;

                if (sortConfig.key === 'value') {
                    valA = a.value || 0;
                    valB = b.value || 0;
                } else {
                    valA = parseInt((a.parcels || '').split('/')[0]) || 1;
                    valB = parseInt((b.parcels || '').split('/')[0]) || 1;
                }

                if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return data;
    }, [selectedCardIds, sortConfig, availableCards, transactions]);

    const getSelectedCardNames = () => {
        if (selectedCardIds.length === 0) return '';
        if (selectedCardIds.length === availableCards.length) return 'Todos os Cartões';

        const names = availableCards
            .filter(c => c.id && selectedCardIds.includes(c.id))
            .map(c => `${c.bank?.name || 'Banco'} ${c.lastDigits || ''}`);

        if (names.length <= 2) return names.join(' e ');
        return `${names[0]} e mais ${names.length - 1}`;
    };

    const Header = () => (
        <header className="flex items-center justify-between mb-8 pt-2 md:pt-0 pl-12 md:pl-0">
            <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">Gerenciamento de Cartões</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">Acompanhe seus limites e faturas em tempo real.</p>
            </div>

            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-md shadow-emerald-900/20 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                <span className="hidden sm:inline">Nova Despesa</span>
            </button>
        </header>
    );

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center h-full text-red-500">
                <p>Erro ao carregar dados: {error}</p>
            </div>
        );
    }

    return (
        <div className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
            <Header />

            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
                {currentUser && (
                    <UserSelector
                        selectedUserIds={selectedUserIds}
                        onToggleUser={handleToggleUser}
                        currentUser={currentUser}
                    />
                )}

                <CreditCardList
                    cards={availableCards}
                    selectedIds={selectedCardIds}
                    onToggleCard={handleToggleCard}
                />

                <TransactionTable
                    transactions={filteredTransactions}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    title={selectedCardIds.length > 0 ? `Despesas: ${getSelectedCardNames()}` : 'Despesas'}
                    emptyMessage="Nenhuma despesa encontrada para os cartões selecionados."
                />
            </div>
        </div>
    );
}
