import {IMain, IDatabase, IResultExt} from "pg-promise";
import pgPromise from "pg-promise";
import * as logging from "../utils/logging";

const pgp: IMain = pgPromise({
  query(e: any) {
    logging.log(`🗄️ [DB]: Running '${e.query}'`);
  },
  receive(data: any, result: IResultExt) {
    logging.log(`🗄️ [DB]: Received ${result.rowCount} row(s).`);
  }
});

const connection: any = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:  process.env.DB_USER,
  password: process.env.DB_PASS
};

const db: IDatabase<any> = pgp(connection);

export {
  db
};