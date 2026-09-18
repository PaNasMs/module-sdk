import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
export declare function cn(...v: Parameters<typeof clsx>): string;
export declare function Icon({ path, size }: {
    path: string;
    size?: number;
}): import("react").JSX.Element;
export declare function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>): import("react").JSX.Element;
export declare function Notice({ children, error }: {
    children: ReactNode;
    error?: boolean;
}): import("react").JSX.Element;
export declare function bytes(n: number): string;
