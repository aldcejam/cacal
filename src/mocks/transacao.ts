interface Transaction {
  id: string;
  cardId: string;
  description: string;
  category: string;
  value: number;
  parcels: string;
  total: number;
}

export const transactionsData: Transaction[] = [
  { id: 't1', cardId: '1', description: 'Amazon Prime', category: 'Streaming', value: 14.90, parcels: '1/1', total: 14.90 },
  { id: 't2', cardId: '1', description: 'iFood', category: 'Alimentação', value: 45.50, parcels: '1/1', total: 45.50 },
  { id: 't3', cardId: '2', description: 'Notebook Dell', category: 'Eletrônicos', value: 299.90, parcels: '3/12', total: 3598.80 },
  { id: 't4', cardId: '2', description: 'Spotify', category: 'Streaming', value: 21.90, parcels: '1/1', total: 21.90 },
  { id: 't5', cardId: '3', description: 'Uber', category: 'Transporte', value: 32.00, parcels: '1/1', total: 32.00 },
  { id: 't6', cardId: '3', description: 'Farmácia', category: 'Saúde', value: 89.90, parcels: '2/3', total: 269.70 },
  { id: 't7', cardId: '1', description: 'Netflix', category: 'Streaming', value: 55.90, parcels: '1/1', total: 55.90 },
];