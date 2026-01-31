import { Typography } from '../atoms/Typography';

interface RecurringExpensesCardProps {
    totalValue: number;
    count: number;
    isSelected: boolean;
    onClick: () => void;
}

export const RecurringExpensesCard = ({ totalValue, count, isSelected, onClick }: RecurringExpensesCardProps) => {
    // Style similar to CreditCard but with a specific recurring theme color (e.g., Purple/Indigo)
    const primaryColor = '#6366f1'; // Indigo-500
    const secondaryColor = '#4338ca'; // Indigo-700

    const gradientStyle = {
        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
    };

    const opacityClass = isSelected
        ? 'opacity-100 scale-[1.02] ring-2 ring-offset-2 ring-offset-background ring-primary shadow-xl'
        : 'opacity-90 hover:opacity-100 hover:scale-[1.01] hover:shadow-lg';

    return (
        <div
            onClick={onClick}
            style={gradientStyle}
            className={`
                rounded-xl p-6 text-white transition-all duration-300 cursor-pointer select-none 
                border border-white/10 relative overflow-hidden 
                ${opacityClass}
            `}
        >
            <div className="relative z-10 flex flex-col justify-between h-full min-h-[180px]"> {/* Adjusted min-height to match card visual */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        {/* Icon placeholder similar to chip */}
                        <div className="w-8 h-8 bg-white/20 rounded-md backdrop-blur-sm border border-white/10 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        </div>
                        <Typography variant="body-base" weight="semibold" className="text-white">
                            Gastos Recorrentes
                        </Typography>
                    </div>
                </div>

                <div className="space-y-1 mb-4 flex-1 flex flex-col justify-end">
                    <Typography variant="body-xs" className="uppercase tracking-wider opacity-70 font-medium">
                        Total Mensal
                    </Typography>
                    <Typography variant="h3" weight="bold" className="tracking-tight">
                        R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Typography>
                </div>

                <div className="flex justify-between items-end mt-2">
                    <Typography variant="body-sm" className="opacity-90 font-medium">
                        {count} {count === 1 ? 'item' : 'itens'}
                    </Typography>
                </div>
            </div>

            {/* Visual decorations matching CreditCard */}
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -left-12 -top-12 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        </div>
    );
};
