import { usuarios, type Usuario } from "./usuario";

export interface Receita {
    id: string;
    user: Usuario;
    descricao: string;
    categoria: 'Salário' | 'Benefício' | 'Investimento' | 'Extra' | 'Outros';
    valor: number;
    diaRecebimento: number; // Day of the month
}

export const receitasData: Receita[] = [
    {
        id: 'r1',
        user: usuarios[0], // João Silva
        descricao: 'Salário Mensal',
        categoria: 'Salário',
        valor: 8500.00,
        diaRecebimento: 5
    },
    {
        id: 'r2',
        user: usuarios[0],
        descricao: 'Vale Refeição',
        categoria: 'Benefício',
        valor: 900.00,
        diaRecebimento: 1
    },
    {
        id: 'r3',
        user: usuarios[0],
        descricao: 'Rendimentos NuBank',
        categoria: 'Investimento',
        valor: 150.45,
        diaRecebimento: 15
    },
    {
        id: 'r4',
        user: usuarios[1], // Maria Santos
        descricao: 'Salário',
        categoria: 'Salário',
        valor: 6200.00,
        diaRecebimento: 5
    },
    {
        id: 'r5',
        user: usuarios[1],
        descricao: 'Auxílio Home Office',
        categoria: 'Benefício',
        valor: 200.00,
        diaRecebimento: 5
    },
    {
        id: 'r6',
        user: usuarios[1],
        descricao: 'Venda de Bolos',
        categoria: 'Extra',
        valor: 450.00,
        diaRecebimento: 20
    },
    {
        id: 'r7',
        user: usuarios[2], // Pedro Costa
        descricao: 'Bolsa Estágio',
        categoria: 'Salário',
        valor: 1200.00,
        diaRecebimento: 10
    },
    {
        id: 'r8',
        user: usuarios[2],
        descricao: 'Vale Transporte',
        categoria: 'Benefício',
        valor: 180.00,
        diaRecebimento: 1
    }
];
