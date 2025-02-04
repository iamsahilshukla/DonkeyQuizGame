// src/types/types.ts
export interface Question {
  text: string;
  options: string[];
  correctAnswer: string;
  timeLimit: number;
  points: number;
}

export interface Session {
  roomId: string;
  participants: Map<string, Participant>;
  questions: Question[];
  currentQuestionIndex: number;
  leaderboard: LeaderboardEntry[];
  isActive: boolean;
  createdAt: number;
}

export interface Participant {
  id: string;
  name: string;
  score: number;
  socketId: string;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
}
