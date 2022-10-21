import express, { Request, Response } from "express";
const router = express.Router();

import * as userController from "../controllers/userController";

/*
 * Returning list of users.
 */
router.get("/", userController.userList);

/*
 * Querying info of specified user.
 */
router.get("/:username", userController.userGet);

/*
 * Creating new user.
 */
router.post("/", userController.userCreate);

/*
 * Deleting specified user.
 */
router.delete("/:username", userController.userDelete);

/*
 * Updating user information.
 */
router.put("/:username", userController.userUpdate);

export default router;