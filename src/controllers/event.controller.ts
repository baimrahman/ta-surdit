import { Request, Response, NextFunction, Router } from 'express';
import {
  createEvent,
  deleteEvent,
  getEvents,
} from '../services/event.services';
const router = Router();

router
  .route('/event')
  .get(async (req: Request, res: Response) => {
    try {
      res.send(await getEvents());
    } catch (error) {}
  })
  .post(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await createEvent(req.body);
      res.send();
    } catch (error) {
      next(error);
    }
  });

router
  .route('/event/:id')
  .delete(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteEvent(req.params.id);
      res.send();
    } catch (error) {
      next(error);
    }
  });

export default router;
