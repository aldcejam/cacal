import React, { useState, useMemo, useEffect } from 'react';
import { Modal } from '../molecules/Modal';
import { Carousel } from '../molecules/Carousel';
import { CreditCard } from '../molecules/CreditCard';
import { RecurringExpensesCard } from '../molecules/RecurringExpensesCard';
import { TransactionTable } from './TransactionTable';
import { Button } from '../atoms/Button';
import { Typography } from '../atoms/Typography';

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
            // Default to all users if none selected? Or none? 
            // Let's default to the current user (mocked as first one) if nothing passed
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
    // "Default: all cards visible are selected"
    const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);

    useEffect(() => {
        // When filtered cards change (due to user selection), update selected cards
        // to include ALL filtered cards + ALL recurring expenses
        const cardIds = filteredCreditCards.map((c: any) => c.id);
        const recurringIds = filteredRecurringExpenses.map((g: any) => `recurring-${g.id}`); // Using mock ID logic
        // Actually, recurring logic in OverviewPage used `recurring-${userId}`. 
        // Let's align with that or improve it. 
        // The recurring expense table logic aggregates by USER usually, or lists individual expenses?
        // Let's use individual recurring expense IDs for selection to be precise combined with the table.
        // Wait, TransactionTable usually expects 'cardId'. 
        // In the previous step, we mapped recurring expenses to transactions.
        // Let's maintain a derived list of transactions based on VISIBLE cards/recurring.

        // For simplicity in this "Modal First" view:
        // We auto-select EVERYTHING that is visible.
        // So we don't strictly need `selectedCardIds` state if we just always show everything visible.
        // BUT the user might want to toggle specific cards inside the carousel.
        // So let's initialize with all visible.

        const allRecurringIds = filteredRecurringExpenses.map((g: any) => `rec-${g.id}`);
        // NOTE: Unique IDs for recurring selection might need to match what TransactionTable expects.

        setSelectedCardIds([...cardIds, ...allRecurringIds]);

    }, [filteredCreditCards, filteredRecurringExpenses]);


    const handleToggleCard = (id: string) => {
        setSelectedCardIds(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
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
        // Identify which recurring expenses are "selected"
        // In the carousel they will be individual items.
        // We map them to transaction format.
        const activeRecurring = filteredRecurringExpenses.filter((g: any) => selectedCardIds.includes(`rec-${g.id}`));

        const recurringAsTransactions = activeRecurring.map((g: any) => ({
            id: `rec-${g.id}`,
            cardId: `rec_origin_${g.userId}`, // Dummy ID for "card" column if needed
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

                    {/* Recurring Expenses */}
                    {filteredRecurringExpenses.length > 0 && (
                        <div>
                            <Typography variant="body-sm" className="mb-3 text-muted-foreground uppercase tracking-wider font-semibold px-1">
                                Custos Recorrentes ({filteredRecurringExpenses.length})
                            </Typography>
                            <Carousel>
                                {filteredRecurringExpenses.map((expense: any) => (
                                    <div key={expense.id} className="w-[280px] shrink-0 p-1">
                                        <RecurringExpensesCard
                                            totalValue={expense.valor}
                                            count={1} // Single item per card in this view? Or maybe just title/value
                                            // The existing RecurringExpensesCard was designed as a SUMMARY card.
                                            // We might need a slightly different look or reuse it delicately.
                                            // Let's reuse but render specific title.
                                            // Actually, RecurringExpensesCard expects "totalValue" and "count". 
                                            // It essentially looks like a Summary Card.
                                            // Ideally we would want a "RecurringExpenseItemCard" but for now let's use what we have
                                            // Or better, let's create a visual adaptation inline or modify the component later if needed.
                                            // The prompt said "cards de custos".
                                            // Let's pass the expense description as "count" prop text hack or similar?
                                            // No, let's just use it as is for now, maybe title mapping is needed.
                                            // Wait, the component is strict. 
                                            // Let's stick to the prompt: "a mesma coisa para os gastos recorrentes".
                                            // It implies a carousel of cards.
                                            isSelected={selectedCardIds.includes(`rec-${expense.id}`)}
                                            onClick={() => handleToggleCard(`rec-${expense.id}`)}
                                        />
                                        {/* Overlay to show specific expense name since component doesn't have it? 
                                            RecurringExpensesCard is generic. 
                                            We probably need a "RecurringExpenseItem" card similar to CreditCard. 
                                            For this iteration, I will wrap it and add a label below or overlay.
                                        */}
                                        <div className="mt-2 text-center">
                                            <p className="font-medium text-sm text-foreground truncate">{expense.descricao}</p>
                                            <p className="text-xs text-muted-foreground">{expense.categoria}</p>
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
