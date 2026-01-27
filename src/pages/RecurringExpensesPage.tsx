import { useState, useMemo } from 'react';
// @ts-ignore
import { gastosRecorrentesData, type GastoRecorrente } from '../mocks/gastoRecorrente';
// @ts-ignore
import { getUsuarioAtual } from '../mocks/usuario';

import { UserSelector } from '../components/organisms/UserSelector';
import { MetricCard } from '../components/molecules/MetricCard';
import { RecurringExpensesTable } from '../components/organisms/RecurringExpensesTable';



export default function RecurringExpensesPage() {
    const currentUser = getUsuarioAtual();
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([currentUser.id]);
    const [sortConfig, setSortConfig] = useState<any>({ key: null, direction: 'asc' });

    // --- Handlers ---
    const handleToggleUser = (userId: string) => {
        setSelectedUserIds(prev => {
            if (prev.includes(userId)) {
                return prev.filter(id => id !== userId);
            }
            return [...prev, userId];
        });
    };

    const handleSort = (key: keyof GastoRecorrente) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // --- Filtering & Sorting ---
    const filteredGastos = useMemo(() => {
        return gastosRecorrentesData.filter(g => selectedUserIds.includes(g.user.id));
    }, [selectedUserIds]);

    const sortedGastos = useMemo(() => {
        let sortableItems = [...filteredGastos];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                // @ts-ignore - simple sort
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                // @ts-ignore - simple sort
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredGastos, sortConfig]);

    const totalGastos = filteredGastos.reduce((acc, g) => acc + g.valor, 0);

    return (
        <div className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
            <header className="flex items-center justify-between mb-8 pl-12 md:pl-0">
                <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">Gastos Recorrentes</h1>
                    <p className="text-sm text-muted-foreground hidden sm:block">Gerencie assinaturas e pagamentos fixos mensais.</p>
                </div>
            </header>

            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
                <UserSelector
                    selectedUserIds={selectedUserIds}
                    onToggleUser={handleToggleUser}
                    currentUser={currentUser}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <MetricCard
                        title="Total Mensal"
                        value={`R$ ${totalGastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        subtitle="Soma das despesas listadas"
                        icon={<i className="ri-money-dollar-circle-line"></i>}
                        variant="default"
                    />
                </div>

                <RecurringExpensesTable
                    gastos={sortedGastos}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    showUserColumn={selectedUserIds.length > 1}
                />
            </div>
        </div>
    );
}
