# CortexCare Backend Handover Document — AI Clinical Intake Platform

This document outlines the architecture, data models, APIs, and design decisions for the CortexCare backend codebase. It details the transition to the **AI Clinical Intake Platform** (replacing the previous LiveKit voice consultation integration).

---

## 1. Project Overview & Architecture Style

CortexCare is an **AI-powered Clinical Workflow Platform** designed to collect structured patient intake details before they consult a doctor. The platform is designed as a **Modular Monolith** divided into self-contained domain slices.

```text
Patient
  │ (React Client SPA)
  ▼
Express API Router
  │
  ├─► [auth] Module ➔ Hashing, JWTs, and RBAC Guardrails
  ├─► [patient] Module ➔ Profiles & Onboarding
  ├─► [clinic] Module ➔ Invite codes & Clinic scopes
  ├─► [doctor] Module ➔ Patient claim queues & reviews
  ├─► [timeline] Module ➔ Historical event feeds
  │
  └─► [consultation] Module (AI Intake Orchestration Slices)
        ├─► controllers/ (Session, messages, attachments)
        ├─► services/ (ConsultationService, AttachmentService, ClinicalContextService)
        ├─► ai/ (PromptBuilder, GeminiClient, ResponseParser)
        ├─► queues/ & workers/ (BullMQ synthesis runner)
```

---

## 2. Technical Stack
*   **Runtime**: Node.js (ES Modules syntax).
*   **Web Server**: Express 5 (native async handler support).
*   **Database**: Neon PostgreSQL via Prisma ORM.
*   **Background Tasks**: BullMQ with Redis.
*   **Generative AI**: Google Gemini API (via the `@google/genai` SDK).
*   **Storage**: Cloudinary for patient records.

---

## 3. Modular Folder Structure (`server/src/modules/consultation/`)

All logic for the clinical intake is encapsulated inside the `consultation/` directory slice:
*   `controllers/`: Handles parameters, calls services, maps standard HTTP codes.
*   `services/consultation.service.js`: Orchestrates patient message saves, loads history, fetches LLM prompts, and returns AI replies.
*   `services/attachment.service.js`: Streams files to Cloudinary, stores references, and extracts document texts.
*   `services/clinicalContext.service.js`: Triggered by queues to coordinate context generation.
*   `ai/PromptBuilder.js`: Constructs prompts for conversation and final JSON synthesis.
*   `ai/GeminiClient.js`: Contains all Google Gemini model interactions.
*   `ai/ResponseParser.js`: Parses and structures raw Gemini JSON texts.
*   `queues/`: BullMQ queue definitions.
*   `workers/`: Background BullMQ synthesis worker.

---

## 4. Prisma Schema Design
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

model Message {
  id             String       @id @default(uuid())
  consultationId String
  consultation   Consultation @relation(fields: [consultationId], references: [id], onDelete: Cascade)
  speaker        SpeakerRole  // PATIENT, AI, SYSTEM
  text           String
  sequence       Int
  createdAt      DateTime     @default(now())

  @@unique([consultationId, sequence])
  @@map("messages")
}

model Attachment {
  id             String       @id @default(uuid())
  consultationId String
  consultation   Consultation @relation(fields: [consultationId], references: [id], onDelete: Cascade)
  fileName       String
  fileType       String
  cloudinaryUrl  String
  publicId       String
  extractedText  String?
  uploadedAt     DateTime     @default(now())

  @@map("attachments")
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
  consultationState     Json         // Known symptoms, missing info, completion flag
  createdAt             DateTime     @default(now())
  updatedAt             DateTime     @updatedAt

  @@map("clinical_contexts")
}
```

---

## 5. Flow Sequence Mappings

### Conversation Interaction
1.  Patient posts message to `POST /api/consultation/:id/messages`.
2.  `consultation.service.js` saves the message with a sequence index.
3.  Loads historical messages, attachments, and current consultation state.
4.  Calls `PromptBuilder.buildConversationPrompt` to get the LLM instruction text.
5.  `GeminiClient.generateConversationReply` calls Gemini for the AI response.
6.  The AI response is saved in the database under `Message` and returned.

### Asynchronous Clinical Synthesis
1.  Patient finishes consultation: `POST /api/consultation/:id/finalize`.
2.  Status is updated to `PROCESSING` and a job is enqueued in BullMQ.
3.  `consultation.worker.js` handles the job and forwards it to `clinicalContext.service.js`.
4.  `clinicalContext.service.js` compiles the history and files, constructs the synthesis prompt, and fetches the JSON summary via `GeminiClient.generateClinicalContext`.
5.  `ResponseParser.js` parses the result into the strongly-typed database model.
6.  The context record is saved, and status becomes `COMPLETED`.
