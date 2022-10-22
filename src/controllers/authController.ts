import * as jwt from "jsonwebtoken";
import { Request, Response } from "express";
import * as logging from "../utils/logging";
import * as argon2 from "argon2";
import { db } from "../db/db";
import { generateAccessToken } from "../middlewares/auth";
import { argon2_config } from "../middlewares/auth";

const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "";
const refreshTokens = [];

export async function login(req: Request, res: Response) {
  logging.log(`⚡️[/login] - User '${req.body.username}' is trying to log in.`);
  const user = await db.oneOrNone("SELECT * FROM users WHERE username = ${username}", req.body);

  if (user == null || !(await argon2.verify(user["password"], req.body.password))) { 
    logging.log(`⚡️[/login] - User '${req.body.username}' failed to log in.`);
    return res.status(401).send("Incorrect username or password."); 
  }

  logging.log(`⚡️[/login] - User '${req.body.username}' has succesfully logged in.`);

  const accessToken = generateAccessToken(user["username"], user["role"]);
  const refreshToken = jwt.sign({ username: user["username"], role: user["role"] }, refreshTokenSecret);

  refreshTokens.push(refreshToken);

  return res.json({ accessToken, refreshToken });
}

/**
 * Registers a new user and then logs it in as well.
 * 
 * Calls login() upon successful registering.
 * 
 * @returns accessToken and refreshToken on success (from /login)
 */
export async function register(req: Request, res: Response) {
  logging.log(`⚡️[/register]: Trying to register user with username '${req.body.username}'.`);

  // Check user has sent all required data for registering.
  if (!req.body.username || !req.body.password) {
    return res.status(400).send("Incorrect syntax. No username or password specified.");
  }

  try {
    // Insert user data with hashed password into DB.
    const hashedPassword = await argon2.hash(req.body.password, argon2_config);
    const db_query = "INSERT INTO users(username, password, role) VALUES($1, $2, 'member') RETURNING UserID";
    const user = await db.one(db_query, [req.body.username, hashedPassword]);
    logging.log(`⚡️[/register]: Created user with ID: ${user.userid}`);

    // Login user as well, therefore returning an access and a refresh token.
    login(req, res);
    return;
    
  } catch (e: any) {
    logging.error(e);
    return res.sendStatus(500);
  }
}