import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
}

export const Input = ({
    label,
    error,
    helperText,
    leftIcon,
    className = '',
    id,
    ...props
}: InputProps) => {
    const inputId = id || props.name;

    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-sm font-medium text-foreground"
                >
                    {label}
                </label>
            )}

            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                        {leftIcon}
                    </div>
                )}

                <input
                    id={inputId}
                    className={`
            flex h-10 w-full rounded-md border text-sm
            bg-input text-foreground 
            placeholder:text-muted-foreground 
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50
            transition-all
            ${leftIcon ? 'pl-10' : 'px-3'}
            ${error
                            ? 'border-destructive focus-visible:ring-destructive'
                            : 'border-border focus-visible:ring-primary'}
          `}
                    {...props}
                />
            </div>

            {helperText && !error && (
                <p className="text-[0.8rem] text-muted-foreground">{helperText}</p>
            )}

            {error && (
                <p className="text-[0.8rem] text-destructive">{error}</p>
            )}
        </div>
    );
};
