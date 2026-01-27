import React, { useState, useMemo, useEffect } from 'react';
import { Modal } from '../molecules/Modal';
import { Carousel } from '../molecules/Carousel';
import { CreditCard } from '../molecules/CreditCard';
import { RecurringExpensesCard } from '../molecules/RecurringExpensesCard';
import { TransactionTable } from './TransactionTable';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';

// @ts-ignore
import { usuarios } from '../../mocks/usuario';
// @ts-ignore
import { creditCards } from '../../mocks/cartao';
// @ts-ignore
import { gastosRecorrentesData } from '../../mocks/gastoRecorrente';
// @ts-ignore
import { transactionsData } from '../../mocks/transacao';

interface DetailedExpensesModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialUserId: string | null;
}

export const DetailedExpensesModal = ({ isOpen, onClose, initialUserId }: DetailedExpensesModalProps) => {
    // State for filtering users
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

    // Initialize selected users when modal opens or initialUserId changes
    useEffect(() => {
        if (isOpen && initialUserId) {
            setSelectedUserIds([initialUserId]);
        } else if (isOpen && !initialUserId && selectedUserIds.length === 0) {
            // Default to all users if none selected
            setSelectedUserIds([usuarios[0].id]);
        }
    }, [isOpen, initialUserId]);

    const handleToggleUser = (userId: string) => {
        setSelectedUserIds(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    // Filter Data based on selectedUserIds
    const filteredCreditCards = useMemo(() => {
        return creditCards.filter((c: any) => selectedUserIds.includes(c.user.id));
    }, [selectedUserIds]);

    const filteredRecurringExpenses = useMemo(() => {
        return gastosRecorrentesData.filter((g: any) => selectedUserIds.includes(g.userId));
    }, [selectedUserIds]);

    // Cards Selection Logic for Table
    const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);

    useEffect(() => {
        // Init with all visible credit cards
        const cardIds = filteredCreditCards.map((c: any) => c.id);

        // Init with all visible recurring GROUPS
        // We need to know which USERS have recurring expenses in the filtered list
        const usersWithRecurring = Array.from(new Set(filteredRecurringExpenses.map((g: any) => g.userId)));
        const recurringGroupIds = usersWithRecurring.map((userId: any) => `recurring-group-${userId}`);

        setSelectedCardIds([...cardIds, ...recurringGroupIds]);

    }, [filteredCreditCards, filteredRecurringExpenses]);


    const handleToggleCard = (id: string) => {
        setSelectedCardIds(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    // Derived Selection State (for buttons)
    const allCardIds = useMemo(() => filteredCreditCards.map((c: any) => c.id), [filteredCreditCards]);
    const allRecurringGroupIds = useMemo(() => {
        const usersWithRecurring = Array.from(new Set(filteredRecurringExpenses.map((g: any) => g.userId)));
        return usersWithRecurring.map((userId: any) => `recurring-group-${userId}`);
    }, [filteredRecurringExpenses]);

    const isAllCardsSelected = allCardIds.length > 0 && allCardIds.every(id => selectedCardIds.includes(id));
    const isAllRecurringSelected = allRecurringGroupIds.length > 0 && allRecurringGroupIds.every(id => selectedCardIds.includes(id));
    const isAllSelected = isAllCardsSelected && isAllRecurringSelected;

    const handleSelectAllCards = () => {
        if (isAllCardsSelected) {
            // Deselect all cards
            setSelectedCardIds(prev => prev.filter(id => !allCardIds.includes(id)));
        } else {
            // Select all cards
            setSelectedCardIds(prev => {
                const recurringIds = prev.filter(id => id.startsWith('recurring-group-'));
                return [...Array.from(new Set([...recurringIds, ...allCardIds]))];
            });
        }
    };

    const handleSelectAllRecurring = () => {
        if (isAllRecurringSelected) {
            // Deselect all recurring
            setSelectedCardIds(prev => prev.filter(id => !allRecurringGroupIds.includes(id)));
        } else {
            // Select all recurring
            setSelectedCardIds(prev => {
                const cardIds = prev.filter(id => !id.startsWith('recurring-group-'));
                return [...Array.from(new Set([...cardIds, ...allRecurringGroupIds]))];
            });
        }
    };

    const handleSelectAll = () => {
        if (isAllSelected) {
            // Deselect everything
            setSelectedCardIds([]);
        } else {
            // Select everything
            setSelectedCardIds([...allCardIds, ...allRecurringGroupIds]);
        }
    };

    // Prepare Unified Transactions
    const tableTransactions = useMemo(() => {
        let combined: any[] = [];

        // 1. Credit Card Transactions
        // Filter by actually selected card IDs
        const activeCardIds = filteredCreditCards.map((c: any) => c.id).filter((id: string) => selectedCardIds.includes(id));
        const relevantTransactions = transactionsData.filter((t: any) => activeCardIds.includes(t.cardId));
        combined.push(...relevantTransactions);

        // 2. Recurring Transactions
        // Identify which recurring groups are "selected"
        const activeRecurringGroupIds = selectedCardIds.filter(id => id.startsWith('recurring-group-'));
        const activeUserIds = activeRecurringGroupIds.map(id => id.replace('recurring-group-', ''));

        const activeRecurring = filteredRecurringExpenses.filter((g: any) => activeUserIds.includes(g.userId));

        const recurringAsTransactions = activeRecurring.map((g: any) => ({
            id: `rec-${g.id}`,
            cardId: `recurring-group-${g.userId}`, // Use the selection ID as cardId to match logic if needed
            description: g.descricao,
            category: g.categoria,
            value: g.valor,
            parcels: 'Recorrente',
            total: g.valor,
            status: 'approved',
            isRecurring: true,
            paymentMethod: g.pagamento // Passed to table
        }));

        combined.push(...recurringAsTransactions);

        return combined.sort((a, b) => b.value - a.value); // Sort by value desc
    }, [selectedCardIds, filteredCreditCards, filteredRecurringExpenses]);

    // Group Recurring Expenses by User
    const groupedRecurringExpenses = useMemo(() => {
        const groups: { [key: string]: { userId: string, total: number, count: number, user: any } } = {};

        filteredRecurringExpenses.forEach((g: any) => {
            if (!groups[g.userId]) {
                const user = usuarios.find((u: any) => u.id === g.userId);
                groups[g.userId] = { userId: g.userId, total: 0, count: 0, user };
            }
            groups[g.userId].total += g.valor;
            groups[g.userId].count += 1;
        });

        return Object.values(groups);
    }, [filteredRecurringExpenses]);


    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Detalhamento Financeiro"
        >
            <div className="space-y-8 min-h-[500px]">

                {/* 1. User Filter */}
                <div className="flex justify-center gap-4 py-2 overflow-x-auto">
                    {usuarios.map((user: any) => {
                        const isSelected = selectedUserIds.includes(user.id);
                        return (
                            <div
                                key={user.id}
                                onClick={() => handleToggleUser(user.id)}
                                className={`
                                    flex flex-col items-center gap-2 cursor-pointer transition-all duration-200
                                    ${isSelected ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-70 hover:scale-105'}
                                `}
                            >
                                <div
                                    className={`
                                        w-12 h-12 rounded-full flex items-center justify-center text-white font-bold
                                        shadow-lg ring-2 ring-offset-2 ring-offset-card
                                        ${isSelected ? 'ring-primary' : 'ring-transparent'}
                                    `}
                                    style={{ backgroundColor: user.color }}
                                >
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-xs font-medium text-foreground">{user.name.split(' ')[0]}</span>
                            </div>
                        )
                    })}
                </div>

                {/* Bulk Actions */}
                <div className="flex flex-wrap gap-2 justify-center border-b border-border/40 pb-4">
                    <Button
                        variant={isAllCardsSelected ? "primary" : "outline"}
                        size="sm"
                        onClick={handleSelectAllCards}
                        leftIcon={<i className="ri-bank-card-line"></i>}
                    >
                        Todos os Cartões
                    </Button>
                    <Button
                        variant={isAllRecurringSelected ? "primary" : "outline"}
                        size="sm"
                        onClick={handleSelectAllRecurring}
                        leftIcon={<i className="ri-calendar-check-line"></i>}
                    >
                        Todos Recorrentes
                    </Button>
                    <Button
                        variant={isAllSelected ? "primary" : "outline"}
                        size="sm"
                        onClick={handleSelectAll}
                        leftIcon={<i className="ri-checkbox-multiple-line"></i>}
                    >
                        Selecionar Tudo
                    </Button>
                </div>

                {/* 2. Carousels */}
                <div className="space-y-6">
                    {/* Credit Cards */}
                    {filteredCreditCards.length > 0 && (
                        <div>
                            <Typography variant="body-sm" className="mb-3 text-muted-foreground uppercase tracking-wider font-semibold px-1">
                                Cartões de Crédito ({filteredCreditCards.length})
                            </Typography>
                            <Carousel>
                                {filteredCreditCards.map((card: any) => (
                                    <div key={card.id} className="w-[300px] shrink-0 p-1">
                                        <CreditCard
                                            card={card}
                                            isSelected={selectedCardIds.includes(card.id)}
                                            onClick={() => handleToggleCard(card.id)}
                                            showProgressBar={true}
                                        />
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                    )}

                    {/* Recurring Expenses (Grouped by User) */}
                    {groupedRecurringExpenses.length > 0 && (
                        <div>
                            <Typography variant="body-sm" className="mb-3 text-muted-foreground uppercase tracking-wider font-semibold px-1">
                                Custos Recorrentes ({groupedRecurringExpenses.length} Usuários)
                            </Typography>
                            <Carousel>
                                {groupedRecurringExpenses.map((group: any) => (
                                    <div key={group.userId} className="w-[300px] shrink-0 p-1">
                                        <RecurringExpensesCard
                                            totalValue={group.total}
                                            count={group.count}
                                            isSelected={selectedCardIds.includes(`recurring-group-${group.userId}`)}
                                            onClick={() => handleToggleCard(`recurring-group-${group.userId}`)}
                                        />
                                        <div className="mt-2 text-center">
                                            <p className="font-medium text-sm text-foreground truncate">{group.user?.name}</p>
                                            <p className="text-xs text-muted-foreground">Total recorrente</p>
                                        </div>
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                    )}
                </div>

                {/* 3. Transaction Table */}
                <div className="pt-4 border-t border-border/50">
                    <TransactionTable
                        transactions={tableTransactions}
                        cards={creditCards}
                        title="Detalhamento das Seleções"
                        emptyMessage="Nenhum item selecionado."
                    />
                </div>

            </div>
        </Modal>
    );
};
