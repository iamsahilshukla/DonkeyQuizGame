// src/sockets/game.socket.ts
import { Server } from 'socket.io';
import { sessionService } from '../services/SessionManager';
import { randomUUID } from 'crypto';

export function initializeGameSocket(io: Server) {
  io.on('connection', (socket) => {
    console.log('User Joined');
    socket.on('join_session', async (data) => {
      const { roomId, username } = JSON.parse(data);

      try {
        socket.join(roomId);

        const participant = {
          id: randomUUID(),
          name: username,
          score: 0,
          socketId: socket.id,
        };
        const session = sessionService.joinSession(roomId, participant);

        console.log('Session joined:', roomId, participant.name);

        io.emit('session_joined', participant.name);

        io.emit('participant_joined', participant);
      } catch (error) {
        socket.emit('error', 'Failed to join session');
      }
    });

    socket.on('submit_answer', ({ roomId, answer }) => {
      const leaderboard = sessionService.submitAnswer(
        roomId,
        socket.id,
        answer
      );
      io.emit('leaderboard_update', leaderboard);
    });

    socket.on('start_game', async (data) => {
      const { roomId } = JSON.parse(data);

      const session = sessionService.getSession(roomId);
      session.isActive = true;

      for (const [index, question] of session.questions.entries()) {
        session.currentQuestionIndex = index;
        socket.broadcast.emit('new_question', question);

        await new Promise((resolve) =>
          setTimeout(resolve, question.timeLimit * 1000)
        );
      }

      io.emit('game_ended', session.leaderboard);
      sessionService.endSession(roomId);
    });

    socket.on('disconnect', () => {
      // Handle disconnection logic
    });
  });
}
