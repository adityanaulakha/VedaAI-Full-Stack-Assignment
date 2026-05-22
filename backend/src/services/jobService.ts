import { generationQueue } from '../config/bullmq';

export const enqueueGenerationJob = async (
  assignmentId: string,
  data: {
    title: string;
    subject: string;
    className: string;
    topic?: string;
    questionTypes: any[];
    additionalInfo?: string;
    fileContent?: string;
  }
) => {
  const job = await generationQueue.add('generate-paper', {
    assignmentId,
    ...data,
  });
  return job.id;
};
