# CortexCare Backend Handover Document

This document serves as the single, complete technical guide for the CortexCare backend codebase. It details the architecture, data models, APIs, and design decisions made to date, enabling a senior software engineer to resume development instantly without reading the entire repository.

---

## 1. Project Overview

### Purpose
CortexCare is an **AI-powered Clinical Workflow Platform** designed to reduce the administrative documentation burden of healthcare professionals. It collects structured patient intake information via a voice conversation before a consultation, organizes it into a clinical summary, and presents it to doctors. Doctors remain the final decision-makers; the AI acts strictly as an assistant.

### Architecture Style
*   **Modular Monolith**: Designed as a single deployable application but separated internally into vertical slices (domain-based modules). This prevents a "spaghetti monolith" and makes it trivial to extract any module (e.g. AI processing, Patient, or Doctor) into a separate microservice in the future.
*   **Layered vertical slice**: Each module owns its validation, routes, controllers, services, and database queries (repositories).

### Technology Stack
*   **Backend Runtime**: Node.js (ES Modules syntax).
*   **Web Framework**: Express 5 (leverages native async error-handling support).
*   **Database ORM**: Prisma ORM (v5.22.0) with PostgreSQL.
*   **Realtime Audio**: LiveKit (Server SDK integration).
*   **Background Jobs**: BullMQ with Redis.
*   **Generative AI**: Google Gemini API (via the new `@google/genai` SDK).
*   **Security**: JSON Web Tokens (JWT) for stateless sessions and `bcrypt` for password hashing.

### Design Philosophy
*   **Keep it Simple**: Avoid over-engineering and heavy abstractions.
*   **Thin Controllers**: Controllers only parse incoming HTTP inputs and map service layer responses to standard HTTP status codes.
*   **Services hold Business Rules**: Service functions coordinate workflows, evaluate rules, and handle parameters.
*   **Repositories isolate Databases**: Only repository files import Prisma or write SQL queries.
*   **Validation as Middleware**: Validation happens at the edge (in validation files) before reaching controller handlers, terminating early on failure.
*   **Standard Express Responses**: Standard `res.status(...).json(...)` is used directly in controllers and middlewares. No custom error classes are thrown to a global middleware.

---

## 2. Current Project Status

### Completed Modules
1.  **Express Foundation**: Server listening script (`server.js`) separate from application configuration (`app.js`) to support easy testing.
2.  **Prisma Setup**: Singleton Prisma Client configuration (`prisma.js`) with global caching to prevent database connection exhaustion during development reloads.
3.  **Authentication Module**: User registration and login, password salting/hashing, stateless JWT generation, and role-based access control (RBAC) middleware.
4.  **Patient Module**: Fetching profiles, editing profile metadata, and a stub route to join a clinic.
5.  **Consultation Module**: Session initialization, chronological transcript chunk accumulation, and session finalization.
6.  **AI Processing Engine**: Redis client configuration, BullMQ background queues, a standalone worker script, Gemini API integration, and LiveKit session token generation.
7.  **Clinical Context Module**: Exposing single and plural AI-extracted clinical summaries to authorized users.
8.  **Doctor Module**: Clinician profile management, statistics dashboard, claiming unassigned patient consultations, writing/editing notes, and final reviews.
9.  **Clinic Module**: Creating clinics with auto-assignment for creators, unique invite-code generation, patient/doctor onboarding gated by single-clinic constraints, and member listing lookups.
10. **Timeline Module**: An aggregation layer combining consultation metadata, transcript chunks, AI clinical context, and doctor notes into a sorted chronological response with duration/message counts.
11. **Production Readiness Suite**: Integrates HTTP header security (`helmet`), payload compression (`compression`), a dependency-aware connection health check endpoint (`/health`), and signal-intercepting graceful server/worker shutdown handlers.

### Remaining Modules
*   *None*. All backend features outlined in the product specifications are fully implemented, connected, and ready for frontend consumption!

---

## 3. Folder Structure

