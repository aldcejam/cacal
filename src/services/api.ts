
const API_URL = 'http://localhost:3000';

export const api = {
    getUsuarios: async () => {
        const response = await fetch(`${API_URL}/usuarios`);
        if (!response.ok) throw new Error('Failed to fetch usuarios');
        return response.json();
    },
    getCartoes: async () => {
        const response = await fetch(`${API_URL}/cartoes`);
        if (!response.ok) throw new Error('Failed to fetch cartoes');
        return response.json();
    },
    getTransacoes: async () => {
        const response = await fetch(`${API_URL}/transacoes`);
        if (!response.ok) throw new Error('Failed to fetch transacoes');
        return response.json();
    },
    getGastosRecorrentes: async () => {
        const response = await fetch(`${API_URL}/gastosRecorrentes`);
        if (!response.ok) throw new Error('Failed to fetch gastos recorrentes');
        return response.json();
    },
    getReceitas: async () => {
        const response = await fetch(`${API_URL}/receitas`);
        if (!response.ok) throw new Error('Failed to fetch receitas');
        return response.json();
    }
};
