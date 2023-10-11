import express from "express";
import {
  handleLivestockDispersal,
  handleGetDispersalInfo,
  handleDeleteDispersalRecord,
  handleGetDispersalList,
  handleUpdateDispersalData,
  handleRedispersalStarter,
  handleRedispersalOffspring,
} from "./single.dispersions.handlers.js";
import {
  authorizeRoles,
  validateAuthCookie,
} from "../../global/middlewares/authorizations.js";

const router = express.Router();

router.get("/", validateAuthCookie, handleGetDispersalList);
router.get("/:dispersal_id", validateAuthCookie, handleGetDispersalInfo);
router.post(
  "/add",
  validateAuthCookie,
  authorizeRoles(["Admin", "Program Manager"]),
  handleLivestockDispersal
);
router.post(
  "/redisperse/:dispersal_id",
  validateAuthCookie,
  authorizeRoles(["Admin", "Program Manager"]),
  handleRedispersalStarter
);
router.post(
  "/redisperse",
  validateAuthCookie,
  authorizeRoles(["Admin", "Program Manager"]),
  handleRedispersalOffspring
);
router.put(
  "/update/:dispersal_id",
  authorizeRoles(["Admin", "Program Manager"]),
  handleUpdateDispersalData
);
router.delete(
  "/delete/:dispersal_id",
  validateAuthCookie,
  authorizeRoles(["Admin", "Program Manager"]),
  handleDeleteDispersalRecord
);

export default router;
