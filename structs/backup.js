const Download = require("./download");

/** A class which handles worlds backups. */
module.exports = class Backup {
  #api;
  #realm;

  constructor(api, realm, data) {
    this.#api = api;
    this.#realm = realm;
    Object.assign(this, {
      id: data.backupId,
      lastModifiedDate: data.lastModifiedDate,
      size: data.size,
      metadata: {
        gameDifficulty: data.metadata.game_difficulty,
        name: data.metadata.name,
        gameServerVersion: data.metadata.game_server_version,
        enabledPacks: JSON.parse(data.metadata.enabled_packs),
        description: data.metadata.description,
        gamemode: data.metadata.game_mode,
        worldType: data.metadata.world_type,
      },
    });
  }

  /**
   * Gets the download for this backup.
   * @returns {Promise<Download>}
   */
  async getDownload() {
    return this.#api
      .get(`/archive/download/world/${this.#realm.id}/1/${this.id}`)
      .then((res) => new Download(res.data));
  }

  /** Restores the realm to this backup. */
  async restore() {
    return this.#realm.restore(this.id);
  }
};
