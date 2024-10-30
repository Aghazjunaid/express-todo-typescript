import { Router } from 'express';
import { Signup, Login} from '../controllers/user.controller';

export const userRoutes = () => {
  const router = Router();

  router.post('/signup', Signup);

  router.post('/login', Login);

  return router;
};