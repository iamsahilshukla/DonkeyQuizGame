// src/app.ts
import express from 'express';
import cors from 'cors';
import { router as adminRouter } from './routes/admin.routes';
import { sessionRouter } from './routes/session.routes';
// import { errorHandler } from './middleware/error.middleware';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin', adminRouter);
app.use('/api/session', sessionRouter);

// Error handling
// app.use(errorHandler);

export default app;
