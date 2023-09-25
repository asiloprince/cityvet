import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import beneficiaries from "./src/api/beneficiaries/beneficiaries.js";
import livestocks from "./src/api/livestocks/livestocks.js";
import auth from "./src/api/authentications/authentications.js";
import accounts from "./src/api/accounts/accounts.js";
const app = express();

// configurations
const envPath = `./.env.${process.env.NODE_ENV}`;
dotenv.config({ path: envPath });
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", process.env.CLIENT_URL);
  res.set("Access-Control-Allow-Credentials", true);
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Allow-Methods", "GET, POST, DELETE");

  next();
});

// APIs
app.use("/api", beneficiaries);
app.use("/api/livestocks", livestocks);
app.use("/auth", auth);
app.use("/accounts", accounts);

console.log(`Environment: ${process.env.NODE_ENV.toUpperCase()}`);

// serve for production
if (process.env.NODE_ENV === "production") {
  console.log("app is running on production");
}

app.listen(process.env.PORT, () => {
  console.log(`Server Listening to ${process.env.PORT}`);
});
