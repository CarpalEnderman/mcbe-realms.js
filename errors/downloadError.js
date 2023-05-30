class DownloadError extends Error {
  constructor(message, name) {
    super(message);
    this.errorName = name;
  }
}

/**
 * An object containg all the download error codes.
 * @readonly
 * @enum {string}
 */
const DownloadErrorName = {
  FileExists: "FILE_ALREADY_EXISTS",
};

module.exports = { DownloadError, DownloadErrorName };
