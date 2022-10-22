import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import * as logging from "../utils/logging";
import * as argon2 from "argon2";

// Argon2 config
export const argon2_config: argon2.Options & {raw: false} = {
  type: argon2.argon2id,
  memoryCost: parseInt(<string>process.env.ARGON2_MEMORY_COST),
  timeCost: parseInt(<string>process.env.ARGON2_TIME_COST),
  hashLength: parseInt(<string>process.env.ARGON2_HASH_LENGTH),
  saltLength: parseInt(<string>process.env.ARGON2_SALT_LENGTH),
  parallelism: parseInt(<string>process.env.ARGON2_PARALLELISM),
  raw: false
};

export function generateAccessToken(username: string, role: string) {
  const secret_token: string = process.env.JWT_SECRET_TOKEN || "";
  if (secret_token == "") {
    logging.error("No secret token specified in .env. Can't generate access token.");
    return;
  }
  return jwt.sign({ username: username, role: role}, secret_token, { expiresIn: `${process.env.TOKEN_EXP_SEC}s` });
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  // Header is a key-value pair:
  // { "Authorization": "Bearer ACCESS_TOKEN" }
  // E.g.:
  // { "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX..." }
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET_TOKEN as string, (err: any, user: any) => {
    if (err) { 
      logging.log(err);
      return res.sendStatus(403);
    }

    // Req.user = { username: string, role: string, iat: number, exp: number }.
    // See jwt.sign() for further info.
    // If you want to add more properties, also extend "../types/express/index.d.ts".
    req.user = user;

    next();
  });
}

export function isAdmin (req: Request, res: Response, next: NextFunction) {
  // TODO: Make a user model(?) and delete this explicit any.
  const user: any = req.user || "";
  if (user == "") {
    logging.error("IsAdmin authorization failed, req.user is empty.");
    return res.sendStatus(500);
  }

  const role: string = user["role"];
  const username: string = user["username"];

  if (role != "admin") {
    logging.warn(`User ${username} (role: ${role}) has failed to access an admin-exclusive method`);
    return res.sendStatus(403);
  }
  next();
}