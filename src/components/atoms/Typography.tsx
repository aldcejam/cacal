import React from 'react';

type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'body-lg' | 'body-base' | 'body-sm' | 'body-xs';
type Weight = 'regular' | 'medium' | 'semibold' | 'bold';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
    variant?: Variant;
    weight?: Weight;
    children: React.ReactNode;
    as?: React.ElementType;
}

export const Typography = ({
    variant = 'body-base',
    weight,
    children,
    className = '',
    as,
    ...props
}: TypographyProps) => {
    const styles = {
        'h1': 'text-4xl leading-tight tracking-tight',
        'h2': 'text-3xl leading-snug tracking-tight',
        'h3': 'text-2xl leading-snug',
        'h4': 'text-xl leading-snug',
        'body-lg': 'text-lg leading-relaxed',
        'body-base': 'text-base leading-relaxed',
        'body-sm': 'text-sm leading-relaxed',
        'body-xs': 'text-xs leading-relaxed',
    };

    const weights = {
        'regular': 'font-normal',
        'medium': 'font-medium',
        'semibold': 'font-semibold',
        'bold': 'font-bold',
    };

    // Default Element mapping
    const Component = (as || (variant.startsWith('h') ? variant : 'p')) as React.ElementType;

    // Default weight logic if not provided
    const computedWeight = weight ? weights[weight] : (variant.startsWith('h') ? 'font-bold' : 'font-normal');

    return (
        <Component
            className={`${styles[variant]} ${computedWeight} ${className}`}
            {...props}
        >
            {children}
        </Component>
    );
};
