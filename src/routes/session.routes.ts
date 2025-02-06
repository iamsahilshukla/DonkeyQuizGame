import { Router } from 'express';
import { sessionService } from '../services/SessionManager';
import { Question } from '../models/QuizQuestion';

const router = Router();

// Create new game session
router.post('/create', async (req, res): Promise<any> => {
  try {
    const { questionIds } = req.body;
    const questions = await Question.find({ _id: { $in: questionIds } });

    if (questions.length === 0) {
      return res.status(400).json({ error: 'No valid questions provided' });
    }

    const roomId = sessionService.createSession(questions);
    res.json({ roomId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Validate room ID
router.get('/validate/:roomId', (req, res) => {
  const { roomId } = req.params;
  try {
    const isValid = sessionService.getSession(roomId) !== undefined;
    res.json({ isValid });
  } catch (e) {
    res.status(400).json({ error: 'Invalid session' });
  }
});

export { router as sessionRouter };
