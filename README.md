# VedaAI - Next-Generation AI Teacher's Toolkit

VedaAI is a full-stack, enterprise-ready AI-powered assignment generator designed to automate and elevate the educational workflow. This platform empowers educators to instantly generate highly structured question papers and assignments using advanced generative AI. 

## Implementation Overview: Meeting the Requirements

We have meticulously designed the architecture to meet and exceed the core requirements, focusing on scalability, reliability, and an exceptional user experience.

### 1. AI Question Generation
- **Structured Prompts:** The system converts user inputs and syllabus files into highly structured, system-instructed prompts using the Google Gemini API. 
- **Strict JSON Parsing:** We **strictly avoid rendering raw LLM responses**. The AI is forced to output a strictly validated JSON schema.
- **Hierarchical Output:** The generated data automatically includes defined Sections (A, B, etc.), Question Text, Difficulty Levels (Easy/Moderate/Hard), and precise Marks allocation.

### 2. Backend System Architecture
Built for high throughput and non-blocking asynchronous processing:
- **Core:** Node.js + Express (TypeScript).
- **Database:** MongoDB Atlas (Mongoose) is used to persistently store all generated assignments and their underlying data.
- **Queueing & Caching:** Upstash Redis powers our BullMQ implementation.
- **Background Workers (BullMQ):** Heavy AI generation and intensive PDF compilation tasks are offloaded to background workers, ensuring the main thread is never blocked.
- **Real-Time Updates (WebSocket):** Socket.io streams live progress events (e.g., "processing", "50%", "completed") directly to the frontend during background processing.

**The Execution Flow:**
1. API request is received via REST.
2. A unique job is added to the BullMQ queue in Redis.
3. A background worker picks up the job, streams progress, and communicates with the Gemini AI.
4. The generated JSON result is parsed and stored in MongoDB.
5. The Socket server notifies the frontend that the assignment is ready for rendering.

### 3. Output Page & UI/UX
The generated question paper is rendered in a highly structured, well-designed format inspired by real-world exam papers.
- **Student Info Header:** Includes standard input lines for Name, Roll Number, and Section.
- **Structured Sections:** Questions are grouped logically with specific titles and instructions.
- **Visual Indicators:** Clean formatting with color-coded difficulty badges (Easy/Moderate/Hard) and clearly displayed marks for each question.
- **Responsive UX:** A beautiful, glassmorphism-inspired UI built with Next.js, TailwindCSS, and Zustand for state management. Fully mobile responsive.

### 4. High-Signal Bonus Features
- **Server-Side PDF Generation:** We avoided raw browser HTML printing. Instead, we implemented a dedicated Puppeteer microservice on the backend that compiles the assignment into a perfectly formatted, downloadable PDF.
- **Dockerized & Cloud-Native:** The entire stack is fully containerized using Docker and deployed natively on Google Cloud Run for seamless auto-scaling.

---

## Screenshots

(Add your screenshots here. You can drag and drop images directly into GitHub)

| Dashboard | Assignment Creator | Generated PDF |
| :---: | :---: | :---: |
| [Screenshot 1 Placeholder] | [Screenshot 2 Placeholder] | [Screenshot 3 Placeholder] |

---

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

## Core API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/assignments` | Trigger a new AI assignment generation job |
| GET | `/api/assignments` | Fetch all historical assignments |
| GET | `/api/assignments/:id` | Fetch a specific assignment by ID |
| GET | `/api/pdfs/:filename` | Serve a generated PDF file |
| WS | `/` (Socket.io) | Connect to receive real-time job progress events |
