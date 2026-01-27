import { usuarios, type Usuario } from "./usuario";

export interface GastoRecorrente {
  id: string;
  user: Usuario; // Usuario dono do gasto
  pagamento: string; // Forma de pagamento
  descricao: string;
  categoria: string;
  valor: number;
}

export const gastosRecorrentesData: GastoRecorrente[] = [
  {
    id: 'gr1',
    user: usuarios[0],
    pagamento: 'Cartão de Crédito',
    descricao: 'Netflix',
    categoria: 'Streaming',
    valor: 55.90
  },
  {
    id: 'gr2',
    user: usuarios[0],
    pagamento: 'Débito Automático',
    descricao: 'Academia SmartFit',
    categoria: 'Saúde',
    valor: 89.90
  },
  {
    id: 'gr3',
    user: usuarios[1],
    pagamento: 'PIX',
    descricao: 'Spotify Premium',
    categoria: 'Streaming',
    valor: 21.90
  },
  {
    id: 'gr4',
    user: usuarios[1],
    pagamento: 'Cartão de Crédito',
    descricao: 'Amazon Prime',
    categoria: 'Streaming',
    valor: 14.90
  },
  {
    id: 'gr5',
    user: usuarios[2],
    pagamento: 'Débito Automático',
    descricao: 'Plano de Celular',
    categoria: 'Telecomunicações',
    valor: 79.90
  },
  {
    id: 'gr6',
    user: usuarios[3],
    pagamento: 'PIX',
    descricao: 'Curso Online',
    categoria: 'Educação',
    valor: 199.90
  },
];
