import express, { Request, Response } from "express";
const router = express.Router();

import * as userController from "../controllers/userController";
import { authenticate, isAdmin } from "../middlewares/auth";

/*
 * Returning list of users.
 */
router.get("/", authenticate, isAdmin, userController.userList);

/*
 * Querying info of specified user.
 */
router.get("/:username", authenticate, userController.userGet);

/*
 * Creating new user.
 */
router.post("/", userController.userCreate);

/*
 * Deleting specified user.
 */
router.delete("/:username", authenticate, userController.userDelete);

/*
 * Updating user information.
 */
router.put("/:username", authenticate, userController.userUpdate);

export default router;