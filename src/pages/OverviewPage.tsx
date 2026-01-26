import React, { useMemo, useState } from 'react';
// @ts-ignore
import { creditCards } from '../mocks/cartao';
// @ts-ignore
import { gastosRecorrentesData } from '../mocks/gastoRecorrente';
// @ts-ignore
import { usuarios, getUsuarioAtual } from '../mocks/usuario';
// @ts-ignore
import { transactionsData } from '../mocks/transacao';

import { Carousel } from '../components/molecules/Carousel';
import { UserBlock } from '../components/organisms/UserBlock';
import { TransactionTable } from '../components/organisms/TransactionTable';
import { MetricCard } from '../components/molecules/MetricCard';

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
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
            />
            <MetricCard
                title="Cartões"
                value={totalCartoes}
                subtitle="Total de cartões"
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>}
            />
            <MetricCard
                title="Limite Total"
                value={`R$ ${totalLimite.toLocaleString('pt-BR')}`}
                subtitle="Soma de todos os limites"
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
            />
            <MetricCard
                title="Disponível"
                value={`R$ ${totalDisponivel.toLocaleString('pt-BR')}`}
                subtitle="Crédito disponível"
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
                variant="default" // Could be tailored if needed
            />
        </div>
    );
};

export default function OverviewPage() {
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

    // Filtrar transações para a tabela
    const filteredTransactions = useMemo(() => {
        if (selectedCardIds.length === 0) return [];
        return transactionsData.filter(t => selectedCardIds.includes(t.cardId));
    }, [selectedCardIds]);

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
                <TransactionTable
                    transactions={filteredTransactions}
                    cards={creditCards}
                    selectedIds={selectedCardIds}
                    title="Gastos dos Cartões Selecionados"
                    emptyMessage="Selecione cartões nos blocos acima para visualizar os gastos."
                />
            </div>
        </div>
    );
}
