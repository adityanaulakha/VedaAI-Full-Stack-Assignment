import { WebSocketServer, WebSocket } from 'ws';
import { Server, IncomingMessage } from 'http';

// Store clients mapped to their requested jobId rooms
const rooms = new Map<string, Set<WebSocket>>();

export const setupWebSocketServer = (server: Server) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL,
  ].filter(Boolean) as string[];

  const wss = new WebSocketServer({ 
    server, 
    path: '/ws',
    verifyClient: (info: { origin: string; secure: boolean; req: IncomingMessage }, cb: (res: boolean, code?: number, message?: string) => void) => {
      cb(true);
    }
  });

  server.on('upgrade', (request, socket, head) => {
    console.log('Backend received HTTP Upgrade request for:', request.url);
  });

  wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    // Parse URL to get jobId: ws://localhost:4000/ws?jobId=XXX
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const jobId = url.searchParams.get('jobId');

    if (jobId) {
      if (!rooms.has(jobId)) {
        rooms.set(jobId, new Set());
      }
      rooms.get(jobId)!.add(ws);
      console.log(`📡 Client joined room: ${jobId}`);

      ws.on('close', () => {
        rooms.get(jobId)?.delete(ws);
        if (rooms.get(jobId)?.size === 0) {
          rooms.delete(jobId);
        }
        console.log(`📡 Client left room: ${jobId}`);
      });
    } else {
      ws.close(1008, 'jobId is required');
    }
  });

  console.log('📡 WebSocket server initialized on /ws');
};

/**
 * Emit event to all clients in a specific jobId room
 */
export const emitToRoom = (jobId: string, event: any) => {
  const clients = rooms.get(jobId);
  if (clients) {
    const payload = JSON.stringify(event);
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }
};
