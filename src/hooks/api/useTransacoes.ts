import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/api';

export const useTransacoes = () => {
    return useQuery({
        queryKey: ['transacoes'],
        queryFn: () => api.transacao.findAll({}),
    });
};
