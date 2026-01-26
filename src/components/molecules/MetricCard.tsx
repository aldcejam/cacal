import React from 'react';
import { GlassCard } from '../atoms/GlassCard';
import { Typography } from '../atoms/Typography';

interface MetricCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: React.ReactNode;
    variant?: 'default' | 'primary' | 'danger' | 'warning' | 'success';
}

export const MetricCard = ({ title, value, subtitle, icon, variant = 'default' }: MetricCardProps) => {
    // Primary variant (Highlighted)
    if (variant === 'primary') {
        return (
            <div className="rounded-2xl p-6 shadow-xl bg-gradient-to-br from-primary to-emerald-600 relative overflow-hidden text-white transition-transform duration-300 hover:scale-[1.02]">
                <div className="relative z-10">
                    <div className="flex justify-between mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-inner text-white">
                            {icon}
                        </div>
                        <Typography variant="body-sm" className="text-emerald-50 font-medium">
                            {title}
                        </Typography>
                    </div>
                    <Typography variant="h2" weight="bold" className="mb-1 text-white">
                        {value}
                    </Typography>
                    {subtitle && (
                        <Typography variant="body-sm" className="text-emerald-50 opacity-90">
                            {subtitle}
                        </Typography>
                    )}
                </div>
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            </div>
        );
    }

    // Define icon styles based on variant
    const getVariantStyles = () => {
        switch (variant) {
            case 'danger': return { bg: 'bg-destructive/10', text: 'text-destructive' };
            case 'warning': return { bg: 'bg-warning/10', text: 'text-warning' };
            case 'success': return { bg: 'bg-success/10', text: 'text-success' };
            default: return { bg: 'bg-primary/10', text: 'text-primary' };
        }
    };

    const { bg, text } = getVariantStyles();

    return (
        <GlassCard className="transition-transform duration-300 hover:scale-[1.02] border-border/40 hover:border-primary/20" hoverEffect={true}>
            <div className="flex justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} shadow-sm`}>
                    <span className={`text-2xl ${text}`}>{icon}</span>
                </div>
                <Typography variant="body-sm" weight="medium" className="text-muted-foreground">
                    {title}
                </Typography>
            </div>
            <Typography variant="h2" weight="bold" className="mb-1 text-foreground">
                {value}
            </Typography>
            {subtitle && (
                <Typography variant="body-sm" className="text-muted-foreground">
                    {subtitle}
                </Typography>
            )}
        </GlassCard>
    );
};
