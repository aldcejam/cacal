import { useMemo } from 'react';
import { creditCards } from '../mocks/cartao';
import { gastosRecorrentesData } from '../mocks/gastoRecorrente';

export const useFinancialSummary = () => {
    const totalGastos = useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return gastosRecorrentesData.reduce((acc: number, g: any) => acc + g.valor, 0);
    }, []);

    const totalCartoes = creditCards.length;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalLimite = creditCards.reduce((acc: number, c: any) => acc + c.limit, 0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalDisponivel = creditCards.reduce((acc: number, c: any) => acc + c.available, 0);

    return {
        totalGastos,
        totalCartoes,
        totalLimite,
        totalDisponivel
    };
};
