export interface Receita {
    id: string;
    userId: string;
    descricao: string;
    categoria: 'Salário' | 'Benefício' | 'Investimento' | 'Extra' | 'Outros';
    valor: number;
    diaRecebimento: number; // Day of the month
}

export const receitasData: Receita[] = [
    {
        id: 'r1',
        userId: 'u1', // João Silva
        descricao: 'Salário Mensal',
        categoria: 'Salário',
        valor: 8500.00,
        diaRecebimento: 5
    },
    {
        id: 'r2',
        userId: 'u1',
        descricao: 'Vale Refeição',
        categoria: 'Benefício',
        valor: 900.00,
        diaRecebimento: 1
    },
    {
        id: 'r3',
        userId: 'u1',
        descricao: 'Rendimentos NuBank',
        categoria: 'Investimento',
        valor: 150.45,
        diaRecebimento: 15
    },
    {
        id: 'r4',
        userId: 'u2', // Maria Santos
        descricao: 'Salário',
        categoria: 'Salário',
        valor: 6200.00,
        diaRecebimento: 5
    },
    {
        id: 'r5',
        userId: 'u2',
        descricao: 'Auxílio Home Office',
        categoria: 'Benefício',
        valor: 200.00,
        diaRecebimento: 5
    },
    {
        id: 'r6',
        userId: 'u2',
        descricao: 'Venda de Bolos',
        categoria: 'Extra',
        valor: 450.00,
        diaRecebimento: 20
    },
    {
        id: 'r7',
        userId: 'u3', // Pedro Costa
        descricao: 'Bolsa Estágio',
        categoria: 'Salário',
        valor: 1200.00,
        diaRecebimento: 10
    },
    {
        id: 'r8',
        userId: 'u3',
        descricao: 'Vale Transporte',
        categoria: 'Benefício',
        valor: 180.00,
        diaRecebimento: 1
    }
];
