import { creditCards, type Card } from "./cartao";

export interface Transaction {
  id: string;
  card: Card;
  description: string;
  category: string;
  value: number;
  parcels: string;
  total: number;
}

export const transactionsData: Transaction[] = [
  { id: 't1', card: creditCards[0], description: 'Amazon Prime', category: 'Streaming', value: 14.90, parcels: '1/1', total: 14.90 },
  { id: 't2', card: creditCards[0], description: 'iFood', category: 'Alimentação', value: 45.50, parcels: '1/1', total: 45.50 },
  { id: 't3', card: creditCards[1], description: 'Notebook Dell', category: 'Eletrônicos', value: 299.90, parcels: '3/12', total: 3598.80 },
  { id: 't4', card: creditCards[1], description: 'Spotify', category: 'Streaming', value: 21.90, parcels: '1/1', total: 21.90 },
  { id: 't5', card: creditCards[2], description: 'Uber', category: 'Transporte', value: 32.00, parcels: '1/1', total: 32.00 },
  { id: 't6', card: creditCards[2], description: 'Farmácia', category: 'Saúde', value: 89.90, parcels: '2/3', total: 269.70 },
  { id: 't7', card: creditCards[0], description: 'Netflix', category: 'Streaming', value: 55.90, parcels: '1/1', total: 55.90 },
];