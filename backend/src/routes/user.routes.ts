import { Router } from 'express';
import User from '../models/User';
import UserPreference from '../models/UserPreference';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get user profile
router.get('/profile', async (req: AuthRequest, res, next) => {
  try {
    const user = await User.query().findById(req.userId!);

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/profile', async (req: AuthRequest, res, next) => {
  try {
    const user = await User.query().patchAndFetchById(req.userId!, {
      name: req.body.name,
      phone_number: req.body.phoneNumber,
    });

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

// Get user preferences
router.get('/preferences', async (req: AuthRequest, res, next) => {
  try {
    let preferences = await UserPreference.query().findOne({ user_id: req.userId! });

    if (!preferences) {
      preferences = await UserPreference.query().insert({
        user_id: req.userId!,
        theme: 'light',
        notification_enabled: true,
        notification_timing: 30,
      });
    }

    res.json({
      success: true,
      data: { preferences },
    });
  } catch (error) {
    next(error);
  }
});

// Update user preferences
router.put('/preferences', async (req: AuthRequest, res, next) => {
  try {
    let preferences = await UserPreference.query().findOne({ user_id: req.userId! });

    if (!preferences) {
      preferences = await UserPreference.query().insert({
        user_id: req.userId!,
        ...req.body,
      });
    } else {
      preferences = await preferences.$query().patchAndFetch(req.body);
    }

    res.json({
      success: true,
      data: { preferences },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
