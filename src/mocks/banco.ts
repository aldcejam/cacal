export interface Bank {
    id: number;
    name: string;
    color: string;
    limit: number;
    dueDate: string;
    closingDate: string;
}

export const banks: Bank[] = [
    {
        id: 1,
        name: 'Nubank',
        limit: 5000,
        dueDate: '10',
        closingDate: '30',
        color: '#8A05BE',
    },
    {
        id: 2,
        name: 'C6 Bank',
        limit: 3000,
        dueDate: '15',
        closingDate: '28',
        color: '#6348B8',
    },
    {
        id: 3,
        name: 'Banco Inter',
        limit: 4000,
        dueDate: '12',
        closingDate: '25',
        color: '#FF8800',
    },
];