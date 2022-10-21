import { Request, Response } from "express";
import { db } from "../db/db";
import { errors } from "pg-promise";
import * as logging from "../utils/logging";

/*
 * Returning list of users, but requires admin authentication!
 * TODO.
 */
export const userList = async (req: Request, res: Response) => {
  // Since we are unauthenticated and authentication is not
  // implemented yet, return.
  res.sendStatus(403);
  return;
/*   let users = await db.any("SELECT * FROM users");
  users = users.map(user => {
    // Not even the hash of the password should be shown to admins / the user.
    delete user["password"];
    return user;
  });
  res.json(users);
  return; */
};

/*
 * Returning details of user, but requires admin or same-user authentication!
 * TODO.
 */
export const userGet = async (req: Request, res: Response) => {
  const dbQuery = "SELECT * FROM users WHERE username = $1";
  try {
    // Only trying to find one user with the specified username,
    // since the username is a unique key in the db.
    const user = await db.oneOrNone(dbQuery, [req.params.username]).then(user => {
      // Not even the hash of the password should be shown to admins / the user.
      delete user["password"];
      return user;
    });
    // No rows are returned.
    if (user == null) {
      res.status(404).send(`Not found user '${req.params.username}'.`);
      return;
    }
    
    res.json(user);
    return;

  } catch (e) {
    // This is prevented with username set as a unique key in DB.
    if (e instanceof errors.QueryResultError) {
      // TODO: Better way of making this a universal error model?
      logging.error(JSON.stringify({
        "type": "db.QueryResultError",
        "message": "Multiple rows received when expected only one.",
        "request": {
          "params": req.params,
          "url": req.url
        },
        "params": {
          "query": dbQuery
        }
      }));
      res.status(500).send("Error occured when processing request.");
      return;
    } else {
      logging.error(JSON.stringify(e));
      res.status(500).send("Error occured when processing request.");
      return;
    }
  }
};

export const userCreate = (req: Request, res: Response) => {
  logging.log(`⚡️[/users]: Creating user with username '${req.body.username}'.`);
  db.one("INSERT INTO users(username, password) VALUES($1, $2) RETURNING UserID", [req.body.username, req.body.password])
    .then(data => {
      logging.log(`⚡️[/users]: Created user with ID: ${data.userid}`);
      res.json({"UserID": data.userid});
      return;
    })
    .catch(error => {
      logging.error(error);
      res.sendStatus(500);
    });
};

export const userDelete = (req: Request, res: Response) => {
  res.sendStatus(501);
};

export const userUpdate = (req: Request, res: Response) => {
  res.sendStatus(501);
};