```text
server/
├── prisma/
│   ├── schema.prisma         # Database schema mapping tables and relationships
│   └── migrations/           # SQL migration script history
├── src/
│   ├── config/               # Infrastructure Singletons
│   │   ├── prisma.js         # Cached database client
│   │   ├── redis.js          # Shared ioredis connection config
│   │   └── gemini.js         # Google GenAI SDK client setup
│   ├── modules/              # Domain-based Vertical Slices
│   │   ├── auth/             # Login, registration, JWT, and RBAC middlewares
│   │   ├── patient/          # Patient profile management
│   │   ├── consultation/     # Session state and transcript chunk accumulator
│   │   ├── livekit/          # Participant token generator for voice sessions
│   │   ├── queue/            # BullMQ queues and background worker
│   │   ├── ai/               # Gemini translation layer
│   │   ├── clinicalContext/  # Exposing AI summaries and analysis
│   │   ├── doctor/           # Clinician dashboard and notes management
│   │   ├── clinic/           # Clinic grouping and invite-code joining
│   │   ├── timeline/         # Consultation timeline aggregator
│   │   └── health/           # Public connection-aware system health checking
│   ├── app.js                # Express app setup and middleware mounting
│   └── server.js             # HTTP server entry point and graceful shutdown
├── .env                      # Application environment variables
├── package.json              # Dependencies and scripts
└── package-lock.json         # Lockfile
```

---

## 4. Database Schema

The PostgreSQL database schema is mapped using Prisma. Below is the complete `prisma/schema.prisma` file:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  PATIENT
  DOCTOR
}

enum ConsultationStatus {
  SETUP
  ACTIVE
  PROCESSING
  COMPLETED
  CANCELLED
}

enum SpeakerRole {
  PATIENT
  DOCTOR
  AI
  SYSTEM
}

enum ReviewStatus {
  PENDING
  IN_REVIEW
  REVIEWED
}

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  role         Role
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // 1-to-1 relations to domain profiles
  patient      Patient?
  doctor       Doctor?

  @@index([email])
  @@map("users")
}

model Patient {
  id            String         @id @default(uuid())
  userId        String         @unique
  user          User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  firstName     String
  lastName      String
  clinicId      String?
  clinic        Clinic?        @relation(fields: [clinicId], references: [id], onDelete: SetNull)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  consultations Consultation[]

  @@map("patients")
}

model Doctor {
  id            String         @id @default(uuid())
  userId        String         @unique
  user          User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  firstName     String
  lastName      String
  specialty     String?
  clinicId      String?
  clinic        Clinic?        @relation(fields: [clinicId], references: [id], onDelete: SetNull)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  consultations Consultation[]
  notes         DoctorNote[]

  @@map("doctors")
}

model Consultation {
  id              String             @id @default(uuid())
  patientId       String
  patient         Patient            @relation(fields: [patientId], references: [id], onDelete: Cascade)
  doctorId        String?
  doctor          Doctor?            @relation(fields: [doctorId], references: [id], onDelete: SetNull)
  status          ConsultationStatus @default(SETUP)
  reviewStatus    ReviewStatus       @default(PENDING)
  startedAt       DateTime?
  endedAt         DateTime?
  reviewedAt      DateTime?
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt
  chunks          ConversationChunk[]
  clinicalContext ClinicalContext?
  doctorNote      DoctorNote?

  @@map("consultations")
}

model ConversationChunk {
  id             String       @id @default(uuid())
  consultationId String
  consultation   Consultation @relation(fields: [consultationId], references: [id], onDelete: Cascade)
  speaker        SpeakerRole
  text           String
  sequence       Int
  createdAt      DateTime     @default(now())

  @@unique([consultationId, sequence])
  @@map("conversation_chunks")
}

model ClinicalContext {
  id              String       @id @default(uuid())
  consultationId  String       @unique
  consultation    Consultation @relation(fields: [consultationId], references: [id], onDelete: Cascade)
  summary         String
  symptoms        Json
  riskFlags       Json
  recommendations Json
  mood            Json
  confidenceScore Float
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  @@map("clinical_contexts")
}

model DoctorNote {
  id             String       @id @default(uuid())
  consultationId String       @unique
  consultation   Consultation @relation(fields: [consultationId], references: [id], onDelete: Cascade)
  doctorId       String
  doctor         Doctor       @relation(fields: [doctorId], references: [id], onDelete: Cascade)
  notes          String
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@map("doctor_notes")
}

