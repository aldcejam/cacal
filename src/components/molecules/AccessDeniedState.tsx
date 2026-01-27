import React from 'react';
import { Typography } from '../atoms/Typography';

export const AccessDeniedState: React.FC = () => {
    return (
        <div className="flex-1 p-6 md:p-8 overflow-y-auto w-full flex items-center justify-center">
            <div className="text-center">
                <Typography variant="h2" weight="bold" className="text-foreground mb-2">
                    Acesso Restrito
                </Typography>
                <Typography variant="body-base" className="text-muted-foreground">
                    Apenas o usuário principal pode acessar esta página.
                </Typography>
            </div>
        </div>
    );
};
