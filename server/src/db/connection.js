import mysql from "mysql2/promise";

export default async function connectDb(database) {
  let connection = null;

  try {
    connection = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: database,
    });
  } catch (err) {
    console.error("[database connection error]", err);
  }
}
