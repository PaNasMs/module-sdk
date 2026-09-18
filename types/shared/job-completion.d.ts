type Completion = {
    status: string;
    stage: string;
    result?: {
        error?: unknown;
    };
};
export declare function waitForJob(read: () => Promise<Completion | undefined>, pause?: () => Promise<void>, attempts?: number): Promise<void>;
export {};
