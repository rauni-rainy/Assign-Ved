# VedaAI - Next-Generation AI Teacher's Toolkit

VedaAI is a full-stack, enterprise-ready AI-powered assignment generator designed to automate and elevate the educational workflow. This platform empowers educators to instantly generate highly structured question papers and assignments using advanced generative AI. 

## Cloud-Native & Enterprise Architecture

A primary focus of this project was engineering a robust, production-grade system capable of handling heavy concurrent AI generation loads without failure. 

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
- **Hierarchical Question Papers:** The generated data automatically includes defined Sections (A, B, etc.), Question Text, Difficulty Levels (Easy/Moderate/Hard), and precise Marks allocation.
- **Context-Aware Syllabi:** Users can provide exact guidelines, subjects, and parameters, ensuring the AI output directly matches their curriculum requirements.

### Version Control & Smart Regeneration
- **Granular Version History:** Every time an educator regenerates an assignment, the system maintains a complete, persistent version tree in MongoDB. Users can seamlessly navigate back to previous iterations of a paper without losing historical data.
- **Action Bar Regeneration:** A dedicated action bar allows users to instantly trigger smart regenerations with tweaked parameters, maintaining the core identity of the assignment while generating fresh content.

### Robust Backend Flow (Queueing & WebSockets)
- **Non-Blocking Architecture:** Heavy AI generation and intensive PDF compilation tasks are offloaded to **Upstash Redis** queues via **BullMQ**. This ensures the main server thread never blocks and handles thousands of concurrent requests.
- **Real-Time Streaming:** We rejected lazy API polling. Instead, our **Socket.io** implementation streams live progress events (e.g., "processing", "50%", "completed") directly to the frontend, providing a highly reactive user experience.

### Premium Output & UX
- **Server-Side PDF Engine:** We completely avoided raw browser HTML printing. Instead, we implemented a dedicated **Puppeteer Microservice** on the backend that compiles the assignment into a perfectly formatted, downloadable PDF, mirroring real-world exam papers.
- **Structured Rendering:** The UI renders the final assignment with a proper Student Info Header (Name, Roll Number, Section), logical groupings, and beautiful color-coded difficulty badges.
- **Modern Glassmorphism UI:** Built with Next.js, TailwindCSS, and Zustand for state management, providing a stunning, responsive, and intuitive interface.

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
