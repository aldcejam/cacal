import React from 'react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helperText?: string;
    options: SelectOption[];
    leftIcon?: React.ReactNode;
}

export const Select = ({
    label,
    error,
    helperText,
    options,
    leftIcon,
    className = '',
    id,
    ...props
}: SelectProps) => {
    const selectId = id || props.name;

    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label
                    htmlFor={selectId}
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

                <select
                    id={selectId}
                    className={`
            flex h-10 w-full rounded-md border text-sm
            bg-input text-foreground 
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50
            transition-all appearance-none
            ${leftIcon ? 'pl-10' : 'px-3'}
            pr-8
            ${error
                            ? 'border-destructive focus-visible:ring-destructive'
                            : 'border-border focus-visible:ring-primary'}
          `}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </div>
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
