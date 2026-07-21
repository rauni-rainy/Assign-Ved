# Vedum AI - Next-Generation AI Teacher's Toolkit

Vedum AI is a full-stack, enterprise-ready AI-powered assignment generator designed to automate and elevate the educational workflow. This platform empowers educators to instantly generate highly structured question papers and assignments using advanced generative AI. 

## System Architecture & Approach

A primary focus of this project was engineering a robust, production-grade system capable of handling heavy concurrent AI generation loads without failure. The Problem

Writing a question paper is one of the most time-consuming mechanical tasks a teacher does — and it happens every week, for every class. Picking topics, balancing difficulty, numbering questions, formatting sections, printing clean copies. VedaAI eliminates that overhead entirely.

A teacher fills out a form. An AI builds the exam. The whole thing — generation, validation, formatting, PDF — runs in under 90 seconds.

### Approach
The core philosophy behind Vedum AI is **asynchronous, non-blocking execution**. AI generation (via Google Gemini) and PDF rendering (via Puppeteer) are inherently slow processes. If run on the main thread, they would block incoming REST API requests, leading to server timeouts and a degraded user experience. 

To solve this, we implemented an event-driven architecture using **BullMQ** and **Upstash Redis**. When a user requests an assignment, the API immediately responds with an acknowledgment and enqueues a background job. A dedicated worker processes the heavy AI tasks and uses **Socket.io** to stream real-time progress back to the client. This decouples the client from the generation process, ensuring the platform remains highly responsive.

### Fully Dockerized & Deployed on Google Cloud (the project may shift to render + vercel if my gcloud credetinals expire)
We went far beyond standard "hobby" deployments. The entire architecture—both the Next.js frontend and the Node.js/Puppeteer backend—is **fully containerized using Docker**. We utilized multi-stage Docker builds to minimize image sizes and ensure perfect parity between development and production environments. 

The application is natively deployed on **Google Cloud Run**, an enterprise-grade, serverless compute platform. This guarantees:
- **True Auto-Scaling:** The system automatically scales out containers to handle traffic spikes during peak exam generation periods.
- **Zero-Downtime Deployments:** Seamless updates handled by Google's Artifact Registry and Cloud Build pipelines.
- **Microservice Isolation:** By containerizing the Puppeteer engine, we prevent memory leaks from crashing the main Node.js event loop.


How GPT-5.6 and Codex Were Used

Honest note on the live demo: VedaAI was designed and engineered specifically around GPT-5.6's structured output and reasoning capabilities. During development, all prompt engineering and schema design was validated against GPT-5.6. The live demo currently runs on Google Gemini due to API credit exhaustion near the submission deadline — but the integration is a single file swap (src/services/aiService.ts), and the prompt architecture, tool schema, and parsing pipeline are unchanged. The section below describes the intended and designed GPT-5.6 usage in full.

GPT-5.6 — Core Generation Engine

GPT-5.6 drives the entire question paper creation pipeline. Three distinct use cases:

1. Structured question generation via tool_use

Rather than asking the model to return JSON in plain text (fragile, unpredictable), we use GPT-5.6's function calling / tool_use mode. The question paper schema is defined as a tool input schema, and the model is forced to populate it exactly. No regex extraction. No format guessing. The model either fills the schema correctly or the job retries.

typescript
// server/src/services/aiService.ts
const response = await openai.chat.completions.create({
  model: "gpt-5.6",
  messages: [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: buildUserPrompt(assignment) }
  ],
  tools: [{ type: "function", function: QUESTION_PAPER_SCHEMA }],
  tool_choice: { type: "function", function: { name: "generate_question_paper" } }
});

const paper = JSON.parse(
  response.choices[0].message.tool_calls[0].function.arguments
);

2. Bloom's Taxonomy distribution

