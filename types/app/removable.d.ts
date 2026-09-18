import type { MediaInfo } from './storage-volumes';
export type Removable = {
    filesystemHealth?: {
        identity: string;
        status: string;
        reason: string;
        repairAvailable: boolean;
        checkedAt: number;
    } | null;
    path: string;
    parent?: string;
    tran?: string;
    type: string;
    fstype?: string;
    uuid?: string;
    model?: string;
    name: string;
    size: number;
    ejectable: boolean;
    protectedReason?: string;
    media?: MediaInfo;
    ro?: boolean;
    mountpoints?: string[];
    mountSettings?: {
        point: string;
        automount: boolean;
        readOnly: boolean;
    };
};
export declare function volumeMountParams(v: Removable): {
    target: string;
    point: string;
    automount: boolean;
    readOnly: boolean;
};
export declare function deviceVolumes(device: Removable, devices: Removable[]): Removable[];
export declare function singleVolume(device: Removable, devices: Removable[]): Removable | undefined;
type RecoveryMode = 'auto' | 'repair' | 'repair-only' | 'readonly';
export declare class VolumeChoice extends Error {
    reason: string;
    repairAvailable: boolean;
    constructor(reason: string, repairAvailable: boolean);
}
export declare function recoveryKey(volume: Removable): string;
export declare function openVolume(volume: Removable, mode?: RecoveryMode): Promise<string>;
export declare function useVolumeAccess(): {
    open: (volume: Removable) => Promise<string>;
    dialog: import("react").JSX.Element;
    offer: (volume: Removable) => boolean;
};
export declare function MountVolumeButton({ volume, disabled }: {
    volume: Removable;
    disabled?: boolean;
}): import("react").JSX.Element;
export declare function EjectButton({ device, disabled, }: {
    device: {
        path: string;
        name: string;
        model?: string | null;
    };
    disabled?: boolean;
}): import("react").JSX.Element;
export declare function RemovableMenu(): import("react").JSX.Element | null;
export {};
