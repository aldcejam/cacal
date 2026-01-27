import React, { useEffect, useRef } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
            {/* Backdrop */}
            <div
                ref={overlayRef}
                onClick={handleOverlayClick}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            />

            {/* Modal Content */}
            <div
                className="
                    relative w-full max-w-4xl max-h-[90vh] 
                    bg-card/95 backdrop-blur-xl border border-white/10 
                    rounded-2xl shadow-2xl overflow-hidden flex flex-col
                    animate-in zoom-in-95 fade-in duration-300 slide-in-from-bottom-8
                "
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                    <h2 className="text-xl font-bold text-foreground tracking-tight">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};