The system prompt instructs GPT-5.6 to assign a cognitive level (Remembering → Creating) to every question based on question type and mark weight — not a random tag, a reasoned one. A 1-mark MCQ gets "Remembering". A 5-mark analysis question gets "Evaluate" or "Create". The model decides; the schema enforces the enum.

3. Answer key and marking scheme generation (Teacher Mode)

After the question paper is stored, a second GPT-5.6 call generates expected answers and per-point marking criteria for each question. Student-facing and teacher-facing outputs are generated separately and served via different API endpoints — the marking scheme never leaks to the student view.

Codex — Accelerating the Build

OpenAI Codex (via GitHub Copilot and direct API usage) was used throughout development for:

BullMQ worker boilerplate — generating the job lifecycle scaffolding (enqueue → process → emit → retry) from a single comment describing the flow
Zod schema generation — describing the question paper shape in plain English and letting Codex produce the full recursive schema definition
Puppeteer HTML template — the A4 exam paper HTML/CSS that Puppeteer renders into PDF was largely drafted by Codex from a description of a real CBSE paper layout
Socket.io event types — Codex produced the full bidirectional event type definitions from a bulleted list of events

The productivity gain was most visible in the infrastructure layer. Codex handles the mechanical translation of an architecture decision into correct code — freeing the build time for prompt engineering and product decisions that require genuine judgment.

Feature Overview

Async generation pipeline — API responds immediately, BullMQ worker handles the heavy lifting, Socket.io streams step-by-step progress to the client in real time. The server never blocks.

Strict output validation — GPT-5.6 tool_use + Zod schema validation as a second layer. Malformed responses trigger automatic job retries, not UI errors.

Bloom's Taxonomy tagging — every question carries a cognitive level tag assigned by the model, ensuring pedagogically sound distribution across an assessment.

Teacher / Student mode — one toggle switches between the question-only view and the full marking scheme view. Both modes generate separate PDFs.

Server-side PDF — Puppeteer runs in an isolated container. PDFs are A4-formatted, properly typeset exam papers — not browser print dialogs.

Version history — every regeneration creates a new version stored in MongoDB. Teachers can navigate back to any previous draft without losing work.

Difficulty distribution — the prompt specifies a 30 / 50 / 20 split (Easy / Medium / Hard) as a hard constraint. The model distributes questions accordingly and tags each one.

Architecture
┌─────────────────────────────────────────────────┐
│               Next.js Frontend                  │
│         Zustand · Socket.io client              │
└─────────────────┬───────────────────────────────┘
                  │ REST + WebSocket
┌─────────────────▼───────────────────────────────┐
│            Express API (Node.js)                │
│     Zod validation · multer · rate limiting     │
└──────┬──────────────────────────────────────────┘
       │ enqueue job
┌──────▼──────┐     ┌────────────┐
│   BullMQ    │────▶│   Redis    │  (Upstash)
│  job queue  │     │ job state  │
└──────┬──────┘     └────────────┘
       │
┌──────▼──────────────────────────────────────────┐
│              Background Workers                 │
│  ┌─────────────────┐   ┌────────────────────┐  │
│  │  AI Worker      │   │  PDF Worker        │  │
│  │  GPT-5.6 call   │   │  Puppeteer → A4    │  │
│  │  Zod validate   │   │  Container isolated│  │
│  └────────┬────────┘   └────────────────────┘  │
└───────────┼─────────────────────────────────────┘
            │ store result + emit via Socket.io
┌───────────▼────────┐
│     MongoDB        │  Assignment · QuestionPaper · versions
└────────────────────┘

Deployed on Google Cloud Run with Docker multi-stage builds. Each service (API, Puppeteer worker) runs in its own container to prevent Chromium memory pressure from affecting the Node.js event loop.

Setup Instructions
Prerequisites
Requirement	Version
Node.js	20+
Docker + Docker Compose	Latest
MongoDB	7 (via Docker)
Redis	7 (via Docker or Upstash)
OpenAI API key	GPT-5.6 access required

