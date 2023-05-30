export = Backup;
declare class Backup {
    constructor(api: any, realm: any, data: any);
    /** Gets the download for this backup. */
    getDownload(): Promise<any>;
    /** Restores the realm to this backup. */
    restore(): Promise<void>;
    #private;
}
//# sourceMappingURL=backup.d.ts.map