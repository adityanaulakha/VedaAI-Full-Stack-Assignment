import express from 'express';
import cors from 'cors';
import assignmentRoutes from './routes/assignments';

const app = express();

// Allow all origins for the sake of the assignment and easy deployment
app.use(cors());

app.use(express.json({ limit: '10mb' }));

app.use('/api/assignments', assignmentRoutes);

app.get('/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
