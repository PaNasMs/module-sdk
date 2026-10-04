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

export declare function CloseIcon(props: ComponentPropsWithoutRef<'button'> & { ref?: import('react').Ref<HTMLButtonElement> }): import('react').JSX.Element;

type Waiting = { busy?: boolean; message?: string; hint?: string };
export declare const DialogContent: ForwardRefExoticComponent<ComponentPropsWithoutRef<typeof Dialog.Content> & Waiting & { header?: ReactNode; footer?: ReactNode; variant?: 'compact' | 'form' | 'details'; intent?: 'edit' | 'inspect' | 'confirm'; dirty?: boolean } & RefAttributes<HTMLDivElement>>;
export declare function WaitingOverlay(props: Omit<Waiting, 'busy'>): import("react").JSX.Element;
export declare function WaitingSurface(props: Waiting & { children: ReactNode; className?: string }): import("react").JSX.Element;

export declare function FolderPicker(props: { onChoose: (path: string) => void; policy?: 'share' | 'home' | 'mount' | 'data'; newFolder?: boolean; defaultName?: string; initialPath?: string; hint?: string }): import('react').JSX.Element;

/** One entry of the section navigation: a part of a section or an object. */
export type SectionItem = {
    id: string;
    title: string;
    icon?: string;
    /** Second line for an object: its state in words. */
    note?: string;
    /** State dot for an object; always paired with `note`. */
    tone?: 'ok' | 'warn' | 'danger' | 'busy' | 'idle';
    count?: number | string;
    /** Heading shown above the first item of each group. */
    group?: string;
    /** Route for link navigation. Without it the item is a tab of the surrounding Tabs.Root. */
    to?: string;
};
/**
 * The one navigation between the parts of a section: a rail from 1024px and a
 * switcher that opens a sheet below it. Put it first inside an element with
 * class `section-layout`. Tab items need a surrounding Tabs.Root; items with
 * `to` are route links; `tabs={false}` makes plain buttons that call `onChange`.
 */
export declare function SectionNav(props: { label: string; items: SectionItem[]; value: string; onChange?: (id: string) => void; objects?: boolean; tabs?: boolean; footer?: ReactNode }): import('react').JSX.Element;
/** A group of rarely used content on the same page; use it instead of tabs nested in a section. */
export declare function Disclosure(props: { title: string; hint?: string; open: boolean; onOpenChange: (open: boolean) => void; children: ReactNode }): import('react').JSX.Element;
