const { authenticate } = require("@xboxreplay/xboxlive-auth");
const User = require("./structs/user");
const { REALMS_API } = require("./config.json");

/**
 * Creates an instance that can be used to interact with the MCBE Realms API
 * from the user's email and password.
 * @param {string} xboxEmail
 * @param {string} xboxPassword
 * @returns {Promise<User>} The User instance.
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
 * @returns {User} The User instance.
 */
function fromXSTS(xsts) {
  return fromXBL(`XBL3.0 x=${xsts.user_hash};${xsts.xsts_token}`);
}

/**
 * Creates an instance that can be used to interact with the MCBE Realms API
 * from the user's XBL3.0 token.
 * @param {string} xblToken
 * @returns {User} The User instance.
 */
function fromXBL(xblToken) {
  return new User(xblToken);
}

const { RealmApiErrorCode } = require("./errors/realmAPIError");

module.exports = {
  login,
  fromXSTS,
  fromXBL,
  RealmApiErrorCode,
};
