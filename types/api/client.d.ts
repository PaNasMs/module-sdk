import type { components } from './schema';
export type Identity = components['schemas']['Identity'];
export type Accounts = components['schemas']['Accounts'];
export type Metrics = components['schemas']['Metrics'];
export type Storage = components['schemas']['Storage'];
export type Device = components['schemas']['Device'];
export type Mount = components['schemas']['Mount'];
export type Preferences = components['schemas']['Preferences'];
export declare class APIError extends Error {
    status: number;
    constructor(status: number, message: string);
}
export declare function request<T>(path: string, method?: string, body?: unknown): Promise<T>;
