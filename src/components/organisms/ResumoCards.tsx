import React from 'react';
import { MetricCard } from '../molecules/MetricCard';

interface ResumoCardsProps {
    totalGastos: number;
    totalCartoes: number;
    totalLimite: number;
    totalDisponivel: number;
}

export const ResumoCards = ({ totalGastos, totalCartoes, totalLimite, totalDisponivel }: ResumoCardsProps) => {
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
