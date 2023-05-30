class RealmApiError extends Error {
  constructor(message, name, axiosError) {
    super(message);
    this.errorName = name;
    this.apiResponse = {
      status: axiosError.response.status,
      statusText: axiosError.response.statusText,
      headers: axiosError.response.headers,
      data: axiosError.response.data,
    };
  }
}

/**
 * An object containg all the realm api error codes.
 * @readonly
 * @enum {string}
 */
const RealmApiErrorName = {
  CannotAccessRealm: "CANNOT_ACCESS_REALM",
  InvalidRealmId: "INVALID_REALM_ID",
  InvalidInvite: "INVALID_INVITE",
  NotRealmOwner: "USER_IS_NOT_REALM_OWNER",
  RouteUnavailable: "ROUTE_UNAVAILABLE",
  RateLimited: "RATE_LIMITED",
};

module.exports = { RealmApiError, RealmApiErrorName };