model Clinic {
  id        String   @id @default(uuid())
  name      String
  code      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  patients  Patient[]
  doctors   Doctor[]

  @@map("clinics")
}
```

### Model Explanations & Relationships
1.  **`User`**: Stores login credentials (`email`, `passwordHash`) and `Role`. Extends to `Patient` and `Doctor` profiles via a strict 1-to-1 relationship. Has a database index on `email` to speed up lookups.
2.  **`Patient`**: Stores patient profile details. Relates 1-to-1 with `User` (cascades on delete) and has a 1-to-many relationship with `Consultation`. Can optionally belong to a `Clinic` (`clinicId` foreign key).
3.  **`Doctor`**: Stores doctor profile details. Relates 1-to-1 with `User` (cascades on delete) and has a 1-to-many relationship with `Consultation`. Links 1-to-many with clinician notes. Can optionally belong to a `Clinic` (`clinicId` foreign key).
4.  **`Consultation`**: Metadata tracker for sessions. Holds started/ended/reviewed timestamps, links to a `Patient` (cascade on delete), and is optionally assigned to a `Doctor` (set to `NULL` on doctor deletion so patient data is never lost). Links 1-to-1 with `ClinicalContext`, 1-to-1 with `DoctorNote`, and 1-to-many with `ConversationChunk`.
5.  **`ConversationChunk`**: Stores segments of transcripts chronologically. Contains a composite unique constraint `@@unique([consultationId, sequence])` to guarantee that message order remains intact and prevents sequence overlaps.
6.  **`ClinicalContext`**: Holds AI-extracted derived data. Relates 1-to-1 with `Consultation` (cascades on delete).
7.  **`DoctorNote`**: Stores clinical remarks recorded by doctors for a consultation session. Relates 1-to-1 with `Consultation` (cascades on delete) and 1-to-many with `Doctor` (cascades on delete).
8.  **`Clinic`**: Groups doctors and patients into a unified medical facility. Enforces a unique alphanumeric code to allow access-controlled joining.

---

## 5. Authentication Flow

Authentication is built around stateless JSON Web Tokens (JWT) signed with `JWT_SECRET`.

### Login Flow
```text
POST /api/auth/login
  ├── Body: { email, password }
  ├── Route validates input format (auth.validation.js)
  ├── Service queries User record by email via Repository
  ├── Service compares raw password hash using bcrypt.compare()
  └── On Success: Generates JWT and returns { user, token }
```

### JWT Structure
Tokens encode the following payload:
*   `id`: The unique `User.id` (UUID).
*   `email`: User's email.
*   `role`: User's system role (`PATIENT` or `DOCTOR`).

### Role Authorization Flow (Middlewares)
*   **`authenticateJWT`**: Standard middleware that extracts the Bearer token from the `Authorization` header, verifies it, and attaches the payload object to `req.user`. If missing or invalid, returns `401 Unauthorized` directly.
*   **`authorizeRoles(...allowedRoles)`**: Higher-order function that verifies `req.user.role` is inside `allowedRoles`. If not, returns `403 Forbidden` directly.

---

## 6. Patient Module

### Implemented Functionality
*   **View Profile**: Retrieves the authenticated patient's profile details along with their account creation date.
*   **Update Profile**: Allows the patient to modify their `firstName` and `lastName`.
*   **Join Clinic**: A POST stub route ready for clinic-onboarding features.

### Endpoints
*   `GET /api/patient/profile` (gated to `PATIENT` role).
*   `PUT /api/patient/profile` (gated to `PATIENT` role, validates inputs).
*   `POST /api/patient/join-clinic` (gated to `PATIENT` role).

---

## 7. Consultation Module

### Session Lifecycle & Statuses
A consultation is tracked using five distinct states:
1.  **`SETUP`**: Session is initialized. No voice connection or chunks have been recorded.
2.  **`ACTIVE`**: The first conversation chunk is successfully recorded. The starting timestamp `startedAt` is logged.
3.  **`PROCESSING`**: The patient concludes the session. The end timestamp `endedAt` is logged. The session is locked, and a job is dispatched to BullMQ.
4.  **`COMPLETED`**: The background worker successfully writes the parsed Gemini summary and structures the clinical context.
5.  **`CANCELLED`**: The patient manually aborts the session or is disconnected.

```mermaid
stateDiagram-v2
    [*] --> SETUP : POST /api/consultation
    SETUP --> ACTIVE : First ConversationChunk added
    ACTIVE --> PROCESSING : POST /api/consultation/:id/finalize
    PROCESSING --> COMPLETED : Worker processes AI summary successfully
    PROCESSING --> FAILED : Worker fails processing
    SETUP --> CANCELLED : Manual cancel
    ACTIVE --> CANCELLED : Disconnection or cancel
