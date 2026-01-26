import React from 'react';

interface BadgeProps {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'outline' | 'blue' | 'violet' | 'emerald' | 'red' | 'cyan';
    size?: 'sm' | 'md';
    children: React.ReactNode;
}

export const Badge = ({ variant = 'default', size = 'md', children }: BadgeProps) => {
    const variants = {
        default: 'bg-primary/10 text-primary border-primary/20',
        success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        error: 'bg-red-500/10 text-red-400 border-red-500/20',
        info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        neutral: 'bg-secondary text-muted-foreground border-border',
        outline: 'bg-transparent border-border text-foreground',
    };

    const additionalColors = {
        blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
        emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        red: 'bg-red-500/10 text-red-400 border-red-500/20',
        cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-0.5 text-xs',
    };

    const allVariants = { ...variants, ...additionalColors };

    // @ts-ignore - allowing dynamic access for backward compat
    const selectedStyle = allVariants[variant] || allVariants.default;
    // @ts-ignore
    const selectedSize = sizes[size];

    return (
        <span className={`inline-flex items-center rounded-full font-medium whitespace-nowrap border ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${selectedStyle} ${selectedSize}`}>
            {children}
        </span>
    );
};
