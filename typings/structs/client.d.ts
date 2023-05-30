export = Client;
declare class Client {
    /**
     * Creates a new User instance from their auth token.
     *
     * If you are attempting to create a user but do not have the
     * authToken required, use the `login()` function (as recommended)
     * to create a new user instance.
     * @param {string} authToken The user's XBL3.0 token.
     */
    constructor(authToken: string);
    /**
     * Gets information about the realm.
     * @param {string | number} realmId
     * @returns {Promise<Realm>}
     */
    getRealmFromId(realmId: string | number): Promise<Realm>;
    /**
     * Gets information about the realm from its invite code.
     * @param {string} realmInviteCode
     * @returns {Promise<Realm>}
     */
    getRealmFromInvite(realmInviteCode: string): Promise<Realm>;
    /**
     * Gets a realm given the realm id or invite code.
     * @param {{id?: string, inviteCode?: string}} params
     * @returns {Promise<Realm>}
     */
    getRealm(params: {
        id?: string;
        inviteCode?: string;
    }): Promise<Realm>;
    /**
     * Gets an array realms which the user has access to.
     * @returns {Promise<Realm[]>}
     */
    getRealms(): Promise<Realm[]>;
    /**
     * Gets whether the Client-Version header is up to date with the latest minecraft version(s).
     * @returns {Promise<boolean>} false is returned as you would expect, however it can also be returned if you're using a beta version of minecraft.
     */
    getVersionCompatible(): Promise<boolean>;
    /**
     * Gets the amount of pending realm invites of the user.
     * @returns {Promise<number>}
     */
    getNumberOfPendingInvites(): Promise<number>;
    /**
     * Gets whether the user is eligible for a free realm trial.
     * @returns {Promise<boolean>}
     */
    getFreeTrialEligibility(): Promise<boolean>;
    /**
     * Gets an array of data about each player on each realm that the user has access to.
     * (Often returns an empty array even though the realms have players in them.)
     * @returns {Promise<{ id: number, players: any[], full: boolean }[]>}
     */
    getPlayersInRealms(): Promise<{
        id: number;
        players: any[];
        full: boolean;
    }[]>;
    /**
     * Accepts a realmInviteCode; adding that realm to your realm list
     * @param {string} realmInviteCode
     * @returns {Promise<Realm>} Returns the same information that `getRealmFromInvite()` does.
     */
    acceptInvite(realmInviteCode: string): Promise<Realm>;
    /**
     * Updates a realm's configuration.
     * @param {string} realmId
     */
    updateRealmConfig(realmId: string, newRealmSettings: any): Promise<any>;
    #private;
}
import Realm = require("./realm");
//# sourceMappingURL=client.d.ts.map