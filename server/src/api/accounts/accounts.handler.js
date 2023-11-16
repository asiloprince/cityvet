import connectDb from "../../db/connection.js";
import { DecodeAuthToken } from "../../global/utils/jwt.js";
import {
  comparePasswords,
  hashPassword,
} from "../authentications/authentications.utils.js";

export async function handleGetRole(req, res) {
  const userID = DecodeAuthToken(req.cookies.auth_token).user_id;

  if (!userID) {
    console.error("Invalid auth token");
    return res.status(401).send({ message: "Invalid auth token." });
  }

  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({ message: "Cannot connect to the database." });
  }

  const sql =
    "SELECT role_name AS role FROM roles INNER JOIN users ON roles.role_id = users.role_id WHERE users.user_id = ?;";
  const value = [userID];

  let rows;

  try {
    [rows] = await db.query(sql, value);
  } catch (error) {
    console.error("[DB Error]", error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while getting role.",
    });
  } finally {
    db.end();
  }

  const fetchedData = rows[0];

  return res.send({
    success: true,
    message: "Success fetching role.",
    role: fetchedData.role,
  });
}

export async function handleGetUserInfo(req, res) {
  const userID = DecodeAuthToken(req.cookies.auth_token).user_id;

  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({ message: "Cannot connect to the databse." });
  }

  const sql =
    "SELECT users.user_id, first_name, last_name, email, password, registration_date, roles.role_name FROM users INNER JOIN roles ON users.role_id = roles.role_id WHERE users.user_id = ?;";

  const values = [userID];

  let rows;

  try {
    [rows] = await db.query(sql, values);
  } catch (err) {
    console.error("DB Errors", err);
    return res.status(500).send({
      success: false,
      message: "Failed to fetch user details.",
    });
  } finally {
    db.end();
  }

  // Do not validate if the rows will return any value from the users table because IT WILL.
  // The user_id in auth_token has already been validated by the middleware isVetOfficeMember

  res.send({
    success: true,
    message: "Success feching user information",
    data: rows[0],
  });
}

export async function handleGetUsersList(req, res) {
  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({ message: "Cannot connect to the database." });
  }

  const sql =
    "SELECT users.user_id, first_name, last_name, email, registration_date, roles.role_name FROM users INNER JOIN roles ON users.role_id = roles.role_id WHERE roles.role_name IN ('Program Manager', 'Coordinator', 'Admin');";

  let rows;

  try {
    [rows] = await db.query(sql);
  } catch (err) {
    console.error("DB Errors", err);
    return res.status(500).send({
      success: false,
      message: "Failed to fetch users list.",
    });
  } finally {
    db.end();
  }

  res.send({
    success: true,
    message: "Success fetching users list",
    data: rows,
  });
}

// update user info
export async function handleUpdateUserInfo(req, res) {
  const userID = DecodeAuthToken(req.cookies.auth_token).user_id;
  const { first_name, last_name, email, password, new_password } = req.body;

  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({ message: "Cannot connect to the database." });
  }

  // check if the provided password is correct
  if (new_password) {
    let [rows] = await db.query(
      "SELECT password FROM users WHERE user_id = ?",
      [userID]
    );

    if (rows.length === 0) {
      return res.status(404).send({ message: "User not found." });
    }

    const isPasswordCorrect = await comparePasswords(
      rows[0].password,
      password
    );

    if (!isPasswordCorrect) {
      return res.status(403).send({ message: "Incorrect password." });
    }
  }

  // If the password is correct, we can proceed to update the user data
  let sql = "UPDATE users SET ";
  let updates = [];
  let values = [];

  if (first_name) {
    updates.push("first_name = ?");
    values.push(first_name);
  }

  if (last_name) {
    updates.push("last_name = ?");
    values.push(last_name);
  }

  if (email) {
    updates.push("email = ?");
    values.push(email);
  }

  if (new_password) {
    const hashedPassword = await hashPassword(new_password);
    updates.push("password = ?");
    values.push(hashedPassword);
  }

  sql += updates.join(", ");
  sql += " WHERE user_id = ?";

  values.push(userID);

  try {
    await db.query(sql, values);
  } catch (err) {
    console.error("DB Errors", err);
    return res.status(500).send({
      success: false,
      message: "Failed to update user details.",
    });
  } finally {
    db.end();
  }

  res.send({
    success: true,
    message: "User data updated successfully.",
  });
}

// update roles / permission
export async function handleUpdateUserRole(req, res) {
  const user_id = req.params.user_id;
  const { role_id } = req.body;

  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({ message: "Cannot connect to the database." });
  }

  const sql = "UPDATE users SET role_id = ? WHERE user_id = ?";
  const values = [role_id, user_id];

  try {
    await db.query(sql, values);
  } catch (err) {
    console.error("DB Errors", err);
    return res.status(500).send({
      success: false,
      message: "Failed to update user role.",
    });
  } finally {
    db.end();
  }

  res.send({
    success: true,
    message: "User role updated successfully.",
  });
}

// delete users account
export async function handleDeleteUserAccount(req, res) {
  const userID = DecodeAuthToken(req.cookies.auth_token).user_id;

  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({ message: "Cannot connect to the database." });
  }

  const sql = "DELETE FROM users WHERE user_id = ?;";
  const values = [userID];

  try {
    await db.query(sql, values);
  } catch (err) {
    console.error("DB Errors", err);
    return res.status(500).send({
      success: false,
      message: "Failed to delete user.",
    });
  } finally {
    db.end();
  }

  res.clearCookie("auth_token").send({
    success: true,
    message: "User account deleted successfully",
  });
}
