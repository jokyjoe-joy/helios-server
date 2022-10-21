import * as jwt from "jsonwebtoken";
import { Request, Response } from "express";
import * as logging from "../utils/logging";
import * as argon2 from "argon2";
import { db } from "../db/db";
import { generateAccessToken } from "../middlewares/auth";

const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "";
const refreshTokens = [];

export async function login(req: Request, res: Response) {
  const user = await db.oneOrNone("SELECT * FROM users WHERE username = ${username}", req.body);

  if (user == null || !(await argon2.verify(user["password"], req.body.password))) { 
    return res.status(401).send("Incorrect username or password."); 
  }

  logging.log(`⚡️[/login] - User '${req.body.username}' has succesfully logged in.`);

  const accessToken = generateAccessToken(user["username"], user["role"]);
  const refreshToken = jwt.sign({ username: user["username"], role: user["role"] }, refreshTokenSecret);

  refreshTokens.push(refreshToken);

  return res.json({ accessToken, refreshToken });
}