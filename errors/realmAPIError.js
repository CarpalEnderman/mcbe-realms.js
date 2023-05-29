class RealmApiError extends Error {
  constructor(message, name, axiosError) {
    super(message);
    this.name = name;
    this.apiResponse = {
      status: axiosError.response.status,
      statusText: axiosError.response.statusText,
      headers: axiosError.response.headers,
      data: axiosError.response.data,
    };
  }
}

/** An object containg all the api error codes. */
const RealmApiErrorName = {
  CannotAccessRealm: "CANNOT_ACCESS_REALM",
  InvalidRealmId: "INVALID_REALM_ID",
  InvalidInvite: "INVALID_INVITE",
  NotRealmOwner: "USER_IS_NOT_REALM_OWNER",
};

module.exports = { RealmApiError, RealmApiErrorName };
