import React from 'react';

interface BadgeProps {
    color?: 'blue' | 'violet' | 'emerald' | 'red' | 'cyan' | 'default';
    children: React.ReactNode;
}

export const Badge = ({ color = 'default', children }: BadgeProps) => {
    const colors = {
        blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
        emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        red: 'bg-red-500/10 text-red-400 border-red-500/20',
        cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        default: 'bg-secondary text-muted-foreground border-border'
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap border ${colors[color]}`}>
            {children}
        </span>
    );
};
