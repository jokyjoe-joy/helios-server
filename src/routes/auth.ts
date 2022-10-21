import express from "express";
const router = express.Router();

import * as authController from "../controllers/authController";

/*
 * Login
 */
router.post("/login", authController.login);

export default router;