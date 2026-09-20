import type * as Dialog from '@radix-ui/react-dialog';
import type { ButtonHTMLAttributes, ReactNode, ComponentPropsWithoutRef, ForwardRefExoticComponent, RefAttributes } from 'react';
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

type Waiting = { busy?: boolean; message?: string; hint?: string };
export declare const DialogContent: ForwardRefExoticComponent<ComponentPropsWithoutRef<typeof Dialog.Content> & Waiting & RefAttributes<HTMLDivElement>>;
export declare function WaitingOverlay(props: Omit<Waiting, 'busy'>): import("react").JSX.Element;
export declare function WaitingSurface(props: Waiting & { children: ReactNode; className?: string }): import("react").JSX.Element;
