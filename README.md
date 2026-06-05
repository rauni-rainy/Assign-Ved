# 🚀 VedaAI - Next-Generation AI Teacher's Toolkit

VedaAI is a revolutionary, full-stack AI-powered assignment generator designed to automate and elevate the educational workflow. Built with a modern tech stack and optimized for scalability, this platform empowers educators to instantly generate high-quality question papers, assignments, and study materials using advanced generative AI.

## ✨ Why VedaAI Stands Out

Our goal wasn't just to build an app, but to engineer an **enterprise-ready**, highly scalable platform. Here's what makes VedaAI exceptional:

- **🐳 Containerized & Cloud-Native:** The entire application is fully Dockerized and deployed natively on **Google Cloud Run**, ensuring seamless autoscaling and zero-downtime deployments.
- **⚡ Real-Time WebSocket Architecture:** Unlike traditional polling, our Socket.io implementation streams real-time progress updates to the frontend during complex AI generation tasks.
- **🧠 Advanced AI Integration:** Leverages cutting-edge LLMs (Google Gemini) for precise, context-aware question generation and syllabus processing.
- **⚙️ Queued Background Processing:** Heavy AI generation and PDF compilation tasks are offloaded to **Upstash Redis** queues, guaranteeing that the main server thread never blocks and ensuring high throughput.
- **🎨 Premium UI/UX:** A stunning, highly responsive Next.js frontend built with modern design principles, glassmorphism, and dynamic micro-animations.
- **📄 Instant PDF Generation:** Built-in Puppeteer service to automatically compile generated assignments into beautifully formatted PDFs.

---

## 📸 Screenshots

*(Add your screenshots here! You can drag and drop images directly into GitHub to replace these placeholders)*

| Dashboard | Assignment Creator | Generated PDF |
| :---: | :---: | :---: |
| `[Screenshot 1 Placeholder]` | `[Screenshot 2 Placeholder]` | `[Screenshot 3 Placeholder]` |

---

## 🏗 Architecture Notes

VedaAI follows a robust Client-Server architecture designed for high availability and concurrent processing:

- **Frontend:** Next.js (App Router), React, TailwindCSS, Socket.io-client.
- **Backend:** Node.js, Express.js, Socket.io, Puppeteer.
- **Database:** MongoDB Atlas (Mongoose) for structured data persistence.
- **Queue & Cache:** Upstash Redis for asynchronous job processing.
- **Deployment:** Google Cloud Run (Serverless, Auto-scaling) via Artifact Registry and Docker.

### The AI Generation Flow
1. **Client** requests an assignment generation via REST API.
2. **Server** validates the request and enqueues a job into Redis.
3. **Background Worker** picks up the job, prompts the Gemini API, and formats the output.
4. **WebSocket** emits live progress (`processing`, `10%`, `50%`) back to the client UI.
5. **Puppeteer** converts the final JSON output into a formatted PDF.
6. **Client** receives the final PDF link and renders the results.

---

## 📋 Prerequisites

| Requirement | Version | Notes |
| :--- | :--- | :--- |
| **Node.js** | v20+ | Required for local development |
| **npm / yarn** | Latest | Package management |
| **Docker** | Latest | Required if building containers locally |
| **Google Cloud CLI** | Latest | For manual cloud deployments (`gcloud`) |

---

## 🚀 Quick Start

Get the app running locally in seconds.

```bash
# 1. Install dependencies for both frontend and server
npm install --prefix frontend && npm install --prefix server

# 2. Start the backend server (runs on port 3001)
npm run dev --prefix server

# 3. Start the Next.js frontend (runs on port 3000)
npm run dev --prefix frontend
```

---

## 🔐 Environment Variables

Create a `.env` file in the `server` directory:

| Variable | Description |
| :--- | :--- |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `REDIS_URL` | Upstash Redis connection URL for background jobs |
| `GEMINI_API_KEY` | Google Gemini API key for AI generation |
| `FRONTEND_URL` | Allowed CORS origin (e.g., `http://localhost:3000`) |
| `NODE_ENV` | `development` or `production` |
| `PORT` | Backend port (Default: `3001`) |

For the `frontend` production builds, create a `.env.production` in the `frontend` directory:
| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Your production backend URL |

---

## 🌐 Core API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/assignments` | Trigger a new AI assignment generation job |
| `GET` | `/api/assignments` | Fetch all historical assignments |
| `GET` | `/api/assignments/:id` | Fetch a specific assignment by ID |
| `GET` | `/api/pdfs/:filename` | Serve a generated PDF file |
| `WS` | `/` (Socket.io) | Connect to receive real-time job progress events |
