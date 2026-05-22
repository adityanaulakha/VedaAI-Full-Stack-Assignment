import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestionType {
  type: string;
  count: number;
  marks: number;
}

export interface IAssignment extends Document {
  title: string;
  subject: string;
  className: string;
  topic?: string;
  dueDate: Date;
  questionTypes: IQuestionType[];
  additionalInfo?: string;
  fileContent?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  assignedOn: Date;
  jobId?: string;
}

const QuestionTypeSchema = new Schema({
  type: { type: String, required: true },
  count: { type: Number, required: true },
  marks: { type: Number, required: true },
});

const AssignmentSchema = new Schema<IAssignment>({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  className: { type: String, required: true },
  topic: { type: String },
  dueDate: { type: Date, required: true },
  questionTypes: [QuestionTypeSchema],
  additionalInfo: { type: String },
  fileContent: { type: String }, // Can store basic text from file if needed
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  assignedOn: { type: Date, default: Date.now },
  jobId: { type: String },
});

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);
