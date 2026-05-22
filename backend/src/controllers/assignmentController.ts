import { Request, Response } from 'express';
import Assignment from '../models/Assignment';
import GenerationResult from '../models/GenerationResult';
import { enqueueGenerationJob } from '../services/jobService';

export const createAssignment = async (req: Request, res: Response) => {
  try {
    const { title, subject, className, topic, examType, dueDate, questionTypes, additionalInfo, fileContent } = req.body;

    const newAssignment = new Assignment({
      title: title || `${subject} Assessment`,
      subject,
      className,
      topic,
      examType,
      dueDate,
      questionTypes,
      additionalInfo,
      fileContent,
      status: 'queued',
    });

    await newAssignment.save();

    const jobId = await enqueueGenerationJob(newAssignment.id, {
      title: newAssignment.title,
      subject,
      className,
      topic,
      questionTypes,
      additionalInfo,
      fileContent,
    });

    newAssignment.jobId = jobId;
    await newAssignment.save();

    res.status(201).json({ assignmentId: newAssignment.id, jobId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const regenerateAssignment = async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    assignment.status = 'queued';
    await assignment.save();

    const jobId = await enqueueGenerationJob(assignment.id, {
      title: assignment.title,
      subject: assignment.subject,
      className: assignment.className,
      topic: assignment.topic,
      examType: assignment.examType,
      questionTypes: assignment.questionTypes,
      additionalInfo: assignment.additionalInfo,
      fileContent: assignment.fileContent,
    });

    assignment.jobId = jobId;
    await assignment.save();

    // delete previous result
    await GenerationResult.findOneAndDelete({ assignmentId: assignment.id });

    res.json({ jobId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAssignments = async (req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find().sort({ assignedOn: -1 });
    res.json(assignments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAssignmentById = async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    let result = null;
    if (assignment.status === 'completed') {
      result = await GenerationResult.findOne({ assignmentId: assignment.id });
    }

    res.json({ assignment, result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    await GenerationResult.findOneAndDelete({ assignmentId: req.params.id });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
