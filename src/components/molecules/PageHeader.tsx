import React from 'react';
import { Typography } from '../atoms/Typography';

interface PageHeaderProps {
    title: string;
    description?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => (
    <header className="flex items-center justify-between mb-8 pt-2 md:pt-0 pl-12 md:pl-0">
        <div>
            <Typography variant="h2" weight="bold" className="text-foreground tracking-tight">
                {title}
            </Typography>
            {description && (
                <Typography variant="body-sm" className="text-muted-foreground hidden sm:block">
                    {description}
                </Typography>
            )}
        </div>
    </header>
);
