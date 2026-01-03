import { Router } from 'express';
import authService from '../services/AuthService';
import { validate, registerSchema, loginSchema } from '../middleware/validation';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Register
router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    const token = authService.generateToken(user.id);

    res.status(201).json({
      success: true,
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { user, token } = await authService.login(req.body);

    res.json({
      success: true,
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = await authService.getUserById(req.userId!);

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
