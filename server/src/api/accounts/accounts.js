import express from "express";
import {
  authorizeRoles,
  isVetOfficeMember,
  validateAuthCookie,
} from "../../global/middlewares/authorizations.js";
import {
  handleDeleteUserAccount,
  handleGetRole,
  handleGetUserInfo,
  handleGetUsersList,
  handleUpdateUserInfo,
  handleUpdateUserRole,
} from "./accounts.handler.js";

const router = express.Router();

router.get("/role", handleGetRole);
router.get(
  "/",
  validateAuthCookie,
  authorizeRoles(["Admin"]),
  handleGetUsersList
);
router.get(
  "/user/details",
  validateAuthCookie,
  isVetOfficeMember,
  handleGetUserInfo
);

router.put("/update/:user_id", validateAuthCookie, handleUpdateUserInfo);
router.put(
  "/assign-role/:user_id",
  validateAuthCookie,
  authorizeRoles(["Admin"]),
  handleUpdateUserRole
);
router.delete(
  "/delete/:user_id",
  authorizeRoles(["Admin"]),
  handleDeleteUserAccount
);

export default router;
