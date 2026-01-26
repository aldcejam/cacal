import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children: React.ReactNode;
}

export const Button = ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    leftIcon,
    rightIcon,
    className = '',
    children,
    ...props
}: ButtonProps) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95";

    const variants = {
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg shadow-primary/20 border border-transparent",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover border border-border",
        outline: "border border-border bg-transparent hover:bg-secondary/50 text-foreground",
        ghost: "hover:bg-accent/10 hover:text-accent border border-transparent",
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm border border-transparent",
    };

    const sizes = {
        sm: "h-8 px-3 text-xs gap-1.5",
        md: "h-10 px-4 py-2 text-sm gap-2",
        lg: "h-12 px-6 text-base gap-2.5",
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
            {...props}
        >
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </button>
    );
};
