const Backup = require("./backup");
const Download = require("./download");
const { RealmApiError, RealmApiErrorName } = require("../errors/realmAPIError");

/**
 * A class that is used to interact with the realm/server portion
 * of the MCBE Realms API.
 */
module.exports = class Realm {
  /** The axios instance to create MCBE Realm API requests with. */
  #api;

  constructor(api, data) {
    this.#api = api;
    Object.assign(this, {
      id: data.id,
      remoteSubscriptionId: data.remoteSubscriptionId,
      owner: data.owner,
      ownerUUID: data.ownerUUID,
      name: data.name,
      motd: data.motd,
      defaultPermission: data.defaultPermission,
      state: data.state,
      daysLeft: data.daysLeft,
      expired: data.expired,
      expiredTrial: data.expiredTrial,
      gracePeriod: data.gracePeriod,
      worldType: data.worldType,
      players: data.players,
      maxPlayers: data.maxPlayers,
      minigameName: data.minigameName,
      minigameId: data.minigameId,
      minigameImage: data.minigameImage,
      activeSlot: data.activeSlot,
      slots: data.slots,
      member: data.member,
      clubId: data.clubId,
      subscriptionRefreshStatus: data.subscriptionRefreshStatus,
    });
  }

  /** Gets ids of the realm's listed resource packs and behaviour packs. */
  async getContentIds() {
    return this.#api
      .get(`/world/${this.id}/content`)
      .then((res) => res.data)
      .catch((err) => {
        if (err?.response?.status == 403) {
          throw new RealmApiError(
            "The user who fetched this realm is not the owner.",
            RealmApiErrorName.NotRealmOwner,
            err
          );
        } else {
          throw err;
        }
      });
  }

  /** Gets the IP address and port of the realm's dedicated server. */
  async getAddress() {
    return this.#api.get(`/server/${this.id}/join`).then((res) => res.data);
  }

  /** Gets details of the realm subscription. */
  async getSubscriptionDetails() {
    return this.#api
      .get(`/subscriptions/${this.id}/details`)
      .then((res) => res.data);
  }

  /** Gets the outgoing invites for the realm. */
  async getInvites() {
    return this.#api
      .get(`/links/v1?worldId=${this.id}`)
      .then((res) => res.data);
  }

  /** Gets an array of user XUIDs of players banned from the realm. */
  async getBlocklist() {
    return this.#api
      .get(`/worlds/${this.id}/blocklist`)
      .then((res) => res.data);
  }

  /**
   * Gets the backup with the specified id.
   * @param {string | null} backupId Returns the latest backup if omitted.
   */
  async getBackup(backupId) {
    return this.getBackups().then((backups) =>
      backupId === undefined
        ? backups[0]
        : backups.find((backup) => backup.id == backupId)
    );
  }

  /**
   * Gets an array of all available backups.
   * @returns {Backup[]}
   */
  async getBackups() {
    return this.#api
      .get(`/worlds/${this.id}/backups`)
      .then((res) =>
        res.data.backups.map((data) => new Backup(this.#api, this, data))
      );
  }

  /**
   * Gets the latest realm download.
   * @returns {Promise<Download>}
   */
  async getDownload() {
    return this.#api
      .get(`/archive/download/world/${this.id}/1/latest`)
      .then((res) => new Download(res.data));
  }

  /**
   * Restores the realm to the specified backup, or to its last available backup if omitted.
   * @param {string | null} backupId
   * @returns {"Retry again later" | "true"} Whether the action was successful or not.
   */
  async restore(backupId) {
    backupId = backupId ?? (await this.getLatestBackup()).id;
    return this.#api
      .put(
        `/worlds/${this.id}/backups?backupId=${backupId}&clientSupportsRetries`
      )
      .then((res) => res.data);
  }

  /**
   * Bans a user from the realm.
   * @param {string} userXUID
   */
  async ban(userXUID) {
    return this.#api
      .post(`/worlds/${this.id}/blocklist/${userXUID}`)
      .then(() => {});
  }

  /**
   * Updates the realm's configuration.
   * @param {string} realmInviteCode
   */
  async updateConfig(realmConfig) {
    return this.#api
      .post(`/worlds/${this.id}/configuration`, realmConfig)
      .then(() => {});
  }

  /**
   * Creates an invite code for the realm, revoking the old one.
   * @returns Information about the new invite code.
   */
  async resetInviteCode() {
    return this.#api
      .post(`/links/v1`, {
        type: "INFINITE", // TODO: TEST WHAT THIS DOES
        worldId: this.id,
      })
      .then((res) => res.data);
  }

  /**
   * Sends an in-game realm invite to every user listed.
   * @param {string[]} userXUIDs
   * @returns Returns the same information that `getRealmData()` does.
   */
  async inviteUsers(userXUIDs) {
    let invites = {};
    userXUIDs.forEach((xuid) => (invites[xuid] = "ADD"));

    return this.#api
      .put(`/invites/${this.id}/invite/update`, { invites })
      .then((res) => res.data);
  }

  /**
   * Removes the realm from the realm list for every user listed.
   * NOTE: This is not a ban.
   * @param {string[]} userXUIDs
   */
  async uninviteUsers(userXUIDs) {
    let invites = {};
    userXUIDs.forEach((xuid) => (invites[xuid] = "REMOVE"));

    return this.#api
      .put(`/invites/${this.id}/invite/update`, { invites })
      .then((res) => res.data);
  }

  /**
   * Changes the default user permission within that realm.
   * @param {string} this.id
   * @param {"VISITOR" | "MEMBER" | "OPERATOR"} permission
   */
  async updateDefaultUserPermission(permission) {
    return this.#api
      .put(`/worlds/${this.id}/defaultPermission`, {
        permission,
      })
      .then((res) => res.data);
  }

  /**
   * Changes the permission for a specific user within that realm.
   * @param {string} userXUID
   * @param {"VISITOR" | "MEMBER" | "OPERATOR"} permission
   */
  async updateUserPermission(userXUID, permission) {
    return this.#api
      .put(`/worlds/${this.id}/userPermission`, {
        permission,
        xuid: userXUID,
      })
      .then((res) => res.data);
  }

  /**
   * Replaces the active world in the realm with the slot's world.
   * @param {string} slotNum
   */
  async setActiveSlot(slotNum) {
    return this.#api
      .put(`/worlds/${this.id}/slot/${slotNum}`)
      .then((res) => res.data);
  }

  /**
   * Allows invited users to join the realm.
   * @returns {"Retry again later" | "true"} Whether the action was successful or not.
   */
  async open() {
    return this.#api.put(`/worlds/${this.id}/open`).then((res) => res.data);
  }

  /**
   * Disallows invited users from joining the realm.
   * @returns {"Retry again later" | "true"} Whether the action was successful or not.
   */
  async close() {
    return this.#api.put(`/worlds/${this.id}/close`).then((res) => res.data);
  }

  /**
   * Unbans a user from a realm.
   * @param {string} userXUID
   */
  async unban(userXUID) {
    return this.#api
      .delete(`/worlds/${this.id}/blocklist/${userXUID}`)
      .then((res) => res.data);
  }

  /** Removes the realm from every users' realms list. */
  async purgeInvites() {
    return this.#api.delete(`/invites/${this.id}`).then((res) => res.data);
  }

  /** Deletes the realm forever. */
  async delete() {
    return this.#api.delete(`/worlds/${this.id}`).then((res) => res.data);
  }
};
