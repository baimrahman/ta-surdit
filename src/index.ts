import express from 'express';
import routes from './routes/routes';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';

import { errorResponseHandler } from './middleware/errorResponse';
import { startSendMessage } from './middleware/sendMessage';

const prisma = new PrismaClient();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);
app.use(errorResponseHandler);
startSendMessage();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.info(`server up on port ${PORT}`);
});
