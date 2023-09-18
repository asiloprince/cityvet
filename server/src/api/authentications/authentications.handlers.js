import jwt from "jsonwebtoken";
import connectDb from "../../db/connection.js";
import {
  comparePasswords,
  saveUsersData,
  signToken,
} from "./authentications.utils.js";

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
