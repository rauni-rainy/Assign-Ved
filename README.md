# VedaAI - Next-Generation AI Teacher's Toolkit

VedaAI is a full-stack, enterprise-ready AI-powered assignment generator designed to automate and elevate the educational workflow. This platform empowers educators to instantly generate highly structured question papers and assignments using advanced generative AI. 

## System Architecture & Approach

A primary focus of this project was engineering a robust, production-grade system capable of handling heavy concurrent AI generation loads without failure. 

### Approach
The core philosophy behind VedaAI is **asynchronous, non-blocking execution**. AI generation (via Google Gemini) and PDF rendering (via Puppeteer) are inherently slow processes. If run on the main thread, they would block incoming REST API requests, leading to server timeouts and a degraded user experience. 

To solve this, we implemented an event-driven architecture using **BullMQ** and **Upstash Redis**. When a user requests an assignment, the API immediately responds with an acknowledgment and enqueues a background job. A dedicated worker processes the heavy AI tasks and uses **Socket.io** to stream real-time progress back to the client. This decouples the client from the generation process, ensuring the platform remains highly responsive.

### Fully Dockerized & Deployed on Google Cloud
We went far beyond standard "hobby" deployments. The entire architecture—both the Next.js frontend and the Node.js/Puppeteer backend—is **fully containerized using Docker**. We utilized multi-stage Docker builds to minimize image sizes and ensure perfect parity between development and production environments. 

The application is natively deployed on **Google Cloud Run**, an enterprise-grade, serverless compute platform. This guarantees:
- **True Auto-Scaling:** The system automatically scales out containers to handle traffic spikes during peak exam generation periods.
- **Zero-Downtime Deployments:** Seamless updates handled by Google's Artifact Registry and Cloud Build pipelines.
- **Microservice Isolation:** By containerizing the Puppeteer engine, we prevent memory leaks from crashing the main Node.js event loop.

## Comprehensive Feature Suite

VedaAI is packed with high-signal features that elevate it from a simple wrapper to a complete product.

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

## Core API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/assignments` | Trigger a new AI assignment generation job |
| GET | `/api/assignments` | Fetch all historical assignments |
| GET | `/api/assignments/:id` | Fetch a specific assignment by ID |
| GET | `/api/pdfs/:filename` | Serve a generated PDF file |
| WS | `/` (Socket.io) | Connect to receive real-time job progress events |
