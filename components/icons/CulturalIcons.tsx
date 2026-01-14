import React from 'react';

export const SeljukStar = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        {/* Abstract representation of an 8-pointed Seljuk star */}
        <path d="M50 0 L61 35 L97 35 L68 57 L79 91 L50 69 L21 91 L32 57 L3 35 L39 35 Z" />
    </svg>
);

export const TulipMotif = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Stylized Ottoman Tulip */}
        <path d="M12 22C12 22 4 18 4 8C4 5 6 2 12 2C18 2 20 5 20 8C20 18 12 22 12 22Z" />
        <path d="M12 22V12" />
        <path d="M12 2C12 2 8 5 8 8C8 10 9 11 12 11C15 11 16 10 16 8C16 5 12 2 12 2Z" />
    </svg>
);

export const ScrollText = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Stylized Ottoman Scroll/Firman */}
        <path d="M15 12h-5" />
        <path d="M15 8h-5" />
        <path d="M19 17V5a2 2 0 0 0-2-2H4" />
        <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v2a2 2 0 0 0 2 2z" />
    </svg>
);

export const GeometricPattern = ({ className, opacity = 0.05 }: { className?: string, opacity?: number }) => (
    <div
        className={`absolute inset-0 pointer-events-none ${className}`}
        style={{
            opacity: opacity,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23007E80' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
        }}
    />
);