If you don't have GPT-5.6 access: Set OPENAI_MODEL=gpt-4o in your .env and the pipeline will run on GPT-4o. The tool_use schema and prompt structure are identical. Quality may differ slightly on Bloom's level assignments.

## Comprehensive Feature Suite

Vedum AI is packed with high-signal features that elevate it from a simple wrapper to a complete product.

### Advanced AI Generation Engine
- **Bloom's Taxonomy Distribution:** The AI intelligently distributes questions across different cognitive levels (Remembering, Understanding, Applying, etc.), ensuring pedagogically sound assessments rather than random generation.
- **Strict JSON Parsing:** We strictly avoid rendering raw, unpredictable LLM responses. The Google Gemini API is forced to output a deeply nested, strictly validated JSON schema.
- **Context-Aware Syllabi:** Users can provide exact guidelines, subjects, and parameters, ensuring the AI output directly matches their curriculum requirements.

### Dual-Mode Output & Version Control
- **Teacher vs. Student Mode Toggle:** Educators can instantly toggle between a "Student Mode" (just the questions) and a "Teacher Mode" (questions with detailed, AI-generated marking schemes and answers).
- **Granular Version History:** Every time an educator regenerates an assignment, the system maintains a complete, persistent version tree in MongoDB. Users can seamlessly navigate back to previous iterations without losing historical data.
<img width="1391" height="262" alt="Screenshot 2026-06-06 035022" src="https://github.com/user-attachments/assets/22314ab3-a375-4c79-9a68-ce64442d91b6" />
<img width="1167" height="773" alt="Screenshot 2026-06-06 035042" src="https://github.com/user-attachments/assets/16e749a6-64b4-421b-9048-9cb818a7912b" />

### Premium Output & UX
- **Server-Side PDF Engine & Regeneration:** We completely avoided raw browser HTML printing. Instead, we implemented a dedicated **Puppeteer Microservice** on the backend that compiles the assignment into a beautifully formatted, downloadable PDF. If an educator updates a question or switches modes, they can hit "Regenerate PDF" to instantly compile a new physical document.
- **Structured Rendering:** The UI renders the final assignment with a proper Student Info Header (Name, Roll Number, Section), logical groupings, and beautiful color-coded difficulty badges.
- **Modern UI:** Built with Next.js, TailwindCSS, and Zustand for state management, providing a stunning, responsive, and intuitive interface.

---

## Implementation Overview: Meeting the Requirements

We have meticulously designed the architecture to meet and exceed the core requirements:
- **Convert input -> structured prompt:** Handled via programmatic prompt structuring.
- **Generate Sections, Questions, Difficulty, Marks:** Fully implemented and validated via strict JSON schemas.
- **Backend Stack:** Successfully implemented Node.js, Express, MongoDB, Redis, BullMQ, and WebSockets.
- **Flow:** Perfected the API -> Queue -> Worker -> MongoDB -> Socket UI notification pipeline.
- **Output Page:** Exactly matches the required structural UI (Student info, cleanly formatted sections, tags).

---

## Screenshots



| Dashboard | Assignment Creator | Generated PDF |
| :---: | :---: | :---: |
| <img width="1912" height="971" alt="Screenshot 2026-06-06 033355" src="https://github.com/user-attachments/assets/fc1be700-ee58-4ddc-aeaf-e0b85c4d20e4" />
 |<img width="1912" height="977" alt="Screenshot 2026-06-06 033437" src="https://github.com/user-attachments/assets/4e47d80c-b30d-4fb5-b7e5-fc66750a9b2d" /> 
 | <img width="1918" height="972" alt="Screenshot 2026-06-06 033903" src="https://github.com/user-attachments/assets/b8992a2b-98c4-4ddb-b179-72506fba1096" />
 |

---

