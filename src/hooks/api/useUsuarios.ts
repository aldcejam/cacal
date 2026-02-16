import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/api';

export const useUsuarios = () => {
    return useQuery({
        queryKey: ['usuarios'],
        queryFn: () => api.usuario.findAll({}),
    });
};
