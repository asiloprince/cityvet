import express from "express";
import dotenv from "dotenv";
import beneficiaries from "./src/api/beneficiaries/beneficiaries.js";
const app = express();

// configurations
const envPath = `./.env.${process.env.NODE_ENV}`;
dotenv.config({ path: envPath });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API
app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});
app.use("/api", beneficiaries);

// serve for production
if (process.env.NODE_ENV === "production") {
  console.log("app is running on production");
}

app.listen(process.env.PORT, () => {
  console.log(`Server Listening to ${process.env.PORT}`);
});
