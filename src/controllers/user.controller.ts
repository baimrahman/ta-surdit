import { Request, Response, NextFunction, Router } from 'express';
import { createUser, deleteUser, getUsers } from '../services/user.services';
const router = Router();

router
  .route('/user')
  .get(async (req, res) => {
    try {
      res.send(await getUsers());
    } catch (error) {}
  })
  .post(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await createUser(req.body);
      res.send();
    } catch (error) {
      next(error);
    }
  });

router
  .route('/user/:id')
  .delete(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteUser(req.params.id);
      res.send();
    } catch (error) {
      next(error);
    }
  });

export default router;
