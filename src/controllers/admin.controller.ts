import { Request, Response } from 'express';
import { Question } from '../models/QuizQuestion';

export const createQuestion = async (req: Request, res: Response) => {
  try {
    console.log('------>createQuestion', req.body);
    const question = new Question(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ error: 'Invalid question data' });
  }
};

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateQuestion = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json(question);
  } catch (error) {
    res.status(400).json({ error: 'Update failed' });
  }
};

export const deleteQuestion = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Deletion failed' });
  }
};