```

### Transcript Immutability
To preserve medical documentation records:
*   `ConversationChunk` records cannot be updated or deleted via any API or repository method.
*   The system only supports inserting new chunks (which auto-calculate the next index sequence) and reading them.

---

## 8. AI Processing Engine

### Technology Integration
*   **LiveKit**: Exposes an endpoint to generate room credentials (`generateParticipantToken`) so the browser can initialize realtime voice streams. The backend remains decoupled: the voice server operates separately, and the app is unaware of voice codecs.
*   **BullMQ + Redis**: Used to offload AI analysis. When the patient finalizes a consultation, the route transitions the session state to `PROCESSING` and calls `addConsultationJob(consultationId)`. This pushes the task to Redis. The Express thread immediately returns `200 OK` to the browser, ensuring the HTTP route is never blocked by slow LLM calls.
*   **Worker**: A standalone runner (`worker.js`) polls Redis for jobs. When it picks up a task, it compiles chronological chunks, calls Gemini, saves the context, and marks the session `COMPLETED`.
*   **Gemini API**: Utilizes the model `gemini-2.5-flash`. To guarantee reliability, the service instructs Gemini using `responseMimeType: 'application/json'` and defines a rigid JSON `responseSchema` (matching symptoms, risk flags, mood, summary, and confidence).

---

## 9. Clinical Context Module

### APIs Exposed
*   **`GET /api/clinical-context/patient`**: Returns all clinical contexts for the logged-in patient (gated to `PATIENT` role).
*   **`GET /api/clinical-context/:consultationId`**: Retrieves a single context by ID. Gated internally: Doctors can view any context, but Patients can only view contexts of consultations they own.

### Integration Details
*   **Write Path**: Populated asynchronously by the `Worker` after a session is finalized.
*   **Read Path**: Consumed directly by patient profiles and the Doctor dashboard.

---

## 10. Doctor Module

### Implemented Functionality
*   **View & Edit Profile**: Accesses and updates doctor demographic data (firstName, lastName, specialty).
*   **Clinician Dashboard**: Gathers key metrics (count of unassigned pending consultations, count of active claimed consultations).
*   **Claim Consultations**: Allows a clinician to claim an unassigned pending consultation. Claiming assigns `doctorId` to the session and sets the `reviewStatus` state to `IN_REVIEW`.
*   **Write Clinical Notes**: Stores or updates clinician remarks in a dedicated `DoctorNote` table linked to the consultation.
*   **Finalize Session**: Concludes the consultation review by updating the `reviewStatus` to `REVIEWED` and setting a `reviewedAt` timestamp.
*   **Clinical Context Integration**: Retrieves the corresponding AI clinical context for a consultation by reusing the existing Clinical Context service directly.

### Endpoints
All routes in this module are prefix-mounted under `/api/doctor` and require a valid JWT with the `DOCTOR` role:
*   `GET /profile`: Fetch doctor profile.
*   `PUT /profile`: Update doctor profile fields.
*   `GET /dashboard`: Aggregated dashboard metrics.
*   `GET /consultations?status=pending`: List unassigned consultations.
*   `GET /consultations?status=claimed`: List consultations claimed by the clinician.
*   `POST /consultations/:consultationId/claim`: Claim an unassigned pending consultation.
*   `POST /consultations/:consultationId/notes`: Upsert notes for the consultation.
*   `POST /consultations/:consultationId/review`: Mark the consultation review as complete.
*   `GET /consultations/:consultationId/context`: Fetch the AI clinical context (reused).

---

## 11. Clinic Module

### Implemented Functionality
*   **Clinic Creation with Auto-Assignment**: Clinicians can establish a clinic by setting its name. An access-controlled uppercase 6-character code is generated. The creating doctor is automatically registered as the clinic's founder (assigning `clinicId`).
*   **Invite Gated Onboarding**: Both patients and doctors can join a clinic using the invite code. Multiple clinic memberships are blocked (`409 Conflict`).
*   **Enrollment Stats**: Exposes a retrieval endpoint `GET /api/clinic` to display patient/doctor enrollment counts.
*   **Member Listing**: Doctors can list all patients and doctors registered in their clinic.
*   **Data Leak Protections**: Hide/omit invite codes in patient responses, keeping invite codes visible strictly to doctors.

### Endpoints
All routes are mounted under `/api/clinic` and require JWT authentication:
*   `POST /`: Creates a clinic (restricted to `DOCTOR` role).
*   `POST /join`: Enrolls a user (Patient or Doctor) using a code.
*   `GET /`: Returns clinic details and membership counts.
*   `GET /members`: Returns membership lists (restricted to `DOCTOR` role).

---

## 12. Timeline Module

### Implemented Functionality
*   **Dynamic Lifecycle Aggregator**: Joins a consultation's metadata, chronological chunks, AI summary context, and doctor notes on the fly.
*   **Sorting Guard**: Gathers every event in the consultation lifecycle (creation, audio start, transcript chunks, AI completion, notes updates, and review completion) and sorts them chronologically.
*   **Dashboard Summary**: Computes duration stats and message counters in a nested `summary` object.
*   **Access Guards**: Prevents patients from accessing unauthorized records, and limits doctor timeline requests to patients registered in their clinic.

### Endpoints
*   `GET /api/timeline/:consultationId` (gated with JWT, returns sorted chronological events).

---

## 13. Production Readiness & Security Features

CortexCare integrates standard production setups:
1.  **Security Headers (Helmet)**: Restricts MIME types and disables Express fingerprint headers to block sniffing attacks.
2.  **Compression**: Compresses outgoing JSON and file transfer payloads dynamically.
3.  **Dependency-Aware Health Checks (`GET /health`)**: Tests active connections for both PostgreSQL (Prisma raw query check) and Redis (`redisConnection.status`). Returns status codes:
    *   `200 OK`: All services are connected.
    *   `503 Service Unavailable`: If one or more database or cache servers are disconnected.
4.  **Graceful Shutdown**: Intercepts `SIGINT` and `SIGTERM` signals:
    *   **Express Server**: Closes listener, rejects incoming requests, and allows ongoing transfers to finish.
    *   **Background Worker**: Shuts down the BullMQ Worker process cleanly, ensuring currently running jobs complete before process termination.
    *   **Database & Cache**: Disconnects Prisma Client and Redis clients cleanly.

---

## 14. Complete Backend Request Flow

Here is the exact path an HTTP request travels through the backend:

```text
1. Client Browser (e.g. GET /api/clinical-context/some-uuid)
               │ (Includes JWT in Authorization: Bearer Header)
               ▼
