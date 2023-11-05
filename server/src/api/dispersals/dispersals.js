import express from "express";
import {
  handleLivestockDispersal,
  handleGetDispersalInfo,
  handleDeleteDispersalRecord,
  handleGetDispersalList,
  handleUpdateDispersalData,
  handleRedispersalStarter,
  handleRedispersalOffspring,
  handleGetDispersalsActivityRecords,
} from "./single.dispersions.handlers.js";
import {
  authorizeRoles,
  validateAuthCookie,
} from "../../global/middlewares/authorizations.js";
import {
  handleBatchDispersal,
  handleBatchRedispersals,
  handleDeleteBatchDispersal,
  handleGetBatchDispersalInfo,
  handleGetBatchDispersalList,
  handleUpdateBatchDispersalData,
} from "./batch.dispersals.handlers.js";

const router = express.Router();

// single dispersion
router.get("/single-dispersions/", validateAuthCookie, handleGetDispersalList);
router.get(
  "/single-dispersions/:dispersal_id",
  validateAuthCookie,
  handleGetDispersalInfo
);
router.post(
  "/single-dispersions/disperse",
  validateAuthCookie,
  authorizeRoles(["Admin", "Program Manager"]),
  handleLivestockDispersal
);
router.post(
  "/single-dispersions/redisperse/:dispersal_id",
  validateAuthCookie,
  authorizeRoles(["Admin", "Program Manager"]),
  handleRedispersalStarter
);
router.post(
  "/single-dispersions/redisperse",
  validateAuthCookie,
  authorizeRoles(["Admin", "Program Manager"]),
  handleRedispersalOffspring
);
router.put(
  "/single-dispersions/update/:dispersal_id",
  authorizeRoles(["Admin", "Program Manager"]),
  handleUpdateDispersalData
);
router.delete(
  "/single-dispersions/delete/:dispersal_id",
  validateAuthCookie,
  authorizeRoles(["Admin", "Program Manager"]),
  handleDeleteDispersalRecord
);

// activity
router.get("/activity", validateAuthCookie, handleGetDispersalsActivityRecords);

// batch dispersals
router.get(
  "/batch-dispersals/",
  validateAuthCookie,
  handleGetBatchDispersalList
);
router.get(
  "/batch-dispersal/:batch_id",
  validateAuthCookie,
  handleGetBatchDispersalInfo
);
router.post(
  "/batch-dispersals/disperse",
  validateAuthCookie,
  authorizeRoles(["Admin", "Program Manager"]),
  handleBatchDispersal
);
router.post(
  "/batch-dispersals/redisperse",
  validateAuthCookie,
  authorizeRoles(["Admin", "Program Manager"]),
  handleBatchRedispersals
);
router.put(
  "/batch-dispersals/update/:batch_id",
  validateAuthCookie,
  authorizeRoles(["Admin", "Program Manager"]),
  handleUpdateBatchDispersalData
);
router.delete(
  "/batch-dispersals/delete/:dispersal_id",
  validateAuthCookie,
  authorizeRoles(["Admin", "Program Manager"]),
  handleDeleteBatchDispersal
);

export default router;
