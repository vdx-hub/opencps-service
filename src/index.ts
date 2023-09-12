import 'dotenv/config'
import bodyParser from 'body-parser';
import https from 'https';
import express from 'express';

import rootRouter from "@routes/root";
import filesRouter from "@routes/files";
import actionsRouter from "@routes/action";
import { ensureDir } from 'fs-extra';
import { logger } from '@services/logger';
import { auth } from 'middleware/auth';


https.globalAgent.options.rejectUnauthorized = false;

const app = express();
app.use(bodyParser.json({
  limit: "50mb"
}));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use((err: any, _req: any, res: any, _next: any) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err,
  });
});
app.use(auth)

ensureDir('./logs/')
ensureDir('./uploads/files/')
app.use(rootRouter)
app.use('/action', actionsRouter)
app.use('/files', filesRouter)

app.listen(9000, async () => {
  logger('startup').info("Server is up! http://0.0.0.0:9000");
})