2. Express Routing (app.js routes prefix '/api/clinical-context' to clinicalContext.routes.js)
               │
               ▼
3. Auth Middleware (authenticateJWT extracts and verifies token, injects req.user)
               │
               ▼
4. Validation Middleware (validateConsultationId verifies 'some-uuid' matches UUID format)
               │
               ▼
5. Controller Layer (clinicalContext.controller.js maps input params and calls service)
               │
               ▼
6. Service Layer (clinicalContext.service.js checks authorization: does req.user own this consultation?)
               │
               ▼
7. Repository Layer (clinicalContext.repository.js runs Prisma query)
               │
               ▼
8. Prisma Engine (Translates JS query into SQL lookup)
               │
               ▼
9. PostgreSQL DB (Executes SELECT query with JOIN)
               │
               ▼ (Returns rows)
10. Response Mapping (Service formats payload; Controller returns res.status(200).json())
```

---

## 15. Module Dependency Diagram

```mermaid
graph TD
    App[app.js] --> AuthRouter[auth.routes.js]
    App --> PatientRouter[patient.routes.js]
    App --> ConsultationRouter[consultation.routes.js]
    App --> LiveKitRouter[livekit.routes.js]
    App --> ClinicalContextRouter[clinicalContext.routes.js]
    App --> DoctorRouter[doctor.routes.js]
    App --> ClinicRouter[clinic.routes.js]
    App --> TimelineRouter[timeline.routes.js]
    App --> HealthRouter[health.routes.js]

    AuthRouter --> AuthCtrl[auth.controller.js]
    PatientRouter --> PatientCtrl[patient.controller.js]
    ConsultationRouter --> ConsultationCtrl[consultation.controller.js]
    LiveKitRouter --> LiveKitCtrl[livekit.controller.js]
    ClinicalContextRouter --> ClinicalContextCtrl[clinicalContext.controller.js]
    DoctorRouter --> DoctorCtrl[doctor.controller.js]
    ClinicRouter --> ClinicCtrl[clinic.controller.js]
    TimelineRouter --> TimelineCtrl[timeline.controller.js]
    HealthRouter --> HealthCtrl[health.controller.js]

    PatientCtrl --> PatientService[patient.service.js]
    ConsultationCtrl --> ConsultationService[consultation.service.js]
    LiveKitCtrl --> LiveKitService[livekit.service.js]
    ClinicalContextCtrl --> ClinicalContextService[clinicalContext.service.js]
    DoctorCtrl --> DoctorService[doctor.service.js]
    ClinicCtrl --> ClinicService[clinic.service.js]
    TimelineCtrl --> TimelineService[timeline.service.js]
    HealthCtrl --> HealthCtrl

    DoctorService --> ClinicalContextService
    TimelineService --> ClinicalContextService

    ConsultationService --> QueueService[queue.service.js]
    QueueService --> RedisConfig[redis.js]

    Worker[worker.js] --> AIService[ai.service.js]
    Worker --> ConsultationRepo[consultation.repository.js]
    AIService --> GeminiConfig[gemini.js]

    PatientService --> PatientRepo[patient.repository.js]
    ConsultationService --> ConsultationRepo[consultation.repository.js]
    ClinicalContextService --> ClinicalContextRepo[clinicalContext.repository.js]
    DoctorService --> DoctorRepo[doctor.repository.js]
    ClinicService --> ClinicRepo[clinic.repository.js]
    TimelineService --> TimelineRepo[timeline.repository.js]

    PatientRepo --> PrismaConfig[prisma.js]
    ConsultationRepo --> PrismaConfig[prisma.js]
    ClinicalContextRepo --> PrismaConfig[prisma.js]
    DoctorRepo --> PrismaConfig[prisma.js]
    ClinicRepo --> PrismaConfig[prisma.js]
    TimelineRepo --> PrismaConfig[prisma.js]
    PrismaConfig --> DB[(PostgreSQL)]
