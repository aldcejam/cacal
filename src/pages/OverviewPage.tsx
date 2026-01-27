import React, { useMemo, useState } from 'react';

import { creditCards } from '../mocks/cartao';

import { gastosRecorrentesData } from '../mocks/gastoRecorrente';

import { getUsuarioAtual } from '../mocks/usuario';

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

export default function OverviewPage() {
    const currentUser = getUsuarioAtual();
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Calcular totais para os cards de resumo
    const totalGastos = useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return gastosRecorrentesData.reduce((acc: number, g: any) => acc + g.valor, 0);
    }, []);

    const totalCartoes = creditCards.length;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalLimite = creditCards.reduce((acc: number, c: any) => acc + c.limit, 0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalDisponivel = creditCards.reduce((acc: number, c: any) => acc + c.available, 0);

    // Se não for usuário principal, não mostra nada (Basic auth check)
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

    return (
        <div className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
            <Header />

            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
                {/* 1. Financial Overview - Clickable Cards trigger Modal */}
                <FinancialOverview
                    onUserClick={(userId) => {
                        setSelectedUserId(userId);
                        setIsModalOpen(true);
                    }}
                />

                {/* 2. Summary Cards */}
                <ResumoCards
                    totalGastos={totalGastos}
                    totalCartoes={totalCartoes}
                    totalLimite={totalLimite}
                    totalDisponivel={totalDisponivel}
                />

                {/* 3. Detailed Modal */}
                <DetailedExpensesModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    initialUserId={selectedUserId}
                />
            </div>
        </div>
    );
}
