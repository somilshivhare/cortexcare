# 🏥 CortexCare — AI Clinical Intake Platform

> **An Enterprise-Grade, Modular Monolith Platform for Automated Patient Intake & Clinical Context Extraction**

[![Live Demo - Frontend](https://img.shields.io/badge/Live%20Demo-Vercel%20Frontend-brightgreen?style=for-the-badge&logo=vercel)](https://cortexcare.vercel.app)
[![Backend API - Render](https://img.shields.io/badge/API%20Endpoint-Render%20Backend-blue?style=for-the-badge&logo=render)](https://cortexcare.onrender.com)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5.0-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-v19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-v5.22-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon%20DB-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![BullMQ](https://img.shields.io/badge/BullMQ-Redis%20Queue-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini%202.0%20Flash-4285F4?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)

---

## 📌 Executive Summary & Problem Statement

Healthcare professionals spend up to **30–40% of their working hours manually collecting patient history** and documenting clinical visits into Electronic Health Record (EHR) systems. Patients repeat their medical history across every clinic visit, resulting in fragmented information, clinician burnout, and delayed treatments.

**CortexCare** is an **AI-powered Clinical Intake & Workflow Automation Platform** designed to solve this documentation crisis. 

> ⚠️ **Core Product Philosophy**: CortexCare is **NOT** an AI doctor, chatbot, or diagnostic decision-maker. It is **Workflow Automation Software** that acts as an intelligent clinical scribe. It captures structured patient intake, normalizes medical records, and generates EMR-ready clinical summaries **prior** to consultations—ensuring doctors retain 100% final medical authority while cutting administrative documentation overhead.

---

## 🌐 Live Production Deployments

* 🖥️ **Frontend Application (Vercel)**: [https://cortexcare.vercel.app](https://cortexcare.vercel.app)
* ⚙️ **Backend API (Render)**: [https://cortexcare.onrender.com](https://cortexcare.onrender.com)

---

## 🚀 Key Features & Capabilities

### 👨‍⚕️ For Healthcare Professionals (Doctor Dashboard)
* **EMR-Ready Clinical Context Cards**: Instantly view AI-extracted **Chief Complaints**, **History of Present Illness (HPI)**, **Past Medical History**, **Current Medications**, **Allergies**, **Lifestyle Factors**, and **Symptom Timelines**.
* **Patient Risk Stratification**: Automated triage algorithm classifying risk levels (`LOW`, `MEDIUM`, `HIGH`) and suggesting specialist referrals (e.g., Cardiology, Neurology).
* **Historical Recovery Timeline**: Interactive cross-consultation tracking to observe health progression, stress indicators, and symptom resolution across multiple visits.
* **Synchronous & Asynchronous Record Reviews**: Complete transcript inspection alongside lab attachment previews and realtime clinician notes storage.

### 🩺 For Patients (Interactive Intake)
* **Adaptive AI Clinical Dialogue**: Natural multi-turn intake interview powered by Google Gemini 2.0 Flash that dynamically asks clarifying clinical questions.
* **Browser-Native Voice Dictation**: Speech-to-Text integration via the native Web Speech API (`SpeechRecognition`), enabling hands-free patient voice responses.
* **Medical Record Attachment Uploads**: Secure image/PDF uploads streamed to Cloudinary with OCR and text parsing for lab reports and past prescriptions.
* **Fault-Tolerant Resumable Sessions**: Realtime sequence ordering allowing patients to interrupt and resume consultations seamlessly without loss of history.

---

## 🛠️ Architecture & Technical Stack

CortexCare is architected as a **Modular Monolith**—delivering maximum developer velocity, strict domain encapsulation, and clean boundaries that can be easily split into independent microservices as traffic scales.

```
                    ┌─────────────────────────────────────────┐
                    │          React 19 Frontend SPA          │
                    │      (Vercel / Vite / Tailwind v4)      │
                    └────────────────────┬────────────────────┘
                                         │ REST APIs / JWT Auth
                                         ▼
                    ┌─────────────────────────────────────────┐
                    │          Express 5 REST Router          │
                    └────┬───────────┬───────────┬───────┬────┘
                         │           │           │       │
      ┌──────────────────┴──┐  ┌─────┴──────┐  ┌─┴───────┴─────────┐
      │     auth & rbac     │  │  patient   │  │   consultation    │
      └─────────────────────┘  └────────────┘  └─────────┬─────────┘
                                                         │ Enqueue Synthesis Job
                                                         ▼
┌───────────────────────┐                      ┌──────────────────┐
│ Cloudinary CDN        │                      │ BullMQ Queue     │
│ (Intake Attachments)  │                      │ (Upstash Redis)  │
└───────────────────────┘                      └────────┬─────────┘
                                                        │ Process Job
                                                        ▼
┌───────────────────────┐                      ┌──────────────────┐
│ Neon Serverless Postgres│◄────────────────────┤ BullMQ Async     │
│ (Prisma ORM Database) │                      │ Synthesis Worker │
└───────────────────────┘                      └────────┬─────────┘
                                                        │ NLP Extract
                                                        ▼
                                               ┌──────────────────┐
                                               │ Google Gemini API│
                                               │ (2.0 Flash SDK)  │
                                               └──────────────────┘
```

### Stack Overview

| Domain | Technology / Library | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19**, Vite 8 | UI Rendering & Component Engine |
| **Styling & UX** | Tailwind CSS v4, Vanilla CSS | Modern Responsive Layout System |
| **Animations** | Framer Motion v12 | Micro-interactions, Transitions & Dialogues |
| **Data Fetching** | TanStack Query v5, Axios | Async State Management & API Caching |
| **Validation** | React Hook Form v7, Zod v4 | Frontend Form Rules & Schema Validation |
| **Voice Speech** | Web SpeechRecognition API | Client-Side Voice Dictation |
| **Backend Runtime** | **Node.js** (ES Modules), **Express 5** | High-performance Async HTTP Server |
| **Database & ORM** | **PostgreSQL** (Neon), **Prisma ORM v5** | Relational Data Storage & Migrations |
| **Queue & Worker** | **BullMQ v5**, **IORedis** (Upstash) | Non-blocking Async Clinical Synthesis Queue |
| **AI Provider** | `@google/genai` (Gemini 2.0 Flash) | Generative LLM Structured Context Extraction |
| **Media Storage** | Cloudinary API, Multer | Medical Document Upload & Streaming |
| **Security & Auth** | JWT (`jsonwebtoken`), `bcrypt` | RBAC Middleware & Token Hashing |
| **Deployment** | Vercel (Client), Render (Server) | CI/CD Automated Cloud Hosting |

---

## ⚡ Key Engineering & Architectural Highlights

### 1. Asynchronous Non-Blocking LLM Queue (`BullMQ` + `Redis`)
LLM inference generation can take anywhere between 2 to 6 seconds. To prevent blocking Express HTTP request loops and timeout exceptions, CortexCare implements an asynchronous task queue:
* When a consultation is finalized (`POST /api/consultation/:id/finalize`), the HTTP controller updates status to `PROCESSING` and immediately returns `202 Accepted`.
* A background job is dispatched to a **BullMQ** queue backed by **Upstash Redis**.
* A isolated worker (`consultation.worker.js`) picks up the job asynchronously, calls Gemini 2.0 Flash for structured extraction, inserts the normalized records into PostgreSQL, and marks the session `COMPLETED`.

### 2. Structured AI Parsing Engine (`PromptBuilder` & `ResponseParser`)
Rather than relying on unformatted text responses, CortexCare enforces strict JSON schemas for generative AI outputs:
* `PromptBuilder.js` constructs multi-turn context prompts including patient history, conversation transcripts, and uploaded file OCR extracts.
* `GeminiClient.js` interacts via the official `@google/genai` SDK.
* `ResponseParser.js` validates, cleanses, and transforms raw LLM output into strongly-typed database models matching the `ClinicalContext` schema.

### 3. Fault-Tolerant Resumable Session Engine
Intake conversations are stored as indexed sequence numbers (`@@unique([consultationId, sequence])` in Prisma) rather than monolithic text strings:
* Allows instant session resumption if a patient disconnects or closes their browser.
* Prevents data loss and provides incremental replay capabilities for audit logs.

### 4. Enterprise Human-in-the-Loop Security & Scope
* **Role-Based Guards**: Middleware (`AuthGuard`, `RoleGuard`) strictly segregates `PATIENT` access from `DOCTOR` clinical administrative rights.
* **Graceful Shutdown**: The Express app implements `SIGINT`/`SIGTERM` handlers to cleanly shut down HTTP server listeners, drain BullMQ workers, and close Prisma/Redis sockets.

---

## 📂 Modular Repository Structure

```text
cortexcare/
├── client/                     # React 19 Frontend SPA (Vite)
│   ├── src/
│   │   ├── config/             # Environment & Axios Base Setup
│   │   ├── contexts/           # Auth & Global Application Contexts
│   │   ├── features/           # Modular Domain Components
│   │   │   ├── auth/           # Login, Register & Protected Route Guards
│   │   │   ├── consultation/   # AI Intake Room, Chat Bubbles, Speech-to-Text
│   │   │   ├── doctor/         # Clinician Patient Review Dashboard
│   │   │   └── patient/        # Patient Dashboard & Timeline Views
│   │   ├── hooks/              # Custom React Hooks (e.g. useSpeechToText)
│   │   └── routes/             # React Router v7 Configuration
│   └── package.json
│
├── server/                     # Node.js Express 5 Modular Monolith API
│   ├── prisma/                 # PostgreSQL Schema Definition & Seed Scripts
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── config/             # Prisma, Redis, Gemini, Cloudinary Clients
│   │   ├── middleware/         # Auth Guard, Role Guard, Error Handlers
│   │   └── modules/            # Self-Contained Business Domain Slices
│   │       ├── auth/           # Hashing, Token Generation, RBAC
│   │       ├── clinic/         # Clinic Scope Management
│   │       ├── clinicalContext/# Normalized AI Context Retrieval
│   │       ├── consultation/   # Consultation Engine, AI Prompts & Workers
│   │       │   ├── ai/         # Gemini Client, Prompt Builder & Parsers
│   │       │   ├── queues/     # BullMQ Async Queue Setup
│   │       │   └── workers/    # Background Synthesis Job Runner
│   │       ├── doctor/         # Doctor Claim Queues & Review Services
│   │       ├── patient/        # Patient Profiles & Record Management
│   │       └── timeline/       # Patient Recovery Timeline Analytics
│   ├── app.js                  # Express App Initialization & Routes
│   ├── server.js               # HTTP Server Lifecycle & Graceful Shutdown
│   └── package.json
│
├── PROJECT_CONTEXT.md          # Complete Architecture Standard
├── PROJECT_HANDOVER.md         # Technical Handover Specifications
└── README.md                   # Repository Documentation
```

---

## 🗄️ Database Entity Schema (Prisma ORM)

```prisma
model Consultation {
  id              String           @id @default(uuid())
  patientId       String
  patient         Patient          @relation(fields: [patientId], references: [id], onDelete: Cascade)
  doctorId        String?
  doctor          Doctor?          @relation(fields: [doctorId], references: [id])
  status          SessionStatus    @default(SETUP) // SETUP, ACTIVE, PROCESSING, COMPLETED, FAILED
  reviewStatus    ReviewStatus     @default(PENDING)
  startedAt       DateTime?
  endedAt         DateTime?
  reviewedAt      DateTime?
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
  messages        Message[]
  attachments     Attachment[]
  clinicalContext ClinicalContext?
  doctorNote      DoctorNote?

  @@map("consultations")
}

model ClinicalContext {
  id                    String       @id @default(uuid())
  consultationId        String       @unique
  consultation          Consultation @relation(fields: [consultationId], references: [id], onDelete: Cascade)
  chiefComplaint        String
  presentIllness        String
  pastMedicalHistory    Json
  currentMedications    Json
  allergies             Json
  lifestyle             Json
  symptoms              Json
  timeline              Json
  riskFactors           Json
  riskLevel             String       // LOW, MEDIUM, HIGH
  recommendedSpecialist String
  doctorSummary         String
  consultationState     Json
  createdAt             DateTime     @default(now())
  updatedAt             DateTime     @updatedAt

  @@map("clinical_contexts")
}
```

---

## 📡 REST API Reference Summary

### Auth Module (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new Patient or Doctor account |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT session tokens |
| `POST` | `/api/auth/logout` | Authenticated | Invalidate active session cookies |

### Consultation Module (`/api/consultation`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/consultation` | Patient | Initialize a new AI intake consultation session |
| `GET` | `/api/consultation/:id` | Authenticated | Fetch active consultation details and transcripts |
| `POST` | `/api/consultation/:id/messages` | Patient | Send patient message & receive AI reply |
| `POST` | `/api/consultation/:id/attachments` | Patient | Upload lab reports / medical records to Cloudinary |
| `POST` | `/api/consultation/:id/finalize` | Patient | Finalize session & trigger async BullMQ synthesis |

### Doctor & Clinical Context Modules (`/api/doctor`, `/api/clinical-context`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/doctor/consultations` | Doctor | Fetch assigned clinical intake queue |
| `GET` | `/api/clinical-context/:consultationId` | Doctor | Retrieve structured EMR clinical context summary |
| `POST` | `/api/doctor/consultations/:id/notes` | Doctor | Save official physician review notes |

---

## 💻 Local Development & Setup Guide

### Prerequisites
* **Node.js**: `v20.x` or higher
* **npm**: `v10.x` or higher
* **PostgreSQL**: Neon DB connection string or local PostgreSQL instance
* **Redis**: Upstash Redis or local Redis server (`redis-server`)
* **Google Gemini API Key**: [Google AI Studio](https://aistudio.google.com/)

### 1. Clone Repository & Install Dependencies

```bash
git clone https://github.com/somilshivhare/cortexcare.git
cd cortexcare
```

#### Install Server Dependencies:
```bash
cd server
npm install
```

#### Install Client Dependencies:
```bash
cd ../client
npm install
```

### 2. Configure Environment Variables

Create `.env` inside the `server/` directory:

```env
# Server Runtime
PORT=5005
NODE_ENV=development

# Database Configuration (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@ep-sample.aws.neon.tech/neondb?sslmode=require"

# JWT Authentication Secrets
JWT_SECRET="your_secure_jwt_access_secret_key"
REFRESH_TOKEN_SECRET="your_secure_jwt_refresh_secret_key"

# Redis Configuration (Upstash / Local)
REDIS_URL="rediss://default:password@your-redis-instance.upstash.io:6379"

# Google Gemini Generative AI
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"
GEMINI_MODEL="gemini-2.0-flash"

# Cloudinary Storage Configuration
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

Create `.env` inside the `client/` directory:

```env
VITE_API_BASE_URL="http://localhost:5005"
```

### 3. Database Migration & Seeding

```bash
cd server

# Generate Prisma Client
npx prisma generate

# Run Database Migrations
npx prisma migrate dev --name init

# Seed Database with Initial Clinic & Test Users
npm run seed
```

### 4. Run Development Servers

#### Start Backend API & Worker (Port 5005):
```bash
cd server
npm run dev
```

#### Start Frontend Client (Vite Dev Server):
```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

---

## 🛡️ Medical Safety & Engineering Guardrails

1. **Human-in-the-Loop Oversight**: AI is strictly restricted to intake data collection and structured summary generation. It does **not** provide definitive medical diagnoses or prescribe medications.
2. **Immutable Clinical History**: Conversation transcripts are preserved as read-only historical records; clinical summaries are derived analytical layers that do not overwrite raw patient statements.
3. **Data Security**: Authentication is protected via salted `bcrypt` password hashing, httpOnly JWT cookies, and strict CORS policies.

---

## 📄 License & Author

Crafted with engineering precision by **Somil Shivhare**.  
Developed as a high-performance demonstration of AI Workflow Automation in Healthcare.

* 📧 Contact: [somil.shivhare@gmail.com](mailto:somil.shivhare@gmail.com)
* 🔗 GitHub: [https://github.com/somilshivhare](https://github.com/somilshivhare)
