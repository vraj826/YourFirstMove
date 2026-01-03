import { Router } from 'express';
import analyticsService from '../services/AnalyticsService';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get completion rate
router.get('/completion', async (req: AuthRequest, res, next) => {
  try {
    const dateFrom = req.query.dateFrom as string || new Date().toISOString().split('T')[0];
    const dateTo = req.query.dateTo as string || new Date().toISOString().split('T')[0];

    const completionRate = await analyticsService.calculateCompletionRate(
      req.userId!,
      dateFrom,
      dateTo
    );

    res.json({
      success: true,
      data: completionRate,
    });
  } catch (error) {
    next(error);
  }
});

// Get productivity trends
router.get('/trends', async (req: AuthRequest, res, next) => {
  try {
    const period = req.query.period as string || 'week';
    const trends = await analyticsService.getProductivityTrends(req.userId!, period);

    res.json({
      success: true,
      data: trends,
    });
  } catch (error) {
    next(error);
  }
});

// Get streak data
router.get('/streaks', async (req: AuthRequest, res, next) => {
  try {
    const streak = await analyticsService.calculateStreak(req.userId!);

    res.json({
      success: true,
      data: { currentStreak: streak },
    });
  } catch (error) {
    next(error);
  }
});

// Get task statistics
router.get('/statistics', async (req: AuthRequest, res, next) => {
  try {
    const statistics = await analyticsService.getTaskStatistics(req.userId!);

    res.json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
