export interface Usuario {
  id: string;
  name: string;
  email: string;
  isPrincipal: boolean; // Usuário principal pode ver tudo
  color: string; // Cor para identificação visual
}

export const usuarios: Usuario[] = [
  {
    id: 'u1',
    name: 'João Silva',
    email: 'joao@example.com',
    isPrincipal: true,
    color: '#10b981' // emerald
  },
  {
    id: 'u2',
    name: 'Maria Santos',
    email: 'maria@example.com',
    isPrincipal: false,
    color: '#8b5cf6' // violet
  },
  {
    id: 'u3',
    name: 'Pedro Costa',
    email: 'pedro@example.com',
    isPrincipal: false,
    color: '#f59e0b' // amber
  },
  {
    id: 'u4',
    name: 'Ana Oliveira',
    email: 'ana@example.com',
    isPrincipal: false,
    color: '#ef4444' // rose
  }
];

// Função helper para obter o usuário principal
export const getUsuarioPrincipal = (): Usuario | undefined => {
  return usuarios.find(u => u.isPrincipal);
};

// Função helper para obter usuário atual (simulado - em produção viria de auth)
export const getUsuarioAtual = (): Usuario => {
  // Por padrão, retorna o usuário principal
  return getUsuarioPrincipal() || usuarios[0];
};
