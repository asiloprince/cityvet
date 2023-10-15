import express from "express";
import {
  handleNewBeneficiaries,
  handleDeleteBeneficiaries,
  handleGetBeneficiariesInfo,
  handleGetBeneficiariesList,
  handleUpdateBeneficiaries,
} from "./beneficiaries.handler.js";
import { validateAuthCookie } from "../../global/middlewares/authorizations.js";

const router = express.Router();

router.get("/", validateAuthCookie, handleGetBeneficiariesList);
router.get(
  "/details/:beneficiary_id",
  validateAuthCookie,
  handleGetBeneficiariesInfo
);
router.post("/add", validateAuthCookie, handleNewBeneficiaries);
router.put(
  "/update/:beneficiary_id",
  validateAuthCookie,
  handleUpdateBeneficiaries
);
router.delete(
  "/delete/:beneficiary_id",
  validateAuthCookie,
  handleDeleteBeneficiaries
);

export default router;
