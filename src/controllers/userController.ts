import { Request, Response } from "express";
import { db } from "../db/db";
import * as logging from "../utils/logging";
import * as argon2 from "argon2";
import { argon2Config } from "../middlewares/auth";

/**
 * Returning list of users, requires admin authentication.
 * Explicitly deletes users' passwords in the returned JSON.
 *
 * @returns users' data in JSON on success
 */
export const userList = async (req: Request, res: Response) =>
{
  logging.log(`⚡️[/users]: User '${req.user?.username}' is requesting a user list.`);
  try
  {
    let users = await db.any("SELECT * FROM users");
    users = users.map(user =>
    {
      // Not even the hash of the password should be shown to admins.
      delete user["password"];
      return user;
    });
    logging.log(`⚡️[/users]: User '${req.user?.username}' has successfully received a list of ${users.length} users.`);
    return res.json(users);
  }
  catch (e)
  {
    logging.error(JSON.stringify(e));
    return res.sendStatus(500);
  }
};

/**
 * Returns every data (column) of the specified user, except the password.
 *
 * Only administrators can check other users' data.
 * @returns user data in JSON on success
 */
export const userGet = async (req: Request, res: Response) =>
{
  // Check if has privileges to get specified user.
  if (req.user?.username != req.params.username && req.user?.role != "admin")
  {
    return res.sendStatus(403);
  }
  try
  {
    // Only trying to find one user with the specified username,
    // since the username is a unique key in the db.
    const user = await db.oneOrNone("SELECT * FROM users WHERE username = ${username}", req.params)
      .then(user =>
      {
      // Not even the hash of the password should be shown to admins / the user.
        delete user["password"];
        return user;
      });
    // No rows are returned.
    if (user == null)
    {
      return res.status(404).send(`Not found user '${req.params.username}'.`);
    }
    return res.json(user);

  }
  catch (e)
  {
    logging.error(JSON.stringify(e));
    return res.status(500).send("Error occured when processing request.");
  }
};

/**
 * ### Creating a new user.
 *
 * This is **NOT** the same as registering. This function is used
 * for admins. For further info see the methods in *authController.ts*.
 * @returns UserID on success; 500 on error
 */
export const userCreate = async (req: Request, res: Response) =>
{
  logging.log(`⚡️[/users]: Creating user with username '${req.body.username}'.`);
  try
  {
    const hashedPassword = await argon2.hash(req.body.password, argon2Config);
    const dbQuery = "INSERT INTO users(username, password, role) VALUES($1, $2, 'member') RETURNING UserID";
    const user = await db.one(dbQuery, [req.body.username, hashedPassword]);
    logging.log(`⚡️[/users]: Created user with ID: ${user.userid}`);
    return res.json({ "userid": user.userid });
  }
  catch (e: any)
  {
    logging.error(e);
    return res.sendStatus(500);
  }
};


/**
 * Deletes specified user if initiating user has enough privileges.
 *
 * Only lets user delete if the specified user is itself or has administrator privileges.
 * @returns *userid* of deleted user in JSON on success
 */
export const userDelete = async (req: Request, res: Response) =>
{
  logging.log(`⚡️[/users/${req.params.username}]: User '${req.user?.username}' is trying to delete user '${req.params.username}'.`);
  // Check if has privileges to delete specified user.
  if (req.user?.username != req.params.username && req.user?.role != "admin")
  {
    return res.sendStatus(403);
  }

  try
  {
    const dbQuery = "DELETE FROM users where username=${username} RETURNING UserID";
    const data = await db.one(dbQuery, req.params);
    logging.log(`⚡️[/users/${req.params.username}]: User '${req.user?.username}' successfully deleted user '${req.params.username}'.`);
    return res.json({ "userid": data.userid });
  }
  catch (e: any)
  {
    logging.error(e);
    return res.sendStatus(500);
  }
};

export const userUpdate = (req: Request, res: Response) =>
{
  return res.sendStatus(501);
};