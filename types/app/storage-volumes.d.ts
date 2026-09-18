import type { Device, Mount } from '../api/client';
export type MediaInfo = {
    kind: string;
    readOnly: boolean;
    name?: string;
    manufacturerId?: string;
    manufactured?: string;
    revision?: string;
    usbId?: string;
    usbVersion?: string;
    linkMbps?: string;
    manufacturer?: string;
};
export type StorageOptions = {
    sleepSettings?: {
        minutes: number;
    } | null;
    sleepStatus?: Record<string, {
        device: string;
        minutes: number | null;
        status: string;
        error?: string;
    }>;
    devices: {
        smartSchedules?: {
            test: string;
            weekday: number;
            hour: number;
            weeks: number;
            startDate?: string;
        }[];
        smartSchedule?: {
            test: string;
            weekday: number;
            hour: number;
        } | null;
        media?: MediaInfo;
        path: string;
        kname: string;
        mountSettings?: {
            point: string;
            automount: boolean;
            readOnly: boolean;
        };
        protectedReason: string;
        busyReason: string;
        raidReason: string;
        raidEligible: boolean;
        ejectable: boolean;
    }[];
    formats: string[];
};
export declare function StorageVolumes({ devices, mounts, options, arrayNames, }: {
    devices: Device[];
    mounts: Mount[];
    options?: StorageOptions;
    arrayNames?: Record<string, string>;
}): import("react").JSX.Element;
