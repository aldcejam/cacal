import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/api';

export const useCartoes = () => {
    return useQuery({
        queryKey: ['cartoes'],
        queryFn: () => api.cartao.findAll({}),
    });
};
