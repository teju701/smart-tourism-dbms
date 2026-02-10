import express from "express";
import { addBudget } from "../controllers/usersController.js";

const router = express.Router();

router.post("/add-budget", addBudget);

export default router;
