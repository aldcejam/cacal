import React from 'react';

export const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-xl ${className}`}>
        {children}
    </div>
);
