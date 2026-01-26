import React from 'react';
// @ts-ignore
import { type Card } from '../mocks/cartao';
// @ts-ignore
import { type GastoRecorrente } from '../mocks/gastoRecorrente';
// @ts-ignore
import { type Usuario } from '../mocks/usuario';

interface UserBlockProps {
  user: Usuario;
  cards: Card[];
  gastosRecorrentes: GastoRecorrente[];
  selectedCardIds: string[];
  onToggleCard: (cardId: string) => void;
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

const getCategoryStyle = (category: string) => {
  switch (category) {
    case 'Streaming': return 'bg-violet-500/20 text-violet-300 border-violet-500/30';
    case 'Alimentação': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    case 'Eletrônicos': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case 'Transporte': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    case 'Saúde': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    case 'Telecomunicações': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
    case 'Educação': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
    default: return 'bg-secondary text-secondary-foreground border-border';
  }
};

export const UserBlock: React.FC<UserBlockProps> = ({
  user,
  cards,
  gastosRecorrentes,
  selectedCardIds,
  onToggleCard
}) => {
  const totalGastos = gastosRecorrentes.reduce((acc, g) => acc + g.valor, 0);

  return (
    <div className="min-w-[90vw] md:min-w-[600px] lg:min-w-[700px] bg-card rounded-xl border border-border/50 p-6 shadow-sm">
      {/* Header do Usuário */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
          style={{ backgroundColor: user.color }}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">{user.name}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {/* Seção de Cartões */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
          </svg>
          <h4 className="text-base font-semibold text-foreground">Cartões</h4>
          <span className="text-xs text-muted-foreground">({cards.length})</span>
        </div>

        {cards.length === 0 ? (
          <div className="p-4 bg-secondary/30 rounded-lg border border-dashed border-border text-center">
            <p className="text-sm text-muted-foreground">Nenhum cartão cadastrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cards.map((card) => {
              const isSelected = selectedCardIds.includes(card.id);
              const primaryColor = card.bank.color;
              const secondaryColor = darkenColor(primaryColor, 30);

              return (
                <div
                  key={card.id}
                  onClick={() => onToggleCard(card.id)}
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                  }}
                  className={`
                    rounded-lg p-4 text-white shadow-md border border-white/10 cursor-pointer transition-all duration-200
                    ${isSelected
                      ? 'opacity-100 scale-[1.02] ring-2 ring-offset-2 ring-offset-background ring-primary'
                      : 'opacity-80 hover:opacity-100 hover:scale-[1.01]'}
                  `}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-semibold text-sm">{card.bank.name} • {card.lastDigits}</h5>
                    {isSelected && (
                      <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                    )}
                  </div>
                  <p className="text-xs uppercase tracking-wider opacity-70 mb-1">Limite</p>
                  <p className="text-lg font-bold mb-2">R$ {card.limit.toLocaleString('pt-BR')}</p>
                  <p className="text-xs opacity-80">Disponível: R$ {card.available.toLocaleString('pt-BR')}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Seção de Gastos Recorrentes */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <h4 className="text-base font-semibold text-foreground">Gastos Recorrentes</h4>
          <span className="text-xs text-muted-foreground">({gastosRecorrentes.length})</span>
        </div>

        {gastosRecorrentes.length === 0 ? (
          <div className="p-4 bg-secondary/30 rounded-lg border border-dashed border-border text-center">
            <p className="text-sm text-muted-foreground">Nenhum gasto recorrente cadastrado</p>
          </div>
        ) : (
          <div className="space-y-2">
            {gastosRecorrentes.map((gasto) => (
              <div
                key={gasto.id}
                className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{gasto.descricao}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold border bg-blue-500/20 text-blue-300 border-blue-500/30`}>
                      {gasto.pagamento}
                    </div>
                    <div className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold border ${getCategoryStyle(gasto.categoria)}`}>
                      {gasto.categoria}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">R$ {gasto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            ))}
            {gastosRecorrentes.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Total Mensal</span>
                <span className="text-base font-bold text-primary">
                  R$ {totalGastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
