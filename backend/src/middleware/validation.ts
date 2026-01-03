import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      // Log validation errors for debugging
      console.error('Validation failed:', {
        body: req.body,
        errors: errors
      });

      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: errors,
        },
      });
      return;
    }

    next();
  };
};

// Common validation schemas
export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().min(1).max(255).required(),
  phoneNumber: Joi.string().min(10).max(20).optional().allow('', null),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().optional().allow(''),
  dueDate: Joi.string().optional().allow(''), // Optional - will default to today
  dueTime: Joi.string().optional().allow(''),
  endTime: Joi.string().optional().allow(''),
  priority: Joi.string().valid('low', 'medium', 'high', 'critical').optional(),
  isCritical: Joi.boolean().optional().default(false),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional(),
  description: Joi.string().optional().allow('', null),
  dueDate: Joi.string().optional().allow('', null),
  dueTime: Joi.string().optional().allow('', null),
  endTime: Joi.string().optional().allow('', null),
  priority: Joi.string().valid('low', 'medium', 'high', 'critical').optional(),
  isCritical: Joi.alternatives().try(
    Joi.boolean(),
    Joi.string().valid('true', 'false').custom((value) => value === 'true')
  ).optional(),
  isCompleted: Joi.alternatives().try(
    Joi.boolean(),
    Joi.string().valid('true', 'false').custom((value) => value === 'true')
  ).optional(),
  displayOrder: Joi.number().integer().optional(),
}).unknown(true); // Allow unknown fields to pass through
