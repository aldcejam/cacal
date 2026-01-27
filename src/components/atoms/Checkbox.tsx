import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Checkbox = ({
    label,
    className = '',
    id,
    ...props
}: CheckboxProps) => {
    const checkboxId = id || props.name || Math.random().toString(36).substr(2, 9);

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="relative flex items-center">
                <input
                    type="checkbox"
                    id={checkboxId}
                    className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none checked:bg-primary checked:text-primary-foreground"
                    {...props}
                />
                <svg
                    className="absolute left-[1px] top-[1px] hidden h-3.5 w-3.5 text-primary-foreground peer-checked:block pointer-events-none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            </div>
            {label && (
                <label
                    htmlFor={checkboxId}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground cursor-pointer select-none"
                >
                    {label}
                </label>
            )}
        </div>
    );
};
