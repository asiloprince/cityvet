import jwt from "jsonwebtoken";
import connectDb from "../../db/connection.js";
import { DecodeAuthToken } from "../utils/jwt.js";
import { isArrayEmpty, isString, isStringEmpty } from "../utils/validator.js";

export function validateAuthCookie(req, res, next) {
  const authToken = req.cookies.auth_token;

  if (
    authToken === undefined ||
    authToken === null ||
    isStringEmpty(authToken)
  ) {
    return res
      .status(401)
      .send({ success: false, message: "Auth token is missing." });
  }

  if (!isString(authToken)) {
    return res
      .status(401)
      .send({ success: false, message: "Auth token must be string. :<" });
  }

  try {
    jwt.verify(authToken, process.env.TOKEN_SALT);
  } catch (err) {
    return res
      .clearCookie("auth_token")
      .status(401)
      .send({ success: false, message: "Invalid cookie," + err.message });
  }
  next();
}

export async function isVetOfficeMember(req, res, next) {
  const user_id = DecodeAuthToken(req.cookies.auth_token).user_id;

  const sql = "SELECT 1 FROM users WHERE user_id = ?";
  const values = [user_id];

  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({ message: "Cannot connect to the databse." });
  }

  let rows;

  try {
    [rows] = await db.query(sql, values);
  } catch (err) {
    console.error("[DB Error]", err);
    return res.status(500).send({
      success: false,
      message: "An error occured while fetching your information",
    });
  } finally {
    db.end();
  }

  if (isArrayEmpty(rows)) {
    return res.status(401).send({
      success: false,
      message: "Access restricted to veterinary team members only.",
    });
  }
  next();
}
