import express from "express";
import {
  handleNewBeneficiaries,
  handleDeleteBeneficiaries,
  handleGetBeneficiariesInfo,
  handleGetBeneficiariesList,
  handleUpdateBeneficiaries,
} from "./beneficiaries.handler.js";

const router = express.Router();

router.get("/", handleGetBeneficiariesList);
router.get("/details/:beneficiary_id", handleGetBeneficiariesInfo);
router.post("/add", handleNewBeneficiaries);
router.put("/update/:beneficiary_id", handleUpdateBeneficiaries);
router.delete("/delete/:beneficiary_id", handleDeleteBeneficiaries);

export default router;
