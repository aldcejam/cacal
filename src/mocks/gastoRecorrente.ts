export interface GastoRecorrente {
  id: string;
  userId: string; // ID do usuário dono do gasto
  pagamento: string; // Forma de pagamento
  descricao: string;
  categoria: string;
  valor: number;
}

export const gastosRecorrentesData: GastoRecorrente[] = [
  {
    id: 'gr1',
    userId: 'u1',
    pagamento: 'Cartão de Crédito',
    descricao: 'Netflix',
    categoria: 'Streaming',
    valor: 55.90
  },
  {
    id: 'gr2',
    userId: 'u1',
    pagamento: 'Débito Automático',
    descricao: 'Academia SmartFit',
    categoria: 'Saúde',
    valor: 89.90
  },
  {
    id: 'gr3',
    userId: 'u2',
    pagamento: 'PIX',
    descricao: 'Spotify Premium',
    categoria: 'Streaming',
    valor: 21.90
  },
  {
    id: 'gr4',
    userId: 'u2',
    pagamento: 'Cartão de Crédito',
    descricao: 'Amazon Prime',
    categoria: 'Streaming',
    valor: 14.90
  },
  {
    id: 'gr5',
    userId: 'u3',
    pagamento: 'Débito Automático',
    descricao: 'Plano de Celular',
    categoria: 'Telecomunicações',
    valor: 79.90
  },
  {
    id: 'gr6',
    userId: 'u4',
    pagamento: 'PIX',
    descricao: 'Curso Online',
    categoria: 'Educação',
    valor: 199.90
  },
];
