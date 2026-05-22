import { Queue } from 'bullmq';
import { redisConnection } from './redis';

export const generationQueue = new Queue('generation-queue', {
  connection: redisConnection,
});
