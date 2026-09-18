export declare function useRouteTab(base: string, choices: readonly string[], fallback: string): readonly [string, (next: string) => void];
export declare function queryValue(params: URLSearchParams, key: string, fallback: string, choices?: readonly string[]): string;
export declare function updateQuery(params: URLSearchParams, key: string, value: string, fallback: string): URLSearchParams;
export declare function useQueryValue(key: string, fallback?: string, choices?: readonly string[]): readonly [string, (value: string) => void];
