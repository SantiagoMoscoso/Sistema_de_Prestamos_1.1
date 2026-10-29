import { Router } from "express";
import { createUser, login } from "../controllers/userController";

const router = Router();

router.post("/users", createUser);
router.post("/login", login);

export default router;