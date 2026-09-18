export type Job = {
    id: string;
    user: string;
    action: string;
    target: string;
    status: string;
    stage: string;
    created: string;
    updated: string;
    result: Record<string, unknown>;
};
export type Field = {
    key: string;
    label: string;
    type?: 'number' | 'password' | 'check' | 'devices' | 'groups' | 'users' | 'device' | 'select';
    options?: string[];
    value?: unknown;
};
type Operation = {
    label: string;
    fields: Field[];
};
export declare const operations: Record<string, Operation>;
export declare function managed<T>(view: string, body?: unknown, target?: string): Promise<T>;
type OperationContext = {
    key: string;
    label: string;
    value: string;
}[];
export type Choice = {
    id: string;
    label: string;
    disabled?: boolean;
};
type OperationProps = {
    actions: string[];
    initial?: Record<string, unknown>;
    label?: string;
    tooltip?: string;
    icon?: string;
    disabled?: boolean;
    context?: OperationContext;
    candidatesFor?: string;
    fields?: Field[];
    choices?: Record<string, Choice[]>;
    description?: string;
    autoReview?: boolean;
};
export declare function OperationButton({ actions, initial, label, tooltip, icon, disabled, context, candidatesFor, fields, choices, description, autoReview, }: OperationProps): import("react").JSX.Element;
export declare function JobsList(): import("react").JSX.Element;
export {};
