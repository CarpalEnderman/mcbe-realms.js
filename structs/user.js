const axios = require("axios").default;
const Realm = require("./realm");
const { RealmApiError, RealmApiErrorName } = require("../errors/realmAPIError");

const { REALMS_API, MC_VERSION, USER_AGENT } = require("../config.json");

/** Realm API request config builder. */
function createRealmRequestConfig(authToken) {
  return {
    baseURL: REALMS_API,
    headers: {
      "Client-Version": MC_VERSION,
      "User-Agent": USER_AGENT,
      Authorization: authToken,
    },
  };
}

function handleRealmIdError(realmId) {
  return (apiError) => {
    switch (apiError?.response?.status) {
      case 403:
        throw new RealmApiError(
          `User does not have access to the realm with id '${realmId}'.`,
          RealmApiErrorName.CannotAccessRealm,
          apiError
        );

      case 404:
        throw new RealmApiError(
          `The realm id '${realmId}' is invalid.`,
          RealmApiErrorName.InvalidRealmId,
          apiError
        );

      default:
        throw apiError;
    }
  };
}

function handleInviteCodeError(realmInviteCode) {
  return (apiError) => {
    switch (apiError?.response?.status) {
      case 403:
      case 404:
        throw new RealmApiError(
          `The realm invite code '${realmInviteCode}' is invalid.`,
          RealmApiErrorName.InvalidInvite,
          apiError
        );

      default:
        throw apiError;
    }
  };
}

/**
 * A class that is used to interact with the MCBE Realm API.
 */
module.exports = class User {
  /** The axios instance to create MCBE Realm API requests with. */
  #api;

  /**
   * Creates a new User instance from their auth token.
   *
   * If you are attempting to create a user but do not have the
   * authToken required, use the `login()` function (as recommended)
   * to create a new user instance.
   * @param {string} authToken The user's XBL3.0 token.
   */
  constructor(authToken) {
    const reqConfig = createRealmRequestConfig(authToken);
    this.#api = axios.create(reqConfig);
  }

  #newRealm(data) {
    return new Realm(this.#api, data);
  }

  /**
   * Gets information about the realm.
   * @param {string} realmId
   * @returns {Promise<Realm>}
   */
  async getRealmFromId(realmId) {
    return this.#api
      .get(`/worlds/${realmId}`)
      .then((res) => this.#newRealm(res.data))
      .catch(handleRealmIdError(realmId));
  }

  /**
   * Gets information about the realm from its invite code.
   * @param {string} realmInviteCode
   * @returns {Promise<Realm>}
   */
  async getRealmFromInvite(realmInviteCode) {
    return this.#api
      .get(`/worlds/v1/link/${realmInviteCode}`)
      .then((res) => this.#newRealm(res.data))
      .catch(handleInviteCodeError(realmInviteCode));
  }

  /**
   * Gets a realm given the realm id or invite code.
   * @param {{id?: string, inviteCode?: string}} params
   * @returns {Promise<Realm>}
   */
  async getRealm(params) {
    if (params?.id !== undefined) {
      return this.getRealmFromId(params.id);
    } else if (params?.inviteCode !== undefined) {
      return this.getRealmFromInvite(params.inviteCode);
    }
    return Promise.reject(
      new TypeError(
        `User.getRealm() params must contain one of the following: id, or inviteCode.`
      )
    );
  }

  /**
   * Gets an array realms which the user has access to.
   * @returns {Promise<Realm[]>}
   */
  async getRealms() {
    return this.#api
      .get(`/worlds`)
      .then((res) => res.data.servers.map((data) => this.#newRealm(data)));
  }

  /**
   * Gets whether the Client-Version header is up to date with the latest minecraft version(s).
   * @returns {Promise<boolean>} false is returned as you would expect, however it can also be returned if you're using a beta version of minecraft.
   */
  async getVersionCompatible() {
    return this.#api
      .get(`/mco/client/compatible`)
      .then((res) => res.data == "COMPATIBLE"); // res.data is either "COMPATIBLE" | "OUTDATED"
  }

  /**
   * Gets the amount of pending realm invites of the user.
   * @returns {Promise<number>}
   */
  async getNumberOfPendingInvites() {
    return this.#api.get(`/invites/count/pending`).then((res) => res.data);
  }

  /**
   * Gets whether the user is eligible for a free realm trial.
   * @returns {Promise<boolean>}
   */
  async getFreeTrialEligibility() {
    return this.#api
      .get(`/trial/new`)
      .then(() => true)
      .catch((err) => {
        if (err?.response?.status == 403) {
          // req errors with 403 when not eligible lol
          return false;
        } else {
          throw err;
        }
      });
  }

  /**
   * Gets an array of data about each player on each realm that the user has access to.
   * (Often returns an empty array even though the realms have players in them.)
   * @returns {Promise<{ id: number, players: any[], full: boolean }[]>}
   */
  async getPlayersInRealms() {
    return this.#api
      .get(`/activities/live/players`)
      .then((res) => res.data.servers);
  }

  /**
   * Accepts a realmInviteCode; adding that realm to your realm list
   * @param {string} realmInviteCode
   * @returns {Promise<Realm>} Returns the same information that `getRealmFromInvite()` does.
   */
  async acceptInvite(realmInviteCode) {
    return this.#api
      .post(`/invites/v1/link/accept/${realmInviteCode}`)
      .then((res) => this.#newRealm(res.data))
      .catch(handleInviteCodeError(realmInviteCode));
  }

  /**
   * Updates a realm's configuration.
   * @param {string} realmId
   */
  async updateRealmConfig(realmId, newRealmSettings) {
    return this.#api
      .post(`/worlds/${realmId}/configuration`, newRealmSettings)
      .then(() => {});
  }
};
