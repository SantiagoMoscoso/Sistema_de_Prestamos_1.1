import { Router } from "express";
import { createLoan } from "../controllers/loanController";

const router = Router();

router.post("/loans", createLoan);

export default router;