/**
 * Creates an instance that can be used to interact with the MCBE Realms API
 * from the user's email and password.
 * @param {string} xboxEmail
 * @param {string} xboxPassword
 * @returns {Promise<Client>} The User instance.
 */
export function login(xboxEmail: string, xboxPassword: string): Promise<Client>;
/**
 * Creates an instance that can be used to interact with the MCBE Realms API
 * from the user's xsts token.
 * @param {string} xsts
 * @returns {Client} The User instance.
 */
export function fromXSTS(xsts: string): Client;
/**
 * Creates an instance that can be used to interact with the MCBE Realms API
 * from the user's XBL3.0 token.
 * @param {string} xblToken
 * @returns {Client} The User instance.
 */
export function fromXBL(xblToken: string): Client;
import { RealmApiErrorName } from "./errors/realmApiError";
import Client = require("./structs/client");
export { RealmApiErrorName };
//# sourceMappingURL=index.d.ts.map