import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion {
  id: number | string;
  text: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  marks: number;
  answer?: string;
}

export interface ISection {
  id: string;
  title: string;
  questionType: string;
  instruction: string;
  questions: IQuestion[];
}

export interface IGenerationResult extends Document {
  assignmentId: mongoose.Types.ObjectId;
  paperTitle: string;
  subject: string;
  className: string;
  timeAllowed: number;
  totalMarks: number;
  sections: ISection[];
  createdAt: Date;
}

const QuestionSchema = new Schema({
  id: { type: Schema.Types.Mixed, required: true },
  text: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Moderate', 'Challenging'], required: true },
  marks: { type: Number, required: true },
  answer: { type: String },
});

const SectionSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  questionType: { type: String, required: true },
  instruction: { type: String, required: true },
  questions: [QuestionSchema],
});

const GenerationResultSchema = new Schema<IGenerationResult>({
  assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true, unique: true },
  paperTitle: { type: String, required: true },
  subject: { type: String, required: true },
  className: { type: String, required: true },
  timeAllowed: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  sections: [SectionSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IGenerationResult>('GenerationResult', GenerationResultSchema);
