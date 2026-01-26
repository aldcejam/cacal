import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import 'remixicon/fonts/remixicon.css';

import { GlassCard } from '../components/atoms/GlassCard';
import { Badge } from '../components/atoms/Badge';
import { Button } from '../components/atoms/Button';
import { MetricCard } from '../components/molecules/MetricCard';
import { CreditCard } from '../components/molecules/CreditCard';

// Using mock data directly or we should extract if possible. 
// For now, hardcoding as in original home.tsx for fidelity.
const chartData = [
    { name: 'Ago', Receitas: 11000, Despesas: 8500 },
    { name: 'Set', Receitas: 12500, Despesas: 9000 },
    { name: 'Out', Receitas: 11800, Despesas: 9800 },
    { name: 'Nov', Receitas: 12900, Despesas: 9500 },
    { name: 'Dez', Receitas: 13500, Despesas: 11500 },
    { name: 'Jan', Receitas: 7700, Despesas: 747 },
];

const cardsData = [
    {
        id: "1",
        bank: { name: 'Nubank Roxinho', color: '#8b5cf6' },
        limit: 5000,
        available: 2660,
        closing: 15,
        due: 22,
        percent: 53.2,
        lastDigits: '***' // Mock
    },
    {
        id: "2",
        bank: { name: 'Inter Gold', color: '#f59e0b' },
        limit: 8000,
        available: 3440,
        closing: 10,
        due: 17,
        percent: 43,
        lastDigits: '***'
    },
    {
        id: "3",
        bank: { name: 'C6 Bank', color: '#10b981' },
        limit: 3500,
        available: 2220,
        closing: 5,
        due: 12,
        percent: 63.4,
        lastDigits: '***'
    }
];

const projectionData = [
    { month: 'jan', value: 400, limit: 4600, percent: 8.0 },
    { month: 'fev', value: 400, limit: 4600, percent: 8.0 },
    { month: 'mar', value: 400, limit: 4600, percent: 8.0 },
    { month: 'abr', value: 400, limit: 4600, percent: 8.0 },
    { month: 'mai', value: 400, limit: 4600, percent: 8.0 },
    { month: 'jun', value: 300, limit: 4700, percent: 6.0 },
];

const transactionsData = [
    { id: '1', desc: 'Notebook Dell', category: 'Tecnologia', card: 'Nubank Roxinho', parcels: '3/12', value: 300, total: 3600, status: 'Pago', icon: 'ri-computer-line', color: 'blue' },
    { id: '2', desc: 'Netflix Premium', category: 'Lazer', card: 'Inter Gold', parcels: '1/1', value: 55.90, total: null, status: 'Pago', icon: 'ri-gamepad-line', color: 'violet' },
    { id: '3', desc: 'Academia SmartFit', category: 'Saúde', card: 'C6 Bank', parcels: '1/1', value: 89.90, total: null, status: 'Pago', icon: 'ri-heart-pulse-line', color: 'emerald' },
    { id: '4', desc: 'Spotify Duo', category: 'Lazer', card: 'Nubank Roxinho', parcels: '1/1', value: 21.90, total: null, status: 'Pago', icon: 'ri-music-line', color: 'violet' },
    { id: '5', desc: 'Restaurante', category: 'Alimentação', card: 'C6 Bank', parcels: '1/1', value: 180.00, total: null, status: 'Pago', icon: 'ri-restaurant-line', color: 'red' },
    { id: '6', desc: 'Curso Udemy', category: 'Educação', card: 'Nubank Roxinho', parcels: '1/6', value: 100.00, total: 600, status: 'Pago', icon: 'ri-book-open-line', color: 'cyan' },
];

const THEME = {
    primary: '#10b981',
    danger: '#ef4444',
    grid: '#334155',
    text: '#94a3b8',
    tooltipBg: '#1e293b',
};

const Header = () => (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <i className="ri-wallet-3-fill text-2xl text-primary"></i>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">FinanceFlow</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex bg-secondary rounded-full p-1 gap-1">
                        <button className="px-4 py-1.5 rounded-full text-sm font-medium bg-primary text-primary-foreground shadow-lg shadow-primary/20">Minhas Finanças</button>
                        <button className="px-4 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Finanças do Grupo</button>
                    </div>
                    <Button variant="primary">
                        <i className="ri-add-line text-lg mr-2"></i>
                        <span className="hidden sm:inline">Nova Despesa</span>
                    </Button>
                </div>
            </div>
        </div>
    </header>
);

const KPIGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
            title="Saldo Atual"
            value="R$ 6.952,30"
            subtitle="Positivo este mês"
            variant="primary"
            icon={<i className="ri-wallet-3-line text-2xl"></i>}
        />
        <MetricCard
            title="Receitas do Mês"
            value="R$ 7.700,00"
            subtitle="2 entrada(s)"
            icon={<i className="ri-arrow-down-line text-2xl"></i>}
        />
        <MetricCard
            title="Despesas do Mês"
            value="R$ 747,70"
            subtitle="6 despesa(s)"
            variant="danger"
            icon={<i className="ri-arrow-up-line text-2xl"></i>}
        />
    </div>
);

