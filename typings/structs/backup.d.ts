export = Backup;
declare class Backup {
    constructor(api: any, realm: any, data: any);
    /**
     * Gets the download for this backup.
     * @returns {Promise<Download>}
     */
    getDownload(): Promise<Download>;
    /** Restores the realm to this backup. */
    restore(): Promise<any>;
    #private;
}
import Download = require("./download");
//# sourceMappingURL=backup.d.ts.map