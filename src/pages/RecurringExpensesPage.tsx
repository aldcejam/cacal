import React, { useState, useMemo } from 'react';
// @ts-ignore
import { gastosRecorrentesData, type GastoRecorrente } from '../mocks/gastoRecorrente';
// @ts-ignore
import { getUsuarioAtual, type Usuario, usuarios } from '../mocks/usuario';

import { UserSelector } from '../components/organisms/UserSelector';
import { Button } from '../components/atoms/Button';
import { Badge } from '../components/atoms/Badge';

// Helper for category style reused locally or imported if centralized
const getCategoryColor = (cat: string) => {
    switch (cat) {
        case 'Streaming': return 'violet';
        case 'Alimentação': return 'default';
        case 'Eletrônicos': return 'blue';
        case 'Transporte': return 'emerald';
        case 'Saúde': return 'red';
        case 'Telecomunicações': return 'cyan';
        case 'Educação': return 'blue';
        default: return 'default';
    }
};

const getPaymentStyle = (pagamento: string) => {
    switch (pagamento) {
        case 'Cartão de Crédito': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
        case 'Débito Automático': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
        case 'PIX': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
        case 'Boleto': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
        default: return 'bg-secondary text-secondary-foreground border-border';
    }
};

const Header = () => (
    <header className="flex items-center justify-between mb-8 pt-2 md:pt-0 pl-12 md:pl-0">
        <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Gastos Recorrentes</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">Gerencie seus gastos que se repetem mensalmente.</p>
        </div>

        <Button variant="primary">
            <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                <span className="hidden sm:inline">Novo Gasto Recorrente</span>
            </div>
        </Button>
    </header>
);

const GastosRecorrentesTable = ({
    gastos,
    onSort,
    sortConfig,
    showUserColumn
}: {
    gastos: GastoRecorrente[],
    onSort: (key: any) => void,
    sortConfig: any,
    showUserColumn: boolean
}) => {
    const totalValue = gastos.reduce((acc, g) => acc + g.valor, 0);

    return (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    Gastos Recorrentes
                </h2>
            </div>

            {gastos.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-card/50 border border-dashed border-border rounded-xl text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-muted-foreground opacity-50">
                            <path d="M5 12h14"></path>
                            <path d="M12 5v14"></path>
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-muted-foreground">Nenhum gasto recorrente cadastrado</h3>
                </div>
            ) : (
                <div className="bg-card rounded-xl border border-border/50 overflow-hidden shadow-sm">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b border-border/50 transition-colors hover:bg-transparent bg-secondary/20">
                                    {showUserColumn && (
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Usuário</th>
                                    )}
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer" onClick={() => onSort('descricao')}>Descrição</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Pagamento</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer" onClick={() => onSort('categoria')}>Categoria</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right cursor-pointer" onClick={() => onSort('valor')}>Valor</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {gastos.map((gasto) => {
                                    const user = usuarios.find(u => u.id === gasto.userId);
                                    return (
                                        <tr key={gasto.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                                            {showUserColumn && user && (
                                                <td className="p-4 align-middle">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: user.color }}>
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-foreground font-medium text-sm">{user.name}</span>
                                                    </div>
                                                </td>
                                            )}
                                            <td className="p-4 align-middle text-foreground font-medium">{gasto.descricao}</td>
                                            <td className="p-4 align-middle">
                                                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${getPaymentStyle(gasto.pagamento)}`}>
                                                    {gasto.pagamento}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                {/* @ts-ignore */}
                                                <Badge variant={getCategoryColor(gasto.categoria)}>{gasto.categoria}</Badge>
                                            </td>
                                            <td className="p-4 align-middle text-right text-foreground font-medium">
                                                R$ {gasto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-4 align-middle text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot className="font-medium bg-secondary/20 border-t border-border/50">
                                <tr>
                                    <td className="p-4 align-middle font-semibold text-foreground" colSpan={showUserColumn ? 4 : 3}>Total Mensal</td>
                                    <td className="p-4 align-middle text-right font-bold text-primary">
                                        R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="p-4 align-middle"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}
        </section>
    );
};

export default function RecurringExpensesPage() {
    const currentUser = getUsuarioAtual();
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>(
        currentUser.isPrincipal ? [currentUser.id] : [currentUser.id]
    );
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

    const handleSort = (key: any) => {
        if (!key) return;
        setSortConfig((current: any) => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    // --- Derived State ---

    const filteredGastos = useMemo(() => {
        return gastosRecorrentesData.filter(g => selectedUserIds.includes(g.userId));
    }, [selectedUserIds]);

    const sortedGastos = useMemo(() => {
        let data = [...filteredGastos];

        if (sortConfig.key) {
            data = data.sort((a, b) => {
                let valA: string | number, valB: string | number;

                if (sortConfig.key === 'valor') {
                    valA = a.valor;
                    valB = b.valor;
                } else if (sortConfig.key === 'descricao') {
                    valA = a.descricao.toLowerCase();
                    valB = b.descricao.toLowerCase();
                } else if (sortConfig.key === 'categoria') {
                    valA = a.categoria.toLowerCase();
                    valB = b.categoria.toLowerCase();
                } else {
                    return 0;
                }

                if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return data;
    }, [sortConfig, filteredGastos]);

    return (
        <div className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
            <Header />

            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
                <UserSelector
                    selectedUserIds={selectedUserIds}
                    onToggleUser={handleToggleUser}
                    currentUser={currentUser}
                />

                <GastosRecorrentesTable
                    gastos={sortedGastos}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    showUserColumn={currentUser.isPrincipal && selectedUserIds.length > 1}
                />
            </div>
        </div>
    );
}
