import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis';
import Assignment from '../models/Assignment';
import GenerationResult from '../models/GenerationResult';
import { generateQuestions } from '../services/aiService';
import { emitToRoom } from '../websocket/wsServer';

export const startWorker = () => {
  const worker = new Worker(
    'generation-queue',
    async (job) => {
      const { assignmentId, title, subject, className, topic, questionTypes, additionalInfo } = job.data;
      
      console.log(`[Worker] Started job ${job.id} for assignment ${assignmentId}`);
      
      try {
        await Assignment.findByIdAndUpdate(assignmentId, { status: 'processing', jobId: job.id });
        
        await job.updateProgress(10);
        emitToRoom(job.id!, { type: 'JOB_STATUS', status: 'processing', progress: 10, message: 'Building prompt...' });

        let generatedData;
        try {
          await job.updateProgress(40);
          emitToRoom(job.id!, { type: 'JOB_STATUS', status: 'processing', progress: 40, message: 'Generating questions...' });
          
          generatedData = await generateQuestions({ title, subject, className, topic, questionTypes, additionalInfo });
        } catch (err: any) {
          console.warn(`[Worker] First attempt failed: ${err.message}. Retrying...`);
          await job.updateProgress(50);
          emitToRoom(job.id!, { type: 'JOB_STATUS', status: 'processing', progress: 50, message: 'Retrying generation...' });
          
          // Retry once with error message
          generatedData = await generateQuestions({ title, subject, className, topic, questionTypes, additionalInfo }, err.message);
        }

        await job.updateProgress(80);
        emitToRoom(job.id!, { type: 'JOB_STATUS', status: 'processing', progress: 80, message: 'Structuring paper...' });

        // Save result
        const result = new GenerationResult({
          assignmentId,
          ...generatedData,
        });
        await result.save();

        await Assignment.findByIdAndUpdate(assignmentId, { status: 'completed' });

        await job.updateProgress(100);
        emitToRoom(job.id!, { type: 'JOB_COMPLETE', status: 'done', progress: 100, result });
        console.log(`[Worker] Completed job ${job.id}`);
        
        return result;
      } catch (error: any) {
        console.error(`[Worker] Job ${job.id} failed:`, error);
        await Assignment.findByIdAndUpdate(assignmentId, { status: 'failed' });
        emitToRoom(job.id!, { type: 'JOB_FAILED', status: 'error', error: error.message || 'Generation failed' });
        throw error;
      }
    },
    { connection: redisConnection }
  );

  worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed with error ${err.message}`);
  });

  console.log('👷 Worker started');
};
