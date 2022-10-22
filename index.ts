import express, { Express } from "express";
import * as dotenv from "dotenv";
// Need to config here, because some imports already use it.
dotenv.config();
import * as bodyParser from "body-parser";
import Logger from "./src/middlewares/logging";
import * as logging from "./src/utils/logging";
import Users from "./src/routes/users";
import Auth from "./src/routes/auth";

/*
 * Setting up Express server.
 */

const app: Express = express();
const port = process.env.PORT;

/*
 * MIDDLEWARES
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(Logger);

/*
 * ROUTES
 */

app.use("/users", Users);
app.use("/", Auth);

app.listen(port, () =>
{
  logging.log(`⚡️[/]: Server is running at https://localhost:${port}`);
});

// Export app for testing purposes.
export default app;