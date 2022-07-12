import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;
console.log( process.env.DATABASE_URL)
const dbconfig: any = {
  connectionString: process.env.DATABASE_URL,
};
if(process.env.MODE === "PROD") {
  dbconfig.ssl = {
    rejectUnauthorized: false
  }
}

const db = new Pool(dbconfig);
export default db

