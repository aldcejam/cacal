import React from 'react';
// @ts-ignore
import { usuarios, type Usuario } from '../../mocks/usuario';

interface UserSelectorProps {
    selectedUserIds: string[];
    onToggleUser: (userId: string) => void;
    currentUser: Usuario;
}

export const UserSelector: React.FC<UserSelectorProps> = ({
    selectedUserIds,
    onToggleUser,
    currentUser
}) => {
    // Se não for usuário principal, só mostra o próprio usuário
    const availableUsers = currentUser.isPrincipal
        ? usuarios
        : usuarios.filter(u => u.id === currentUser.id);

    // Se não for principal, sempre seleciona apenas o próprio usuário
    const effectiveSelectedIds = currentUser.isPrincipal
        ? selectedUserIds
        : [currentUser.id];

    return (
        <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <h2 className="text-lg font-semibold text-foreground">
                        {currentUser.isPrincipal ? 'Usuários' : 'Meu Perfil'}
                    </h2>
                </div>
                {currentUser.isPrincipal && effectiveSelectedIds.length > 0 && (
                    <span className="text-sm text-muted-foreground">
                        {effectiveSelectedIds.length} selecionado(s)
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {availableUsers.map((user) => {
                    const isSelected = effectiveSelectedIds.includes(user.id);

                    return (
                        <div
                            key={user.id}
                            onClick={() => currentUser.isPrincipal && onToggleUser(user.id)}
                            className={`
                rounded-xl p-5 border-2 transition-all duration-300 cursor-pointer select-none
                ${isSelected
                                    ? 'opacity-100 scale-[1.02] ring-2 ring-offset-2 ring-offset-background ring-primary border-primary/50 bg-card'
                                    : 'opacity-70 hover:opacity-100 hover:scale-[1.01] border-border bg-card/50'}
                ${!currentUser.isPrincipal ? 'cursor-default' : ''}
              `}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg"
                                        style={{ backgroundColor: user.color }}
                                    >
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">{user.name}</h3>
                                        {user.isPrincipal && (
                                            <span className="text-xs text-primary font-medium">Principal</span>
                                        )}
                                    </div>
                                </div>
                                {isSelected && (
                                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
