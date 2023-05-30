export = Download;
declare class Download {
    constructor(data: any);
    /**
     * Downloads the backup as the decompressed world folder.
     * @param {{ directory?: string, foldername?: string }} options
     * @returns {Promise<string>} The path to the downloaded folder.
     */
    getWorldFolder(options: {
        directory?: string;
        foldername?: string;
    }): Promise<string>;
    /**
     * Downloads the backup as the raw, compressed, .mcworld file.
     * @param {{ directory?: string, filename?: string }} options
     * @returns {Promise<string>} The path to the downloaded file.
     */
    getRaw(options: {
        directory?: string;
        filename?: string;
    }): Promise<string>;
}
//# sourceMappingURL=download.d.ts.map