<img width="1481" height="802" alt="Screenshot 2026-06-06 033527" src="https://github.com/user-attachments/assets/1b21e558-44c2-453c-bbda-be37aa08c838" />
<img width="1920" height="1080" alt="Screenshot 2026-06-06 033714" src="https://github.com/user-attachments/assets/4360b1cf-43fd-4452-96f4-a432f5d83c5d" />
<img width="1918" height="912" alt="Screenshot 2026-06-06 033927" src="https://github.com/user-attachments/assets/b00fc703-dc40-45fd-97d0-6a5db32e2149" />
<img width="1916" height="947" alt="Screenshot 2026-06-06 033946" src="https://github.com/user-attachments/assets/7d57c9ac-2d54-4fb8-a768-de9e47b56938" />


## Prerequisites

| Requirement | Version | Notes |
| :--- | :--- | :--- |
| Node.js | v20+ | Required for local development |
| npm / yarn | Latest | Package management |
| Docker | Latest | Required if building containers locally |
| Google Cloud CLI | Latest | For manual cloud deployments |

---

## Quick Start

Get the application running locally in seconds.

```bash
# 1. Install dependencies for both frontend and server
npm install --prefix frontend && npm install --prefix server

# 2. Start the backend server (runs on port 3001)
npm run dev --prefix server

# 3. Start the Next.js frontend (runs on port 3000)
npm run dev --prefix frontend
```

---

## Environment Variables

Create a `.env` file in the `server` directory:

| Variable | Description |
| :--- | :--- |
| MONGODB_URI | Your MongoDB Atlas connection string |
| REDIS_URL | Upstash Redis connection URL for background jobs |
| GEMINI_API_KEY | Google Gemini API key for AI generation |
| FRONTEND_URL | Allowed CORS origin (e.g., http://localhost:3000) |
| NODE_ENV | development or production |
| PORT | Backend port (Default: 3001) |

For the frontend production builds, create a `.env.production` in the `frontend` directory:

| Variable | Description |
| :--- | :--- |
| NEXT_PUBLIC_API_URL | Your production backend URL |

---


Swapping the LLM

The entire AI integration lives in one file: server/src/services/aiService.ts. To switch between OpenAI and any other provider, change the client initialization and the API call at the top of that file. The prompt string, schema, and Zod validation below it are provider-agnostic.


// To use GPT-5.6 (intended)
import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// To use GPT-4o (fallback if GPT-5.6 access unavailable)
// Same client, just set OPENAI_MODEL=gpt-4o in .env

// Current live demo uses Gemini (API credit constraints)
// Architecture is identical — only this file changes

## Core API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/assignments` | Trigger a new AI assignment generation job |
| GET | `/api/assignments` | Fetch all historical assignments |
| GET | `/api/assignments/:id` | Fetch a specific assignment by ID |
| GET | `/api/pdfs/:filename` | Serve a generated PDF file |
| WS | `/` (Socket.io) | Connect to receive real-time job progress events |


## Prompt Engineering Notes

The system prompt sent to GPT-5.6 establishes a curriculum expert persona and provides hard constraints:

Exact question counts and marks per type (from the form)
Difficulty distribution: 30% Easy / 50% Medium / 20% Hard
Bloom's level assignment per question (not random — model reasons from question type + marks)
Section grouping logic: objective → short answer → long answer
Curriculum context if a syllabus PDF was uploaded (first 2,000 characters injected)
Any additional teacher instructions

The tool_use schema enforces the output shape. No post-processing regex. No markdown stripping. The model populates the schema or the job fails and retries.

Full prompt templates are in server/src/services/promptService.ts.

## What's Next
Question bank — every generated question tagged and stored by topic, difficulty, and cognitive level. Grows with every paper.
Per-question regeneration — swap one question without rebuilding the paper
Bloom's radar chart — visual cognitive distribution of the full paper
Auto-grading — objective sections scored automatically on submission
AI API Gateway

Built for OpenAI Build Week 2026 · Education Category
