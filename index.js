import express from "express";
import bootstrap from "./src/app.controller.js";
import dotenv from "dotenv";
import { runSocket } from "./src/modules/socketIO/index.js";
import deletingExpiredOTP from "./src/utils/cron jobs/cron.jobs.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

await bootstrap(app, express);

const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);

runSocket(server);
