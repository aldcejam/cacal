import React from 'react';

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Switch = ({
    label,
    className = '',
    id,
    ...props
}: SwitchProps) => {
    const switchId = id || props.name || Math.random().toString(36).substr(2, 9);

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <label
                htmlFor={switchId}
                className="relative inline-flex items-center cursor-pointer"
            >
                <input
                    type="checkbox"
                    id={switchId}
                    className="sr-only peer"
                    {...props}
                />
                <div className="w-9 h-5 bg-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring peer-focus:ring-offset-2 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
            {label && (
                <label
                    htmlFor={switchId}
                    className="text-sm font-medium text-foreground cursor-pointer select-none"
                >
                    {label}
                </label>
            )}
        </div>
    );
};