```

---

## 16. Environment Variables

Create a `.env` file in the `server/` root containing:

| Variable | Type | Description |
| :--- | :--- | :--- |
| `PORT` | Number | Port Express will listen on (default: `5000`). |
| `NODE_ENV` | String | Environment state (`development` or `production`). |
| `DATABASE_URL` | String | Connection string: `postgresql://user:pass@host:port/db?schema=public`. |
| `JWT_SECRET` | String | Secret key to sign and verify JWT tokens. |
| `JWT_EXPIRY` | String | Expiry length of tokens (e.g. `24h`, `7d`). |
| `REDIS_HOST` | String | Hostname of the Redis database (default: `127.0.0.1`). |
| `REDIS_PORT` | Number | Port of the Redis database (default: `6379`). |
| `REDIS_PASSWORD`| String | Optional Redis connection password. |
| `LIVEKIT_API_KEY`| String | Key credentials for LiveKit token signing. |
| `LIVEKIT_API_SECRET`|String| Secret credentials for LiveKit token signing. |
| `GEMINI_API_KEY` | String | API key to access Google Gemini models. |
| `GEMINI_MODEL` | String | Gemini model identifier (default: `gemini-2.5-flash`). |

---

## 17. Frontend Plan

The frontend will be built using **React, Vite, and Tailwind CSS**.
*   **Authentication State**: The React app will store the JWT token in `localStorage` or secure cookies. It will attach the token to all outgoing requests via an Axios interceptor:
    ```javascript
    axios.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    ```
