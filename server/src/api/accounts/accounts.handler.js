import connectDb from "../../db/connection.js";
import { DecodeAuthToken } from "../../global/utils/jwt.js";

export async function handleGetUserInfo(req, res) {
  const userID = DecodeAuthToken(req.cookies.auth_token).userId;

  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({ message: "Cannot connect to the databse." });
  }

  const sql =
    "SELECT users.userId, first_name, last_name, email, password, registration_date, roles.role_name FROM users INNER JOIN roles ON users.role_id = roles.role_id WHERE users.userId = ?;";

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
  // The userId in auth_token has already been validated by the middleware isVetOfficeMember

  res.send({
    success: true,
    message: "Success feching user information",
    data: rows[0],
  });
}
