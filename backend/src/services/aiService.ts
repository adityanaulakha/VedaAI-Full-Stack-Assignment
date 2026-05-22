import Anthropic from '@anthropic-ai/sdk';
import { OpenAI } from 'openai';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

const aiProvider = process.env.AI_PROVIDER || 'gemini';

// Zod schema for validation
export const GenerationSchema = z.object({
  paperTitle: z.string(),
  subject: z.string(),
  className: z.string(),
  examType: z.string().optional(),
  timeAllowed: z.number(),
  totalMarks: z.number(),
  sections: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      questionType: z.string(),
      instruction: z.string(),
      questions: z.array(
        z.object({
          id: z.union([z.number(), z.string()]),
          text: z.string(),
          difficulty: z.enum(['Easy', 'Moderate', 'Challenging']),
          marks: z.number(),
          answer: z.string().optional(),
        })
      ),
    })
  ),
});

const generateMockData = (params: any) => {
  const { title, subject, className, questionTypes } = params;

  let totalMarks = 0;
  const sections = questionTypes.map((qt: any, index: number) => {
    const sectionId = String.fromCharCode(65 + index); // A, B, C...
    const questions = Array.from({ length: qt.count }).map((_, qIndex) => {
      totalMarks += qt.marks;
      return {
        id: qIndex + 1,
        text: `Mock question ${qIndex + 1} for ${qt.type} related to ${subject} class ${className}.`,
        difficulty: qIndex % 3 === 0 ? 'Easy' : qIndex % 3 === 1 ? 'Moderate' : 'Challenging',
        marks: qt.marks,
        answer: `Mock answer ${qIndex + 1} for ${qt.type}.`,
      };
    });

    return {
      id: sectionId,
      title: `Section ${sectionId}`,
      questionType: qt.type,
      instruction: `Attempt all questions. Each question carries ${qt.marks} marks.`,
      questions,
    };
  });

  return {
    paperTitle: title || `${subject} Assessment`,
    subject,
    className,
    examType: params.examType,
    timeAllowed: 180, // Default 3 hours
    totalMarks,
    sections,
  };
};

export const generateQuestions = async (params: any, retryError?: string): Promise<any> => {
  const isMockMode = process.env.USE_MOCK === 'true';

  if (isMockMode) {
    console.log('🤖 Running in MOCK mode');
    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const mockData = generateMockData(params);
    return GenerationSchema.parse(mockData);
  }

  console.log(`🧠 Running in LLM mode using provider: ${aiProvider}`);

  const systemPrompt = `You are an expert educational assessment designer for Indian schools following CBSE/NCERT curriculum. You create well-structured, pedagogically appropriate question papers. Respond ONLY with valid JSON. No markdown, no code fences, no explanation, no preamble. Just the raw JSON object.`;

  let userPrompt = `Generate a complete question paper with these specifications:
School: Delhi Public School, Sector-45, Noida
Assessment Title: ${params.title}
Subject: ${params.subject}
Class: ${params.className}
Topic/Chapter: ${params.topic || 'General'}
Time Allowed: 180 minutes
Maximum Marks: ${params.questionTypes.reduce((acc: number, qt: any) => acc + (qt.count * qt.marks), 0)}
Additional Instructions: ${params.additionalInfo || 'None'}

Question Types Required:
${params.questionTypes.map((qt: any) => `- ${qt.type}: ${qt.count} questions, ${qt.marks} marks each`).join('\n')}

Organize questions into sections (Section A, Section B etc) by question type.
Each question must have difficulty: Easy, Moderate, or Challenging.
Include complete answers in the answer key.

Return this exact JSON structure:
{
  "paperTitle": "string", // Must be exactly the Assessment Title without the school name and WITHOUT any academic year (e.g., remove 2023-24)
  "subject": "string",
  "className": "string",
  "timeAllowed": number,
  "totalMarks": number,
  "sections": [
    {
      "id": "A",
      "title": "string",
      "questionType": "string",
      "instruction": "string",
      "questions": [
        {
          "id": 1,
          "text": "string",
          "difficulty": "Easy",
          "marks": number,
          "answer": "string"
        }
      ]
    }
  ]
}`;

  if (retryError) {
    userPrompt += `\n\nWARNING: Your previous response failed validation. Please fix the following errors and return strictly valid JSON:\n${retryError}`;
  }

  let content = '';

  if (aiProvider === 'gemini') {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPrompt }] }
      ]
    });
    content = response.text || '';
  } else if (aiProvider === 'openai') {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
      model: 'gpt-5.5',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' }
    });
    content = response.choices[0].message.content || '';
  } else if (aiProvider === 'anthropic') {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: 'claude-4.5-sonnet',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt }
      ],
    });
    content = (response.content[0] as any).text;
  } else {
    throw new Error(`Unsupported AI provider: ${aiProvider}`);
  }

  // Extract JSON if model wrapped it in markdown
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON object found in response');
  }

  const parsed = JSON.parse(jsonMatch[0]);
  parsed.examType = params.examType;
  return GenerationSchema.parse(parsed); // Throws ZodError if invalid
};
