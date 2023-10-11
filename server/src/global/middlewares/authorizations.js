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

// member authorization
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

// account role-based authorization
export function authorizeRoles(roles) {
  return async function (req, res, next) {
    if (!req.cookies.auth_token) {
      return res.status(401).send({
        success: false,
        message: "Auth token is missing",
      });
    }

    const decodeToken = DecodeAuthToken(req.cookies.auth_token);

    if (!decodeToken) {
      return res
        .status(401)
        .send({ success: false, message: "Invaid auth token" });
    }

    const user_id = decodeToken.user_id;

    const sql =
      "SELECT role_name FROM users INNER JOIN roles on users.role_id = roles.role_id WHERE user_id =?";

    const values = [user_id];

    const db = await connectDb("cityvet_program");
    if (!db) {
      return res.status(500).send("Cannot connect to the database.");
    }

    let rows;

    try {
      [rows] = await db.query(sql, values);
    } catch (err) {
      console.error("[DB Error", err);
      return res.staus(500).send({
        success: false,
        message: "An error occured while fetchinf your information.",
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

    // Check if the user has one of the required roles
    if (roles.includes(rows[0].role_name)) {
      next();
    } else {
      return res.status(401).send({
        success: false,
        message: "Not authorized. You do not have the required role.",
      });
    }
  };
}
