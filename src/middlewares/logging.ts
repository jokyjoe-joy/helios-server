import { Request, Response, NextFunction } from "express";
import getTime from "../utils/utils";

const Logger = function (req: Request, res: Response, next: NextFunction) {
  console.log(`⚡️[${req.originalUrl}]: ${getTime()} - ${req.method} request from ${req.ip}.`);
  next();
};

export default Logger;