import React, { useState, useMemo } from 'react';
// @ts-ignore
import { transactionsData } from '../mocks/transacao';
// @ts-ignore
import { creditCards, type Card } from '../mocks/cartao';
// @ts-ignore
import { getUsuarioAtual } from '../mocks/usuario';

import { UserSelector } from '../components/organisms/UserSelector';
import { CreditCardList } from '../components/organisms/CreditCardList';
import { TransactionTable } from '../components/organisms/TransactionTable';

interface SortConfig {
    key: any;
    direction: 'asc' | 'desc';
}

export default function CardsPage() {
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

    return (
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

                <TransactionTable
                    transactions={filteredTransactions}
                    cards={availableCards}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    title={selectedCardIds.length > 0 ? `Despesas: ${getSelectedCardNames()}` : 'Despesas'}
                    emptyMessage="Nenhuma despesa encontrada para os cartões selecionados."
                />
            </div>
        </div>
    );
}
