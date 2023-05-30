export = Realm;
declare class Realm {
    constructor(api: any, data: any);
    /** Gets ids of the realm's listed resource packs and behaviour packs. */
    getContentIds(): Promise<any>;
    /** Gets the IP address and port of the realm's dedicated server. */
    getAddress(): Promise<any>;
    /** Gets details of the realm subscription. */
    getSubscriptionDetails(): Promise<any>;
    /** Gets the outgoing invites for the realm. */
    getInvites(): Promise<any>;
    /** Gets an array of user XUIDs of players banned from the realm. */
    getBlocklist(): Promise<any>;
    /**
     * Gets the backup with the specified id.
     * @param {string | null} backupId Returns the latest backup if omitted.
     */
    getBackup(backupId: string | null): Promise<any>;
    /**
     * Gets an array of all available backups.
     * @returns {Backup[]}
     */
    getBackups(): Backup[];
    /**
     * Gets the latest realm download.
     * @returns {Promise<Download>}
     */
    getDownload(): Promise<Download>;
    /**
     * Restores the realm to the specified backup, or to its last available backup if omitted.
     * @param {string | null} backupId
     * @returns {"Retry again later" | "true"} Whether the action was successful or not.
     */
    restore(backupId: string | null): "Retry again later" | "true";
    /**
     * Bans a user from the realm.
     * @param {string} userXUID
     */
    ban(userXUID: string): Promise<any>;
    /**
     * Updates the realm's configuration.
     * @param {string} realmInviteCode
     */
    updateConfig(realmConfig: any): Promise<any>;
    /**
     * Creates an invite code for the realm, revoking the old one.
     * @returns Information about the new invite code.
     */
    resetInviteCode(): Promise<any>;
    /**
     * Sends an in-game realm invite to every user listed.
     * @param {string[]} userXUIDs
     * @returns Returns the same information that `getRealmData()` does.
     */
    inviteUsers(userXUIDs: string[]): Promise<any>;
    /**
     * Removes the realm from the realm list for every user listed.
     * NOTE: This is not a ban.
     * @param {string[]} userXUIDs
     */
    uninviteUsers(userXUIDs: string[]): Promise<any>;
    /**
     * Changes the default user permission within that realm.
     * @param {string} this.id
     * @param {"VISITOR" | "MEMBER" | "OPERATOR"} permission
     */
    updateDefaultUserPermission(permission: "VISITOR" | "MEMBER" | "OPERATOR"): Promise<any>;
    /**
     * Changes the permission for a specific user within that realm.
     * @param {string} userXUID
     * @param {"VISITOR" | "MEMBER" | "OPERATOR"} permission
     */
    updateUserPermission(userXUID: string, permission: "VISITOR" | "MEMBER" | "OPERATOR"): Promise<any>;
    /**
     * Replaces the active world in the realm with the slot's world.
     * @param {string} slotNum
     */
    setActiveSlot(slotNum: string): Promise<any>;
    /**
     * Allows invited users to join the realm.
     * @returns {"Retry again later" | "true"} Whether the action was successful or not.
     */
    open(): "Retry again later" | "true";
    /**
     * Disallows invited users from joining the realm.
     * @returns {"Retry again later" | "true"} Whether the action was successful or not.
     */
    close(): "Retry again later" | "true";
    /**
     * Unbans a user from a realm.
     * @param {string} userXUID
     */
    unban(userXUID: string): Promise<any>;
    /** Removes the realm from every users' realms list. */
    purgeInvites(): Promise<any>;
    /** Deletes the realm forever. */
    delete(): Promise<any>;
    #private;
}
import Backup = require("./backup");
import Download = require("./download");
//# sourceMappingURL=realm.d.ts.map