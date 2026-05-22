import { Request, Response } from 'express';
import GenerationResult from '../models/GenerationResult';
import Assignment from '../models/Assignment';
import { generatePdfFromHtml } from '../services/pdfService';

export const downloadPdf = async (req: Request, res: Response): Promise<void> => {
  try {
    const assignmentId = req.params.id;
    const result = await GenerationResult.findOne({ assignmentId });
    const assignment = await Assignment.findById(assignmentId);

    if (!result || !assignment) {
      res.status(404).json({ error: 'Result not found' });
      return;
    }

    // Build simple HTML layout for Puppeteer
    const html = `
      <html>
        <head>
          <style>
            body { font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.5; color: #1a1a1a; }
            .header { text-align: center; margin-bottom: 2rem; }
            .school-name { font-size: 24px; font-weight: bold; margin-bottom: 0.5rem; }
            .subject-class { font-size: 18px; margin-bottom: 1rem; }
            .meta { display: flex; justify-content: space-between; font-weight: bold; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .instructions { font-style: italic; margin-bottom: 20px; text-align: center; }
            .student-info { margin-bottom: 30px; }
            .student-info-line { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .section { margin-top: 30px; }
            .section-title { font-weight: bold; font-size: 18px; text-align: center; margin-bottom: 5px; }
            .section-instruction { font-style: italic; text-align: center; margin-bottom: 20px; }
            .question { display: flex; justify-content: space-between; margin-bottom: 15px; }
            .q-text { flex-grow: 1; margin-right: 15px; }
            .q-marks { white-space: nowrap; font-weight: bold; }
            .end { text-align: center; font-weight: bold; margin: 40px 0; border-top: 1px dashed #ccc; padding-top: 20px; }
            
            .page-break { page-break-before: always; }
            .answer-key-title { font-size: 20px; font-weight: bold; margin-bottom: 20px; text-align: center; }
            .answer { margin-bottom: 15px; }
            .answer-id { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="school-name">Delhi Public School, Bokaro Steel City</div>
            <div class="subject-class">${result.subject} - ${result.className}</div>
          </div>
          
          <div class="meta">
            <span>Time Allowed: ${result.timeAllowed} minutes</span>
            <span>Maximum Marks: ${result.totalMarks}</span>
          </div>

          <div class="instructions">All questions are compulsory unless stated otherwise.</div>

          <div class="student-info">
            <div class="student-info-line">
              <span>Name: _______________________________</span>
              <span>Roll Number: _________________</span>
              <span>Section: _______</span>
            </div>
          </div>

          ${result.sections.map(sec => `
            <div class="section">
              <div class="section-title">${sec.title}</div>
              <div class="section-instruction">${sec.instruction}</div>
              ${sec.questions.map(q => `
                <div class="question">
                  <div class="q-text"><strong>Q${q.id}.</strong> ${q.text}</div>
                  <div class="q-marks">[${q.marks}]</div>
                </div>
              `).join('')}
            </div>
          `).join('')}

          <div class="end">End of Question Paper</div>

          <div class="page-break"></div>
          <div class="answer-key-title">Answer Key</div>
          ${result.sections.map(sec => `
            <div class="section-title">${sec.title}</div>
            ${sec.questions.map(q => `
              <div class="answer">
                <span class="answer-id">Q${q.id}.</span> ${q.answer || 'No answer provided'}
              </div>
            `).join('')}
          `).join('')}
        </body>
      </html>
    `;

    const pdfBuffer = await generatePdfFromHtml(html);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="QuestionPaper_${result.subject.replace(/\\s+/g, '_')}.pdf"`);
    res.send(pdfBuffer);
  } catch (error: any) {
    console.error('PDF Generation error:', error);
    res.status(500).json({ error: error.message });
  }
};
