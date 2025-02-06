// src/sockets/game.socket.ts
import { Server } from 'socket.io';
import { sessionService } from '../services/SessionManager';
import { randomUUID } from 'crypto';

interface ChatMessage {
  username: string;
  message: string;
  timestamp: number;
}

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

        sessionService.joinSession(roomId, participant);

        socket.emit('session_joined', participant.name);

        socket.broadcast.emit('participant_joined', participant);
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

    // Add new chat event handler
    socket.on('send_message', (data) => {
      const { roomId, username, message } = JSON.parse(data);
      
      const chatMessage: ChatMessage = {
        username,
        message,
        timestamp: Date.now()
      };

      // Broadcast the message to all users in the room
      io.to(roomId).emit('new_message', chatMessage);
    });

    socket.on('disconnect', () => {
      io.emit('participant_left', socket.id);
    });
  });
}
