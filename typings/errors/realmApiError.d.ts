export class RealmApiError extends Error {
    constructor(message: any, name: any, axiosError: any);
    errorName: any;
    apiResponse: {
        status: any;
        statusText: any;
        headers: any;
        data: any;
    };
}
/**
 * An object containg all the realm api error codes.
 */
export type RealmApiErrorName = string;
export namespace RealmApiErrorName {
    const CannotAccessRealm: string;
    const InvalidRealmId: string;
    const InvalidInvite: string;
    const NotRealmOwner: string;
    const RouteUnavailable: string;
    const RateLimited: string;
}
//# sourceMappingURL=realmApiError.d.ts.map