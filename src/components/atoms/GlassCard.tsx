import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export const GlassCard = ({ children, className = "", hoverEffect = false, ...props }: GlassCardProps) => {
    const hoverClasses = hoverEffect
        ? "transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-primary/30"
        : "";

    return (
        <div
            className={`bg-card/60 backdrop-blur-xl border border-border/60 rounded-2xl p-6 shadow-sm ${hoverClasses} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};
