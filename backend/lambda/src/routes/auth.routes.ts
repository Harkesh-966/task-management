import { Router } from 'express';
import { register, login, getInfoCookie, logout } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../validators/auth.schema';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', requireAuth, getInfoCookie)
router.post('/logout', requireAuth, logout)
// Optional refresh/logout endpoints could be added here

export default router;
