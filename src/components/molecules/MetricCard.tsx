import React from 'react';
import { GlassCard } from '../atoms/GlassCard';

interface MetricCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: React.ReactNode;
    variant?: 'default' | 'primary' | 'danger'; // Primary being the highlighted one
}

export const MetricCard = ({ title, value, subtitle, icon, variant = 'default' }: MetricCardProps) => {
    if (variant === 'primary') {
        return (
            <div className="rounded-2xl p-6 shadow-xl bg-gradient-to-br from-primary to-emerald-600 relative overflow-hidden text-white transition-transform hover:scale-[1.02]">
                <div className="relative z-10">
                    <div className="flex justify-between mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            {icon}
                        </div>
                        <span className="text-emerald-50 font-medium text-sm">{title}</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">{value}</h3>
                    {subtitle && <p className="text-emerald-50 text-sm">{subtitle}</p>}
                </div>
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            </div>
        );
    }

    // Default / Danger variants use GlassCard
    const iconBg = variant === 'danger' ? 'bg-danger/10' : 'bg-primary/10';
    const iconColor = variant === 'danger' ? 'text-danger' : 'text-primary';
    const textColor = 'text-foreground';

    return (
        <GlassCard className="transition-transform hover:scale-[1.02] bg-card border-border/50">
            <div className="flex justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
                    <span className={`text-2xl ${iconColor}`}>{icon}</span>
                </div>
                <span className="text-muted-foreground text-sm font-medium">{title}</span>
            </div>
            <h3 className={`text-3xl font-bold mb-1 ${textColor}`}>{value}</h3>
            {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
        </GlassCard>
    );
};
