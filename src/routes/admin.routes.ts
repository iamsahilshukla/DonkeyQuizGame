import { Router } from 'express';
import {
  createQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
} from '../controllers/admin.controller';
import { validate } from '../utils/validation';
import { createQuestionSchema } from '../utils/validation';

const router = Router();

// Question CRUD operations
router.post('/questions', validate(createQuestionSchema), createQuestion);
router.get('/questions', getQuestions);
router.put('/questions/:id', validate(createQuestionSchema), updateQuestion);
router.delete('/questions/:id', deleteQuestion);

export { router };
