export interface Usuario {
  id: string;
  name: string;
  email: string;
}

export const usuarios: Usuario[] = [
  {
    id: 'u1',
    name: 'João Silva',
    email: 'joao@example.com',
  },
  {
    id: 'u2',
    name: 'Maria Santos',
    email: 'maria@example.com',
  },
  {
    id: 'u3',
    name: 'Pedro Costa',
    email: 'pedro@example.com',
  },
  {
    id: 'u4',
    name: 'Ana Oliveira',
    email: 'ana@example.com',
  }
];

// Helper to get current user (simulated)
export const getUsuarioAtual = (): Usuario => {
  return usuarios[0];
};

