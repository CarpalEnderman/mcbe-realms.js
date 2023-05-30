const crypto = require("crypto");
const axios = require("axios").default;
const decompress = require("decompress");
const path = require("path");
const fs = require("fs");

const { DownloadError, DownloadErrorName } = require("../errors/downloadError");

const { TEMP_FILE_DOWNLOAD_FOLDER } = require("../config.json");
const DEFAULT_FILE_DOWNLOAD_PATH = require("downloads-folder")();
const TEMP_FILE_DOWNLOAD_PATH = path.join(__dirname, TEMP_FILE_DOWNLOAD_FOLDER);

// Create temp path if it doesnt exist
if (!fs.existsSync(TEMP_FILE_DOWNLOAD_PATH))
  fs.mkdirSync(TEMP_FILE_DOWNLOAD_PATH);

/** Generates a random filename. */
function newid() {
  return crypto.randomBytes(16).toString("hex");
}

/**
 * Streams the data from a url into a file.
 * @param {string} url
 * @param axiosOptions
 * @param {fs.WriteStream} outfile
 */
async function downloadUrl(url, axiosOptions, outfile) {
  const res = await axios.get(url, axiosOptions);
  return new Promise((resolve, reject) => {
    res.data.pipe(outfile);
    let error;

    outfile.on("error", (err) => {
      error = err;
      outfile.close();
      reject(err);
    });

    outfile.on("finish", () => {
      outfile.close();
    });

    outfile.on("close", () => {
      if (!error) {
        resolve();
      }
    });
  });
}

/** A class which handles the downloading of backup files. */
module.exports = class Download {
  constructor(data) {
    Object.assign(this, {
      url: data.downloadUrl,
      token: data.token,
      size: data.size,
    });
  }

  /**
   * Downloads the backup as the decompressed world folder.
   * @param {{ directory?: string, foldername?: string, overwriteExisting?: boolean }} options
   * @returns {Promise<string>} The path to the downloaded folder.
   */
  async getWorldFolder(options) {
    const foldername = options?.foldername ?? `download-${newid()}`;
    const dir = options?.directory ?? DEFAULT_FILE_DOWNLOAD_PATH;
    const folderpath = path.join(dir, foldername);
    const overwriteExisting = options?.overwriteExisting ?? false;

    if (fs.existsSync(folderpath)) {
      if (overwriteExisting) {
        try {
          fs.rmSync(folderpath, { recursive: true, force: true });
        } catch (err) {
          return Promise.reject(err);
        }
      } else {
        return Promise.reject(
          new DownloadError(
            `A folder already exists with the name '${foldername}' in ${dir}`,
            DownloadErrorName.FileExists
          )
        );
      }
    }

    try {
      const tempfilepath = await this.getRaw({
        filename: `temp-${foldername}`,
        directory: TEMP_FILE_DOWNLOAD_PATH,
        overwriteExisting: true,
      });
      await decompress(tempfilepath, folderpath);
      fs.unlinkSync(tempfilepath);
    } catch (err) {
      return Promise.reject(err);
    }

    return Promise.resolve(folderpath);
  }

  /**
   * Downloads the backup as the raw, compressed, .mcworld file.
   * @param {{ directory?: string, filename?: string, overwriteExisting?: boolean }} options
   * @returns {Promise<string>} The path to the downloaded file.
   */
  async getRaw(options) {
    const filename = `${options?.filename ?? `download-${newid()}`}.mcworld`;
    const dir = options?.directory ?? DEFAULT_FILE_DOWNLOAD_PATH;
    const filepath = path.join(dir, filename);
    const overwriteExisting = options?.overwriteExisting ?? false;

    if (fs.existsSync(filepath)) {
      if (overwriteExisting) {
        try {
          fs.unlinkSync(filepath);
        } catch (err) {
          return Promise.reject(err);
        }
      } else {
        return Promise.reject(
          new DownloadError(
            `A file already exists with the name '${filename}' in ${dir}`,
            DownloadErrorName.FileExists
          )
        );
      }
    }

    const reqConfig = {
      responseType: "stream",
      headers: { Authorization: `Bearer ${this.token}` },
    };

    let file = fs.createWriteStream(filepath);
    return downloadUrl(this.url, reqConfig, file).then(() => filepath);
  }
};
