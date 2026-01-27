import React, { useState } from 'react';

import { useFinancialSummary } from '../hooks/useFinancialSummary';

import { FinancialOverview } from '../components/organisms/FinancialOverview';
import { DetailedExpensesModal } from '../components/organisms/DetailedExpensesModal';
import { ResumoCards } from '../components/organisms/ResumoCards';
import { PageHeader } from '../components/molecules/PageHeader';

export default function OverviewPage() {
    const { totalGastos, totalCartoes, totalLimite, totalDisponivel } = useFinancialSummary();

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);



    return (
        <div className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
            <PageHeader
                title="Visão Geral"
                description="Consolidação de cartões e gastos recorrentes de todos os usuários."
            />

            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
                <FinancialOverview
                    onUserClick={(userId) => {
                        setSelectedUserId(userId);
                        setIsModalOpen(true);
                    }}
                />

                <ResumoCards
                    totalGastos={totalGastos}
                    totalCartoes={totalCartoes}
                    totalLimite={totalLimite}
                    totalDisponivel={totalDisponivel}
                />

                <DetailedExpensesModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    initialUserId={selectedUserId}
                />
            </div>
        </div>
    );
}
