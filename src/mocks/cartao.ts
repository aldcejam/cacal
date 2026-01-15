import { banks, type BankInterface } from "./banco";

export interface Card {
    id: string;
    lastDigits: string;
    limit: number;
    available: number;
    dueDate?: string;
    closingDate?: string;
    user: {
        id: string;
        name: string;
    };
    bank: BankInterface;
}

export const creditCards: Card[] = [
    {
        id: '1',
        lastDigits: '1234',
        limit: 5000,
        available: 2660,
        dueDate: '2023-10-10',
        closingDate: '2023-10-05',
        user: {
            id: 'u1',
            name: 'User 1'
        },
        bank: banks[0]
    },
    {
        id: '2',
        lastDigits: '5678',
        limit: 8000,
        available: 3440,
        dueDate: '2023-10-15',
        closingDate: '2023-10-10',
        user: {
            id: 'u2',
            name: 'User 2'
        },
        bank: banks[1]
    },
    {
        id: '3',
        lastDigits: '9012',
        limit: 3500,
        available: 2220,
        dueDate: '2023-10-20',
        closingDate: '2023-10-15',
        user: {
            id: 'u3',
            name: 'User 3'
        },
        bank: banks[2]
    }
];