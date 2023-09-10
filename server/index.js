import express from "express";
import dotenv from "dotenv";
const app = express();

// configurations
const envPath = `./.env.${process.env.NODE_ENV}`;
dotenv.config({ path: envPath });

// API
app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

// serve for production
if (process.env.NODE_ENV === "production") {
  console.log("app is running on production");
}

app.listen(process.env.PORT, () => {
  console.log(`Server Listening to ${process.env.PORT}`);
});