*   **Views**:
    *   `Patient Dashboard`: Calls `GET /api/patient/profile` and displays list of past sessions using `GET /api/clinical-context/patient`.
    *   `Doctor Dashboard`: Calls `GET /api/doctor/dashboard` and lists sessions using `GET /api/doctor/consultations?status=claimed`.
    *   `Voice Room`: Requests a LiveKit token from `POST /api/livekit/:consultationId/token`, connects to LiveKit Cloud using their browser SDK, records audio, and posts text transcript chunks periodically using `POST /api/consultation/:id/chunks`.

---

## 18. Deployment Plan

*   **Docker Containerization**:
    *   We will deploy using a `docker-compose` stack in production.
    *   One container for the Express application (`node src/server.js`).
    *   One container running the BullMQ queue worker (`node src/modules/queue/worker.js`).
    *   Managed Redis and PostgreSQL instances (e.g. AWS RDS and AWS ElastiCache) for high availability.
*   **Reverse Proxy**: An Nginx container will map port `80/443` to the Express container and manage SSL termination.

---

## 19. Future Improvements

The following items were intentionally deferred to maintain a lean MVP:
1.  **Global Error Logging**: Add a logging library (like Winston or Pino) to output logs to an observability service (e.g., Datadog).
2.  **OAuth Integration**: Enable Google/Apple authentication. (Supported by our decoupled `User` profile architecture).
3.  **Token Blacklisting**: Implement Redis-based token revocation for secure logouts.
4.  **Notifications**: Setup notifications (SMS or email) to alert doctors when a new consultation enters the `PROCESSING` queue.

---

## 20. Important Design Decisions

1.  **Why a Monolithic Aggregation for Timeline?**
    *   *Decision*: If we stored the timeline in its own database table, we would duplicate data and have to write complex database triggers or synchronization code to handle updates to transcripts, AI models, and notes. Aggregating dynamically at read time via relational joins avoids synchronization bugs and maintains a single source of truth.
2.  **Why separate `User` from `Patient`/`Doctor` profiles?**
    *   *Decision*: Separating credentials from demographic data simplifies authentication queries, avoids sparse tables with null columns, and ensures we can add OAuth support or link new profile types (like `ClinicAdmin`) without modifying core security features.
3.  **Why use a Background Queue (BullMQ + Redis) for AI processing?**
    *   *Decision*: LLM processing times are unpredictable and can take several seconds. Doing this synchronously inside the Express request-response thread would block connections, leading to gateway timeouts and crashing the server under load. BullMQ ensures our APIs are non-blocking and handles job retries automatically.
4.  **Why use Schema-Enforced JSON Mime Types with Gemini?**
    *   *Decision*: Raw text LLM outputs are unstructured and prone to breaking changes. By utilizing Gemini's native `responseMimeType: 'application/json'` along with a strict `responseSchema`, we guarantee the response matches our database fields exactly, preventing parsing crashes.

---

## 21. Interview Explanation Guide

When discussing this project in technical interviews, describe it as a senior engineer:

> *"CortexCare is built as a **Modular Monolith** using Express 5, PostgreSQL, and Prisma. We chose a modular monolith to maintain high development velocity and simple deployments while preserving the ability to scale. The codebase is organized into self-contained domain slices. E.g., the `patient` and `auth` modules contain their own routes, services, and repositories.*
> 
> *To handle the slow processing times of Large Language Models without blocking the main event loop, we built an **asynchronous queue architecture** using **BullMQ and Redis**. When a patient completes a voice session, the HTTP request immediately returns a 200 OK. In the background, a decoupled BullMQ worker compiles the chronological transcript chunks, invokes the Gemini API using schema-constrained JSON outputs, and writes the structured clinical summary directly to the database. This design guarantees high API performance, database referential integrity, and runtime horizontal scalability."*
