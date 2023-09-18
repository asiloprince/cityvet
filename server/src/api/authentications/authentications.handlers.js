import jwt from "jsonwebtoken";
import connectDb from "../../db/connection.js";
import {
  comparePasswords,
  saveUsersData,
  signToken,
} from "./authentications.utils.js";
import { isStringEmpty } from "../../global/utils/validator.js";

export async function handleUserRegistration(req, res) {
  const payload = req.body;

  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({ message: "Cannot connect to the database." });
  }

  try {
    // Save user data into the "users" table
    await saveUsersData(db, payload);
  } catch (error) {
    db.end();
    console.error("[DB Error]", error);
    return res.status(500).send({
      success: false,
      message: "There was an error saving your information.",
    });
  } finally {
    db.end();
  }

  return res.send({
    success: true,
    message: "User registration successful.",
  });
}

export async function handleLogin(req, res) {
  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({ message: "Cannot connect to the database." });
  }

  const sql = "SELECT userId, password FROM users WHERE email = ? LIMIT 1";
  const values = [req.body.email];

  let rows;

  try {
    [rows] = await db.query(sql, values);
  } catch (err) {
    return res.send({
      success: false,
      message: "An error occur while logging in.",
    });
  } finally {
    db.end();
  }

  const fetchedData = rows[0];

  //skip checking if there's a row (or email is present)
  //because it was already handled already by the middleware, so it will return a row

  const hashedPassword = fetchedData.password;

  let isPasswordCorrect;

  try {
    isPasswordCorrect = await comparePasswords(
      hashedPassword,
      req.body.password
    );
  } catch (err) {
    console.error("[DB Error]", err);
    return res.send({
      success: false,
      message: "Incorrect credentials. Please try again",
    });
  }

  const token = await signToken(fetchedData.userId);

  res
    .cookie("auth_token", token, {
      maxAge: 86400000, //24hrs
      httpOnly: true,
      secure: true,
    })
    .send({ success: true, message: "Login successfully" });
}

export async function handleLogout(req, res) {
  res.clearCookie("auth_token").send({
    success: true,
    message: "Logged out successfully",
  });
}

export function handleIsAuth(req, res) {
  const authCookie = req.cookies.auth_token;

  if (!isString(authCookie)) {
    return res.clearCookie("auth_token").send({
      success: false,
      message: "Authorization token is not a string.",
      isAuth: false,
    });
  }

  if (isStringEmpty(authCookie)) {
    return res.clearCookie("auth_token").send({
      success: false,
      message: "Authorization token is missing",
      isAuth: false,
    });
  }

  return res.send({
    success: true,
    message: "You are now authorized",
    isAuth: false,
  });
}
