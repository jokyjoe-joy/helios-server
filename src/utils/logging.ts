import * as fs from "fs";
import * as util from "util";
import { getDate, getTime } from "./utils";

let logFile: fs.WriteStream;
if (process.env.LOG_OUT == "FILE" || process.env.LOG_OUT == "ALL")
{
  // Needs "/../.." to get to root folder, because this file is in "/src/utils".
  // However this might not be necessary in production and might cause errors.
  logFile = fs.createWriteStream(__dirname + "/../.." + process.env.LOG_FILE, { flags: "a" });
}

const writeToLogFile = function(output: string)
{
  if (process.env.LOG_OUT == "FILE" || process.env.LOG_OUT == "ALL")
  {
    logFile.write(`${getDate()} ${output}`);
  }
};

/**
  * Log a specific string.
  *
  * It shows current time and also enables logging to file specified in .env.
  *
  * Its settings can be configured with .env variables.
  */
export const log = function(d: string)
{
  if (process.env.LOG_MODE == "LOG" || process.env.LOG_MODE == "ALL")
  {
    const output = `${getTime()} - ${util.format(d)}`+ "\n";
    writeToLogFile(output);
    if (process.env.LOG_OUT == "SHELL" || process.env.LOG_OUT == "ALL")
    {
      process.stdout.write(output);
    }
  }
};

/**
  * Log a specific string as **error**.
  *
  * It shows current time and adds a decorator prefix (❌ [ERROR]),
  * also enables logging to file specified in .env.
  *
  * Its settings can be configured with .env variables.
  */
export const error = function(d: string)
{
  const output = `${getTime()} - ❌ [ERROR]: ${util.format(d)}`+ "\n";
  writeToLogFile(output);
  if (process.env.LOG_OUT == "SHELL" || process.env.LOG_OUT == "ALL")
  {
    process.stdout.write(output);
  }
};

export const warn = function(d: string)
{
  const output = `${getTime()} - ⚠️ [WARN]: ${util.format(d)}`+ "\n";
  writeToLogFile(output);
  if (process.env.LOG_OUT == "SHELL" || process.env.LOG_OUT == "ALL")
  {
    process.stdout.write(output);
  }
};

export const info = function()
{
  Error("Logging.info is not implemented yet");
};