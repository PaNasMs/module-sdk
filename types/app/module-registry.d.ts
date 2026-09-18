import type { ComponentType } from 'react';
export type WidgetDefinition = {
    title: string;
    width: number;
    height: number;
    module: string;
    href?: string;
    /**
     * Отрисовку виджета даёт сам модуль. Оболочка рисует только рамку и заголовок,
     * поэтому новый виджет не требует правок рабочего стола.
     */
    component?: ComponentType<{
        kind: string;
    }>;
    icon?: string;
    /** Показывать ссылку на страницу истории показателей в заголовке. */
    history?: boolean;
    /** Низкому виджету заголовок не по росту: модуль рисует карточку целиком сам. */
    bare?: boolean;
};
export type SettingsSection = {
    id: string;
    title: string;
    icon: string;
    component: ComponentType;
    routes?: string[];
};
export type ModuleDefinition = {
    id: string;
    title: string;
    path: string;
    routes?: string[];
    icon: string;
    component: ComponentType;
    settings?: SettingsSection[];
    widgets?: Record<string, WidgetDefinition>;
};
export declare const widgets: Record<string, WidgetDefinition>;
export declare function registerModule(module: ModuleDefinition): void;
export declare const modules: () => ModuleDefinition[];
export declare const settingsSections: () => SettingsSection[];
/**
 * Источник виджетов, состав которых известен только во время работы: например по
 * виджету температуры на каждый найденный диск. Это React-хук; список источников
 * фиксируется при импорте модулей, поэтому порядок вызова хуков стабилен.
 */
export type WidgetSource = () => Record<string, WidgetDefinition>;
export declare function registerWidgetSource(source: WidgetSource): void;
export declare function useModuleWidgets(): Record<string, WidgetDefinition>;
