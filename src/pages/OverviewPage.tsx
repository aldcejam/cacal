import React, { useMemo, useState } from 'react';
// @ts-ignore
import { creditCards } from '../mocks/cartao';
// @ts-ignore
import { gastosRecorrentesData } from '../mocks/gastoRecorrente';
// @ts-ignore
import { usuarios, getUsuarioAtual } from '../mocks/usuario';
// @ts-ignore
// @ts-ignore
import { transactionsData } from '../mocks/transacao';

import { Carousel } from '../components/molecules/Carousel';
import { UserBlock } from '../components/organisms/UserBlock';
import { MetricCard } from '../components/molecules/MetricCard';
import { FinancialOverview } from '../components/organisms/FinancialOverview';
import { DetailedExpensesModal } from '../components/organisms/DetailedExpensesModal';
import { ResumoCards } from '../components/organisms/ResumoCards';

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
            <MetricCard
                title="Gastos Recorrentes"
                value={`R$ ${totalGastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                subtitle="Total mensal"
                icon={<i className="ri-calendar-check-line"></i>}
            />
            <MetricCard
                title="Cartões"
                value={totalCartoes}
                subtitle="Total de cartões"
                icon={<i className="ri-bank-card-line"></i>}
            />
            <MetricCard
                title="Limite Total"
                value={`R$ ${totalLimite.toLocaleString('pt-BR')}`}
                subtitle="Soma de todos os limites"
                icon={<i className="ri-dashboard-3-line"></i>}
            />
            <MetricCard
                title="Disponível"
                value={`R$ ${totalDisponivel.toLocaleString('pt-BR')}`}
                subtitle="Crédito disponível"
                icon={<i className="ri-wallet-3-line"></i>}
                variant="default"
            />
        </div>
    );
};

export default function OverviewPage() {
    const currentUser = getUsuarioAtual();
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    // Unified filtered transactions
    const filteredTransactions = useMemo(() => {
        if (selectedCardIds.length === 0) return [];

        const combinedTransactions: any[] = [];

        // 1. Credit Card Transactions
        // Filter transactions where cardId is in selectedIds
        const cardTransactions = transactionsData.filter(t => selectedCardIds.includes(t.cardId));
        combinedTransactions.push(...cardTransactions);

        // 2. Recurring Expenses
        // Identify selected recurring "cards" (ids starting with 'recurring-')
        const recurringIds = selectedCardIds.filter(id => id.startsWith('recurring-'));

        if (recurringIds.length > 0) {
            const userIds = recurringIds.map(id => id.replace('recurring-', ''));
            const recurringExpenses = gastosRecorrentesData.filter(g => userIds.includes(g.userId));

            // Map recurring expenses to Transaction interface
            const recurringAsTransactions = recurringExpenses.map(g => ({
                id: `rec-${g.id}`,
                cardId: `recurring-${g.userId}`, // Use the selection ID as cardId to match logic if needed, or specific mock ID
                description: g.descricao,
                category: g.categoria,
                value: g.valor,
                parcels: 'Recorrente', // Display 'Recorrente' in parcels column
                total: g.valor, // Total is same as monthly value
                status: 'approved',
                isRecurring: true, // Flag for potential UI differentiation
                paymentMethod: g.pagamento
            }));

            combinedTransactions.push(...recurringAsTransactions);
        }

        // Optional: Sort by value or date if available (recurring doesn't have date usually, maybe use creation date?)
        // For now, just render them.
        return combinedTransactions;
    }, [selectedCardIds]);

    return (
        <div className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
            <Header />

            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
                <FinancialOverview />

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
                {/* Floating Action Button for Details */}
                <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ${selectedCardIds.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
                    <Button
                        variant="primary"
                        className="shadow-xl px-8 py-6 rounded-full text-base"
                        onClick={() => setIsDetailsModalOpen(true)}
                    >
                        <div className="flex items-center gap-2">
                            <span>Ver Detalhes ({selectedCardIds.length})</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path d="M12 4c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8Z" /></svg>
                        </div>
                    </Button>
                </div>

                {/* Details Modal */}
                <Modal
                    isOpen={isDetailsModalOpen}
                    onClose={() => setIsDetailsModalOpen(false)}
                    title="Detalhamento de Gastos"
                >
                    <TransactionTable
                        transactions={filteredTransactions}
                        cards={creditCards}
                        selectedIds={selectedCardIds}
                        title="Transações Selecionadas"
                        emptyMessage="Nenhuma transação encontrada para a seleção."
                    />
                </Modal>
            </div>
        </div>
    );
}
