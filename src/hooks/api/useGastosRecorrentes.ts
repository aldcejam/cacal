import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/api';

export const useGastosRecorrentes = () => {
    return useQuery({
        queryKey: ['gastosRecorrentes'],
        queryFn: () => api.gastoRecorrente.findAll({}),
    });
};
