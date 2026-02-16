import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/api';

export const useReceitas = () => {
    return useQuery({
        queryKey: ['receitas'],
        queryFn: () => api.receita.findAll({}),
    });
};
