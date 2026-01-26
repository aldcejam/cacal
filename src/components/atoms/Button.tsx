import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export const Button = ({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
        primary: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    };

    const sizes = {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 py-2 text-sm",
        lg: "h-12 px-6 text-base",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
