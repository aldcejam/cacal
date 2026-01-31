import { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { type Transaction, type Card, type GastoRecorrente, type Usuario, type Receita } from '../types';

export const useFinancialSummary = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [cards, setCards] = useState<Card[]>([]);
    const [recurringExpenses, setRecurringExpenses] = useState<GastoRecorrente[]>([]);
    const [receitas, setReceitas] = useState<Receita[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [transData, cardsData, recurringData, receitasData, usersData] = await Promise.all([
                    api.getTransacoes(),
                    api.getCartoes(),
                    api.getGastosRecorrentes(),
                    api.getReceitas(),
                    api.getUsuarios()
                ]);
                setTransactions(transData);
                setCards(cardsData);
                setRecurringExpenses(recurringData);
                setReceitas(receitasData);
                setUsuarios(usersData);
            } catch (err) {
                console.error("Error fetching financial data:", err);
                setError("Failed to load financial data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const totalGastos = useMemo(() => {
        return recurringExpenses.reduce((acc, curr) => acc + curr.valor, 0);
    }, [recurringExpenses]);

    const totalCartoes = useMemo(() => {
        return cards.length;
    }, [cards]);

    const totalLimite = useMemo(() => {
        return cards.reduce((acc, card) => acc + card.limit, 0);
    }, [cards]);

    const totalDisponivel = useMemo(() => {
        return cards.reduce((acc, card) => acc + card.available, 0);
    }, [cards]);

    return {
        totalGastos,
        totalCartoes,
        totalLimite,
        totalDisponivel,
        transactions,
        cards,
        recurringExpenses,
        receitas,
        usuarios,
        loading,
        error
    };
};
