import { NextFunction, Request, Response } from 'express';
import { z, ZodSchema } from 'zod';

export const createQuestionSchema = z.object({
  text: z.string().min(10),
  options: z.array(z.string().min(1)).length(4),
  correctAnswer: z.string().min(1),
  timeLimit: z.number().min(10).max(120),
  points: z.number().min(50).max(500),
});

export const joinSessionSchema = z.object({
  roomId: z.string().length(6),
  username: z.string().min(3).max(20),
});

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({
        error: 'Validation failed',
        // details: error.errors,
      });
    }
  };
