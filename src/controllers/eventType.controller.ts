import { Request, Response, NextFunction, Router } from 'express';
import {
  createEventType,
  deleteEventType,
  getEventTypes,
} from '../services/eventType.services';
const router = Router();

router
  .route('/event-type')
  .get(async (req: Request, res: Response) => {
    try {
      res.send(await getEventTypes());
    } catch (error) {}
  })
  .post(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await createEventType(req.body);
      res.send();
    } catch (error) {
      next(error);
    }
  });

router
  .route('/event-type/:id')
  .delete(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteEventType(req.params.id);
      res.send();
    } catch (error) {
      next(error);
    }
  });

export default router;
