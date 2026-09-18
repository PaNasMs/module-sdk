export type Tile = {
    id: string;
    kind: string;
    x: number;
    y: number;
};
export declare const newID: () => string;
export declare const screen: () => "wide" | "medium" | "mobile";
export declare const columns: (mode: string) => 8 | 2 | 6;
export declare const apps: () => (import("./module-registry").ModuleDefinition | {
    id: string;
    title: string;
    path: string;
    icon: string;
})[];
export declare const shortcutKind: (id: string) => string;
export declare function registerShortcuts(): void;
export declare function free(tile: Tile, all: Tile[], cols: number): boolean;
export declare function place(kind: string, all: Tile[], cols: number): {
    id: string;
    kind: string;
    x: number;
    y: number;
} | undefined;
export declare function defaults(cols: number): Tile[];
export declare function toggleShortcut(layouts: Record<string, Tile[]> | undefined, id: string, show: boolean): {
    [x: string]: Tile[];
};
export declare function reorder(ids: string[], source: string, target: string): string[];