const FinancialChart = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <i className="ri-line-chart-line text-primary"></i> Fluxo de Caixa Mensal
            </h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={THEME.grid} opacity={0.5} vertical={false} />
                        <XAxis dataKey="name" stroke={THEME.text} axisLine={false} tickLine={false} dy={10} />
                        <YAxis stroke={THEME.text} axisLine={false} tickLine={false} dx={-10} />
                        <Tooltip
                            contentStyle={{ backgroundColor: THEME.tooltipBg, borderColor: THEME.grid, color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        <Line type="monotone" dataKey="Receitas" stroke={THEME.primary} strokeWidth={3} dot={{ r: 4, fill: THEME.primary }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="Despesas" stroke={THEME.danger} strokeWidth={3} dot={{ r: 4, fill: THEME.danger }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>

        <GlassCard>
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <i className="ri-information-line text-primary"></i> Resumo Financeiro
            </h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-secondary/30 rounded-xl border border-border/50">
                    <span className="text-muted-foreground">Taxa de Economia</span>
                    <span className="text-xl font-bold text-primary">90.3%</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-secondary/30 rounded-xl border border-border/50">
                    <span className="text-muted-foreground">Média Diária</span>
                    <span className="text-xl font-bold text-foreground">R$ 24,92</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-secondary/30 rounded-xl border border-border/50">
                    <span className="text-muted-foreground">Fixas</span>
                    <span className="text-xl font-bold text-yellow-500">8</span>
                </div>
            </div>
        </GlassCard>
    </div>
);

const CreditCardGrid = () => (
    <div>
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <i className="ri-bank-card-line text-primary"></i> Gerenciamento de Cartões
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cardsData.map((card) => (
                <CreditCard
                    key={card.id}
                    card={card}
                    showProgressBar={true}
                />
            ))}
        </div>
    </div>
);

const ProjectionTable = () => (
    <GlassCard className="xl:col-span-1 h-fit">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <i className="ri-calendar-line text-primary"></i> Projeção (Nubank)
        </h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-secondary/50">
                    <tr>
                        <th className="px-3 py-3 rounded-l-lg">Mês</th>
                        <th className="px-3 py-3 text-right">Valor</th>
                        <th className="px-3 py-3 text-right rounded-r-lg">%</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                    {projectionData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-secondary/30 transition-colors">
                            <td className="px-3 py-3 font-medium text-foreground capitalize">{row.month}</td>
                            <td className="px-3 py-3 text-right text-destructive">R$ {row.value},00</td>
                            <td className="px-3 py-3 text-right">
                                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold">
                                    {row.percent}%
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </GlassCard>
);

const TransactionList = () => (
    <div className="xl:col-span-2 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <i className="ri-list-check text-primary"></i> Lista de Despesas
            </h2>
            <div className="flex gap-2">
                <select className="bg-card border border-border text-muted-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5">
                    <option>Todas Categorias</option>
                    <option>Tecnologia</option>
                    <option>Lazer</option>
                </select>
                <select className="bg-card border border-border text-muted-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5">
                    <option>Status: Todos</option>
                    <option>Pago</option>
                </select>
            </div>
        </div>

        <GlassCard className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-muted-foreground">
                    <thead className="text-xs uppercase bg-secondary/80 text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4">Descrição</th>
                            <th className="px-6 py-4">Categoria</th>
                            <th className="px-6 py-4">Cartão</th>
                            <th className="px-6 py-4 text-center">Parc.</th>
                            <th className="px-6 py-4 text-right">Valor</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {transactionsData.map((t) => (
                            <tr key={t.id} className="hover:bg-secondary/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${t.color}-500/10`}>
                                            <i className={`${t.icon} text-lg text-${t.color}-500`}></i>
                                        </div>
                                        <div>
                                            <div className="text-foreground font-medium">{t.desc}</div>
                                            {t.total && <div className="text-xs">Total: R$ {t.total}</div>}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {/* @ts-ignore */}
                                    <Badge variant={t.color}>{t.category}</Badge>
                                </td>
                                <td className="px-6 py-4">{t.card}</td>
                                <td className="px-6 py-4 text-center font-medium text-foreground">{t.parcels}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="font-bold text-foreground">R$ {t.value.toFixed(2)}</div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-bold uppercase">
                                        {t.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"><i className="ri-pencil-line"></i></button>
                                        <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive"><i className="ri-delete-bin-line"></i></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </GlassCard>
    </div>
);

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans w-full">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <KPIGrid />
                <FinancialChart />
                <CreditCardGrid />

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <ProjectionTable />
                    <TransactionList />
                </div>
            </main>
        </div>
    );
}
