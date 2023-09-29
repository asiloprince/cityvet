import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectDb from "../../db/connection.js";

export async function hashPassword(plainPassword) {
  try {
    return await bcrypt.hash(plainPassword, 10);
  } catch (err) {
    console.error("[Password hashing errors]:", err);
    throw new Error("Error occured in hashing password.");
  }
}

export async function saveUsersData(db, validatedPayload) {
  const sql =
    "INSERT INTO users (first_name, last_name, email, password, role_id) VALUES (?,?,?,?,?)";

  let hashedPassword;

  try {
    hashedPassword = await hashPassword(validatedPayload.password);
  } catch (err) {
    throw new Error("There was an error saving your informations", err);
  }
  const values = [
    validatedPayload.firstName,
    validatedPayload.lastName,
    validatedPayload.email,
    hashedPassword,
    validatedPayload.roleType,
  ];

  // dont end connections/ still part of transactions and also it must be handled after commit or rollback outside function ;)

  try {
    const [rows] = await db.query(sql, values);
    return rows.insertId;
  } catch (err) {
    console.error(err);
    throw new Error("There was an error saving your information");
  }
}

export async function isEmailRegistered(email) {
  const sql = "SELECT COUNT(*) as isRegistered FROM users where email = ?";

  const db = await connectDb("cityvet_program");

  if (!db) {
    throw new Error("cannot connect to the database.");
  }

  let rows;

  try {
    [rows] = await db.query(sql, email);
  } catch (err) {
    console.error(err);
    throw new Error("[Query error]", err);
  } finally {
    db.end();
  }
  if (rows[0].isRegistered <= 0) {
    return false;
  }
  return true;
}

export async function comparePasswords(hashed, plain) {
  try {
    return await bcrypt.compare(plain, hashed);
  } catch (err) {
    console.error("[Compare Password Error]", error);
    throw new Error("Error occured in comparing password");
  }
}

// generate/sign token
export async function signToken(user_id) {
  try {
    return jwt.sign({ user_id: user_id }, process.env.TOKEN_SALT, {
      expiresIn: "24h",
    });
  } catch (err) {
    console.error("[jwt signing errors]".err);
    throw new TokenExpiredError("An error occured while signing a token.");
  }
}
