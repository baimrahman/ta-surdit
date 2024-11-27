import { Router } from 'express';
import userController from '../controllers/user.controller';
import eventController from '../controllers/event.controller';
import eventTypeController from '../controllers/eventType.controller';

const api = Router()
  .use(userController)
  .use(eventController)
  .use(eventTypeController);

export default Router().use('/api', api);
