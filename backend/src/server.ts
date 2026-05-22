import 'dotenv/config';
import http from 'http';
import app from './app';
import { connectDB } from './config/db';
import { setupWebSocketServer } from './websocket/wsServer';
import { startWorker } from './workers/generationWorker';

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Create HTTP server
    const server = http.createServer(app);

    // 3. Setup WebSocket server for real-time progress
    setupWebSocketServer(server);

    // 4. Start BullMQ worker
    startWorker();

    // 5. Listen
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
