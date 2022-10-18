import express, { Express, Request, Response } from "express";
import * as dotenv from "dotenv";
import Logger from "./src/middlewares/logging";
import getTime from "./src/utils/utils";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(Logger);

app.get("/", (_req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`⚡️[/]: ${getTime()} - Server is running at https://localhost:${port}`);
});