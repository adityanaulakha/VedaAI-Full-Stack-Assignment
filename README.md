# VedaAI Assignment System

## 1. Project Overview
VedaAI Assignment System is a full-stack web application designed for educators to easily create AI-generated assessments tailored to the Indian CBSE/NCERT curriculum. By entering details like subject, class, topics, and question types, the system generates a structured question paper with varying difficulty levels and an answer key. It supports downloading the final paper as a PDF.

## 2. Architecture & Tech Stack
The project is built using a modern, scalable stack, separated into a distinct frontend and backend within a monorepo structure.

**Frontend:**
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- State Management: Zustand
- PDF Generation: `html2pdf.js` (Client-side)

**Backend:**
- Framework: Node.js with Express
- Language: TypeScript
- Database: MongoDB Atlas (via Mongoose)
- Job Queue/Cache: BullMQ & Upstash Redis
- WebSocket: `ws` (for real-time generation progress updates)
- AI Integration: Anthropic Claude (Primary), Google Gemini, OpenAI, and a Mock Data fallback

## 3. Features
- **AI-Powered Generation:** Leverages advanced LLMs to generate CBSE/NCERT compliant question papers.
- **Asynchronous Processing:** Long-running AI generation jobs are handled asynchronously using BullMQ.
- **Real-time Progress:** WebSocket integration streams progress updates (queued, processing, completed) directly to the UI.
- **Client-Side PDF Export:** Users can download the generated question papers perfectly formatted as PDFs using `html2pdf.js`, eliminating server-side rendering bottlenecks.
- **Regenerate Functionality:** Easily re-trigger AI generation if the output is unsatisfactory.
- **Dynamic Form Builder:** A clean, multi-step React form to configure the assessment.

## 4. The Async Job System (How it Works)

This is a critical architectural decision in VedaAI. Understanding WHY the async system exists is key to understanding the codebase and scaling AI applications.

### Why not just call the LLM directly in the API route?
An LLM call typically takes 5–15 seconds to generate a full question paper. HTTP requests timeout after ~30s and feel broken to the user. If you call the LLM directly inside the Express route handler, you introduce three major problems:
1. The user stares at a spinner with no feedback for 10+ seconds.
2. If the connection drops, the generation is lost entirely — no retry mechanism.
3. If 10 teachers submit at once, 10 LLM calls run in parallel, causing immediate rate limits and server memory spikes.

### How BullMQ fixes this

- **Queue:** When the API receives a form submit, it immediately adds a job to the BullMQ queue and returns a `{jobId}` to the frontend. The API response is instant — no waiting.
- **Worker:** A separate background process (`generationWorker.ts`) runs continuously, pulling jobs from the queue one at a time. It performs the slow work: prompt building, LLM execution, parsing, and database saving.
- **Redis:** BullMQ stores the job state in Redis. If the server crashes mid-generation, the job remains safely in Redis and gets retried automatically when the server restarts.

### WebSocket Real-time Updates
The worker emits progress events to the WebSocket server as it runs. The frontend receives these events in real time — updating the progress bar and status text seamlessly without polling the API.

- **Job Lifecycle States:** `queued` → `processing` → `completed` (or `failed`)
Each state is stored in both MongoDB (`Assignment.status`) and BullMQ/Redis (`job.state`). The frontend only learns about state changes via WebSocket events; it never polls the API for job status.

- **WebSocket Room System:** When a frontend connects with `?jobId=abc123`, the WS server stores that socket in a map: `rooms["abc123"] = [socket]`. When the worker finishes job `abc123`, it only sends the `JOB_COMPLETE` event to sockets inside `rooms["abc123"]`. This ensures multiple teachers can watch different generation jobs simultaneously, only receiving their own updates.

## 5. Setup & Local Development
### Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster URL (or local instance)
- Redis instance (Upstash recommended)
- AI Provider API Key (Anthropic, Gemini, or OpenAI)

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Copy the environment file and update variables: `cp .env.example .env`
4. Run the development server: `npm run dev`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Copy the environment file: `cp .env.example .env.local`
4. Run the development server: `npm run dev`

Both the Next.js app (http://localhost:3000) and the backend API (http://localhost:4000) will now be running.

## 6. Deployment Guide
The architecture is designed to be fully deployable with zero local infrastructure.

**Backend Deployment (Railway):**
1. Connect your GitHub repository to Railway.
2. Select the `backend` directory as the root folder for the backend service.
3. Railway will auto-detect the `package.json` scripts (`build` and `start`) and the `Procfile`.
4. Add all environment variables (MongoDB URI, Upstash Redis URL, AI Keys, FRONTEND_URL).
5. Deploy.

**Frontend Deployment (Vercel):**
1. Connect your GitHub repository to Vercel.
2. Set the Framework Preset to Next.js and the Root Directory to `frontend`.
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL`: Your deployed Railway backend URL (e.g., https://your-backend.railway.app/api)
   - `NEXT_PUBLIC_WS_URL`: Your deployed Railway WebSocket URL (e.g., wss://your-backend.railway.app)
4. Deploy.

## 7. API Documentation

### Create Assignment
`POST /api/assignments`
- **Body:** `{ title, subject, className, topic, questionTypes, additionalInfo }`
- **Response:** `{ assignmentId: "string", jobId: "string" }`
- **Description:** Stores the assignment request and queues a BullMQ job for AI generation.

### Regenerate Assignment
`POST /api/assignments/:id/regenerate`
- **Response:** `{ jobId: "string" }`
- **Description:** Clears the previous result and queues a new AI generation job for the existing assignment.

### Get Assignments
`GET /api/assignments`
- **Response:** Array of assignment objects.
- **Description:** Fetches all past and pending assignments.

### WebSocket Connection
`ws://<backend_url>/ws?jobId=<jobId>`
- **Description:** Connect to receive real-time JSON events (`{ type: "status", status: "processing", progress: 50, message: "..." }`) about job progress.

## 8. Known Limitations & Future Improvements
- **Rate Limiting:** AI generation is currently bounded by the underlying LLM provider's rate limits. Future improvements could include fallback providers or enhanced queuing strategies.
- **PDF Formatting:** Client-side HTML-to-PDF is subject to varying browser rendering engines. For complex multi-page tables, slight margin discrepancies might occur.
- **Authentication:** The app currently mocks a fixed user ("Lakshya Sharma"). Integrating NextAuth.js or Clerk is a planned future improvement.
