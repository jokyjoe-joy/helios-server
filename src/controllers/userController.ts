import { Request, Response } from "express";
import { db } from "../db/db";
import * as logging from "../utils/logging";
import * as argon2 from "argon2";
import { argon2_config } from "../middlewares/auth";

/*
 * Returning list of users, requires admin authentication.
 */
export const userList = async (req: Request, res: Response) => {
  let users = await db.any("SELECT * FROM users");
  users = users.map(user => {
    // Not even the hash of the password should be shown to admins.
    delete user["password"];
    return user;
  });
  return res.json(users);
};

/*
 * Returning details of user, but requires admin or same-user authentication!
 * TODO.
 */
export const userGet = async (req: Request, res: Response) => {
  try {
    // Only trying to find one user with the specified username,
    // since the username is a unique key in the db.
    const user = await db.oneOrNone("SELECT * FROM users WHERE username = ${username}", req.params).then(user => {
      // Not even the hash of the password should be shown to admins / the user.
      delete user["password"];
      return user;
    });
    // No rows are returned.
    if (user == null) {
      return res.status(404).send(`Not found user '${req.params.username}'.`);
    }
    
    return res.json(user);

  } catch (e) {
    logging.error(JSON.stringify(e));
    return res.status(500).send("Error occured when processing request.");
  }
};

export const userCreate = async (req: Request, res: Response) => {
  logging.log(`⚡️[/users]: Creating user with username '${req.body.username}'.`);
  try {
    const hashedPassword = await argon2.hash(req.body.password, argon2_config);

    const db_query = "INSERT INTO users(username, password, role) VALUES($1, $2, 'member') RETURNING UserID";
    const user = await db.one(db_query, [req.body.username, hashedPassword]);
    logging.log(`⚡️[/users]: Created user with ID: ${user.userid}`);
    res.json({"UserID": user.userid});
    return;
  } catch (e: any) {
    logging.error(e);
    return res.sendStatus(500);
  }
};

export const userDelete = (req: Request, res: Response) => {
  return res.sendStatus(501);
};

export const userUpdate = (req: Request, res: Response) => {
  return res.sendStatus(501);
};