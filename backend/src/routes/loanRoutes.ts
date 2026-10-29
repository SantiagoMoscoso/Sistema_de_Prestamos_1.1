import { Router } from "express";
import { createLoan, registerPayment } from "../controllers/loanController";
import { getUserLoans } from "../controllers/loanController";

const router = Router();

router.post("/loans", createLoan);
router.post("/loans/:id/payments", registerPayment);
router.get("/users/:id/loans", getUserLoans);

export default router;