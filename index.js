/** @module mcbe-realms */

const { authenticate } = require("@xboxreplay/xboxlive-auth");
const Client = require("./structs/client");
const { RealmApiErrorName } = require("./errors/realmApiError");
const { REALMS_API } = require("./config.json");

/**
 * Creates an instance that can be used to interact with the MCBE Realms API
 * from the user's email and password.
 * @param {string} xboxEmail
 * @param {string} xboxPassword
 * @returns {Promise<Client>} The User instance.
 */
async function login(xboxEmail, xboxPassword) {
  return authenticate(xboxEmail, xboxPassword, {
    XSTSRelyingParty: `${REALMS_API}/`,
  }).then(fromXSTS);
}

/**
 * Creates an instance that can be used to interact with the MCBE Realms API
 * from the user's xsts token.
 * @param {string} xsts
 * @returns {Client} The User instance.
 */
function fromXSTS(xsts) {
  return fromXBL(`XBL3.0 x=${xsts.user_hash};${xsts.xsts_token}`);
}

/**
 * Creates an instance that can be used to interact with the MCBE Realms API
 * from the user's XBL3.0 token.
 * @param {string} xblToken
 * @returns {Client} The User instance.
 */
function fromXBL(xblToken) {
  return new Client(xblToken);
}

module.exports = {
  login,
  fromXSTS,
  fromXBL,
  RealmApiErrorName,
};
