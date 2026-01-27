import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Textarea = ({
    label,
    error,
    helperText,
    className = '',
    id,
    ...props
}: TextareaProps) => {
    const textareaId = id || props.name;

    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label
                    htmlFor={textareaId}
                    className="text-sm font-medium text-foreground"
                >
                    {label}
                </label>
            )}

            <textarea
                id={textareaId}
                className={`
          flex min-h-[80px] w-full rounded-md border text-sm
          bg-input text-foreground 
          placeholder:text-muted-foreground 
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50
          transition-all p-3
          ${error
                        ? 'border-destructive focus-visible:ring-destructive'
                        : 'border-border focus-visible:ring-primary'}
        `}
                {...props}
            />

            {helperText && !error && (
                <p className="text-[0.8rem] text-muted-foreground">{helperText}</p>
            )}

            {error && (
                <p className="text-[0.8rem] text-destructive">{error}</p>
            )}
        </div>
    );
};
