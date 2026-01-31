
export interface Usuario {
    id: string;
    name: string;
    email: string;
}

export interface Bank {
    id: number;
    name: string;
    color: string;
    limit: number;
    dueDate: string;
    closingDate: string;
}

export interface Card {
    id: string;
    lastDigits: string;
    limit: number;
    available: number;
    dueDate?: string;
    closingDate?: string;
    user: Usuario;
    bank: Bank;
}

export interface Transaction {
    id: string;
    card: Card;
    description: string;
    category: string;
    value: number;
    parcels: string;
    total: number;
}

export interface GastoRecorrente {
    id: string;
    user: Usuario;
    pagamento: string;
    descricao: string;
    categoria: string;
    valor: number;
}

export interface Receita {
    id: string;
    user: Usuario;
    descricao: string;
    categoria: 'Salário' | 'Benefício' | 'Investimento' | 'Extra' | 'Outros';
    valor: number;
    diaRecebimento: number;
}

export type Page = 'visao-geral' | 'entradas' | 'cartoes' | 'gastos-recorrentes' | 'relatorios' | 'configuracoes' | 'design-system';
