"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = __importDefault(require("pg"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { Pool } = pg_1.default;
console.log(process.env.DATABASE_URL);
const dbconfig = {
    connectionString: process.env.DATABASE_URL,
};
if (process.env.MODE === "PROD") {
    dbconfig.ssl = {
        rejectUnauthorized: false
    };
}
const db = new Pool(dbconfig);
exports.default = db;
