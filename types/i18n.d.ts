export type Dictionary = Record<string, string>
export type Translations = { en: Dictionary; ru?: Dictionary; uk?: Dictionary }
export declare function registerTranslations(namespace: string, dictionaries: Translations): void
export declare function translator(namespace: string): (key: string, values?: Record<string, unknown>) => string
export declare function locale(): string
export declare function registerServerMessages(namespace: string, messages: {key:string;en:string;ru?:string}[]): void
