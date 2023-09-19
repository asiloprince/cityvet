import jwt from "jsonwebtoken";

/**
 * Notice: Only use this only if the auth cookie has already been verified.
 * The verification can be from the validateAuthCookie middleware
 * Or you may use the validateAndDecodeAuthToken which validates the auth token first.
 * @param {string} authCookie
 */

export function DecodeAuthToken(authCookie) {
  return jwt.decode(authCookie);
}

export function validateAndDecodeAuthToken(authCookie) {
  try {
    return jwt.verify(authCookie, process.env.TOKEN_SALT);
  } catch (err) {
    console.log(err);
    throw new Error("Cant validate and decode the auth token");
  }
}
