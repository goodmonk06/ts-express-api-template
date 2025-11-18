import { Router, type IRouter } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { createUserSchema, loginSchema, updateUserSchema } from '../validators/user.validator';

const router: IRouter = Router();

// Public routes
router.post('/register', validate(createUserSchema), (req, res) =>
  userController.register(req, res)
);
router.post('/login', validate(loginSchema), (req, res) => userController.login(req, res));

// Protected routes
router.get('/profile', authenticate, (req, res) => userController.getProfile(req, res));
router.get('/', authenticate, (req, res) => userController.getAllUsers(req, res));
router.get('/:id', authenticate, (req, res) => userController.getUserById(req, res));
router.put('/profile', authenticate, validate(updateUserSchema), (req, res) =>
  userController.updateUser(req, res)
);
router.delete('/profile', authenticate, (req, res) => userController.deleteUser(req, res));

export default router;
