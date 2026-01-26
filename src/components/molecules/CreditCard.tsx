import React from 'react';

// Using a simplified interface based on usage
interface CardData {
    id: string;
    bank: {
        name: string;
        color: string;
    };
    lastDigits: string;
    limit: number;
    available: number;
    closing?: number;
    due?: number;
    percent?: number; // Optional for progress bar
}

interface CreditCardProps {
    card: CardData;
    isSelected?: boolean;
    onClick?: () => void;
    showProgressBar?: boolean;
}

const darkenColor = (hex: string, percent: number) => {
    let useHex = hex.replace(/^\s*#|\s*$/g, '');
    if (useHex.length === 3) useHex = useHex.replace(/(.)/g, '$1$1');

    const num = parseInt(useHex, 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;

    return '#' + (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
};

export const CreditCard = ({ card, isSelected = false, onClick, showProgressBar = false }: CreditCardProps) => {
    const primaryColor = card.bank.color;
    const secondaryColor = darkenColor(primaryColor, 30); // You might want to move darkenColor to a utility

    const gradientStyle = {
        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
    };

    const opacityClass = isSelected
        ? 'opacity-100 scale-[1.02] ring-2 ring-offset-2 ring-offset-background ring-primary'
        : 'opacity-80 hover:opacity-100 hover:scale-[1.01]';

    return (
        <div
            onClick={onClick}
            style={gradientStyle}
            className={`rounded-xl p-5 text-white shadow-lg transition-all duration-300 cursor-pointer select-none border border-white/10 relative overflow-hidden ${onClick ? opacityClass : ''}`}
        >
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">{card.bank.name} • {card.lastDigits}</h3>
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>}
                </div>

                <p className="text-xs uppercase tracking-wider opacity-70 mb-1 font-medium">Limite Total</p>
                <p className="text-2xl font-bold mb-3 tracking-tight">R$ {card.limit.toLocaleString('pt-BR')}</p>

                <div className="flex justify-between items-end">
                    <p className="text-sm opacity-80 font-medium">Disponível: R$ {card.available.toLocaleString('pt-BR')}</p>
                </div>

                {showProgressBar && card.percent !== undefined && (
                    <div className="mt-4">
                        <div className="w-full bg-black/20 rounded-full h-2">
                            <div
                                className="bg-white h-full rounded-full transition-all duration-1000"
                                style={{ width: `${card.percent}%` }}
                            ></div>
                        </div>
                        {(card.closing || card.due) && (
                            <div className="flex justify-between pt-2 mt-2 border-t border-white/20 text-xs text-white/90">
                                {card.closing && <div><span className="opacity-70">Fecha:</span> <strong>Dia {card.closing}</strong></div>}
                                {card.due && <div><span className="opacity-70">Vence:</span> <strong>Dia {card.due}</strong></div>}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>
    );
};
