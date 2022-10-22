import { Request, Response, NextFunction } from "express";
import * as logging from "../utils/logging";

const Logger = function (req: Request, res: Response, next: NextFunction)
{
  logging.log(`⚡️[${req.originalUrl}]: ${req.method} request from ${req.ip}.`);
  next();
};

export default Logger;