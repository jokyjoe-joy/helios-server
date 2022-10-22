import express from "express";
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
router.post("/", authenticate, isAdmin, userController.userCreate);

/*
 * Deleting specified user. If not own username, then needs admin rights.
 */
router.delete("/:username", authenticate, userController.userDelete);

/*
 * Updating user information.
 */
router.put("/:username", authenticate, userController.userUpdate);

export default router;