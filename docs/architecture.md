# CortexCare AI Clinical Intake Platform Architecture

This document maps the architectural framework of the CortexCare AI Clinical Intake Platform. The platform enables patients to conduct pre-consultation intake sessions with an empathetic AI assistant that compiles structured medical information and files, generating a comprehensive clinical summary for doctors.

---

## 1. High-Level Architecture Overview

CortexCare is structured as a **Modular Monolith** on the backend and a **Feature-Sliced React SPA** on the frontend. The system decouples interactive patient conversation from background clinical processing using a message queue.

```mermaid
graph TD
    ClientApp[React Client SPA] -->|REST API| ExpressServer[Express Monolith Server]
    ExpressServer -->|Read/Write| PostgreSQL[(PostgreSQL Database)]
    ExpressServer -->|Enqueue Job| RedisQueue[(Redis Queue Store)]
    RedisQueue -->|Dequeue Job| BullMQWorker[BullMQ Background Worker]
    BullMQWorker -->|Generate Structured JSON| Gemini[Google Gemini AI]
    BullMQWorker -->|Save Clinical Context| PostgreSQL
    ExpressServer -->|Upload Document| Cloudinary[Cloudinary Media Server]
    Cloudinary -->|Return URL & Public ID| ExpressServer
```

---

## 2. Request & Execution Flows

### A. Conversation Flow (Realtime Text & Dictation)
Patients describe symptoms, medical history, and upload records. The conversation helper asks one concise follow-up question at a time to complete the profile.

```mermaid
sequenceDiagram
    autonumber
    actor Patient
    participant React as React Client (AIConsultationPage)
    participant Controller as ConsultationController
    participant Service as ConsultationService (Orchestrator)
    participant PB as PromptBuilder
    participant GC as GeminiClient
    participant DB as PostgreSQL Database

    Patient->>React: Enters message / dictates speech
    React->>Controller: POST /api/consultation/:id/messages { text }
    Controller->>Service: sendMessage(userId, consultationId, text)
    Service->>DB: Save Patient message (speaker=PATIENT, sequence=N)
    Service->>DB: Fetch patient profile, prior logs, and attachments
    DB-->>Service: Patient context data
    Service->>PB: buildConversationPrompt({ patient, messages, attachments, currentState })
    PB-->>Service: Compiled Prompt String
    Service->>GC: generateConversationReply(prompt)
    GC->>GC: Invoke Google Gemini API
    GC-->>Service: AI Reply (String)
    Service->>DB: Save AI message (speaker=AI, sequence=N+1)
    Service-->>Controller: Return { patientMessage, aiMessage }
    Controller-->>React: 201 Created { patientMessage, aiMessage }
    React-->>Patient: Render AI Response bubble
```

### B. Clinical Context Synthesis Flow (Asynchronous Background Job)
When the patient clicks "Finish Consultation", the session is locked, and a BullMQ job handles structured context extraction in the background.

```mermaid
sequenceDiagram
    autonumber
    actor Doctor
    participant Worker as BullMQ Worker
    participant CCS as ClinicalContextService
    participant PB as PromptBuilder
    participant GC as GeminiClient
    participant RP as ResponseParser
    participant DB as PostgreSQL Database
    participant Dashboard as Doctor Dashboard

    Note over Worker: Triggered on 'finalize' queue event
    Worker->>CCS: synthesizeClinicalContext(consultationId)
    CCS->>DB: Load consultation messages & attachments
    DB-->>CCS: Message logs, Attachment metadata
    CCS->>PB: buildSynthesisPrompt({ patient, messages, attachments })
    PB-->>CCS: Synthesis Prompt String
    CCS->>GC: generateClinicalContext(prompt)
    GC->>GC: Invoke Google Gemini (application/json)
    GC-->>CCS: Raw JSON String
    CCS->>RP: parseContextResponse(rawJsonString)
    RP-->>CCS: Strongly Typed Context Object
    CCS->>DB: Create ClinicalContext entry & set status=COMPLETED
    DB-->>CCS: Saved Record
    CCS-->>Worker: Job Completed
    Doctor->>Dashboard: Views Patient Consultation Case
    Dashboard->>DB: Fetch Claimed Case Details
    DB-->>Dashboard: Return full ClinicalContext details
    Dashboard-->>Doctor: Render structured sections (Timeline, Meds, etc.)
```

---

## 3. Folder Structure Blueprint

The folder hierarchy encapsulates all clinical intake logic under vertical slices.

### Frontend Folder Structure (`client/src/features/consultation/`)
```text
consultation/
├── api/
│   └── consultationApi.js       # API methods (create, fetch, send, upload, finalize)
├── components/
│   ├── AIConsultationPage.jsx   # Primary consultation screen controller
│   ├── ChatWindow.jsx           # Scrolling viewport for message history
│   ├── ChatInput.jsx            # Textarea input with Speech-to-Text mic button
│   ├── MessageBubble.jsx        # Single message item (Patient/AI/System)
│   ├── UploadPreview.jsx        # Preview pane for files queued for upload
│   └── SessionAttachments.jsx   # Right panel listing uploaded documents
└── hooks/
    └── useSpeechToText.js       # Browser-native SpeechRecognition wrapper hook
```

### Backend Folder Structure (`server/src/modules/consultation/`)
All consultation logic is consolidated inside the `consultation/` slice:
```text
consultation/
├── controllers/
│   └── consultation.controller.js   # Parses requests, delegates to services
├── services/
│   ├── consultation.service.js      # Session lifecycle & message routing service
│   ├── attachment.service.js        # File uploads, Cloudinary sync & text extractor
│   └── clinicalContext.service.js   # Background BullMQ synthesis processor service
├── ai/
│   ├── PromptBuilder.js             # Compiles LLM prompts with exact context state
│   ├── GeminiClient.js              # Interacts with the @google/genai SDK
│   └── ResponseParser.js            # Validates and structures Gemini JSON outputs
├── queues/
│   └── consultation.queue.js        # BullMQ queue declaration
└── workers/
    └── consultation.worker.js       # BullMQ worker process running background synthesis
```

---

## 4. Structured Database Design

The data layer supports comprehensive intake summaries and attachments:

### Consultation (`consultations` Table)
- Represents a single intake episode. Transitions: `SETUP` ➔ `ACTIVE` ➔ `PROCESSING` ➔ `COMPLETED` / `FAILED`.

### Message (`messages` Table)
- Replaces the generic transcript chunks. Captures chronological chat bubbles.
- Columns: `id`, `consultationId`, `speaker` (`PATIENT` | `AI` | `SYSTEM`), `text`, `sequence`, `createdAt`.

### Attachment (`attachments` Table)
- Stores files processed through Cloudinary.
- Columns: `id`, `consultationId`, `fileName`, `fileType`, `cloudinaryUrl`, `publicId`, `extractedText`, `uploadedAt`.

### ClinicalContext (`clinical_contexts` Table)
- 1-to-1 association with `Consultation`. Stores the structured output generated by Gemini:
  - `chiefComplaint`: String summary of the main concern.
  - `presentIllness`: Structured text mapping history of present illness.
  - `pastMedicalHistory`: Json list of chronic conditions, surgeries.
  - `currentMedications`: Json list of current medications.
  - `allergies`: Json list of drug/food allergies.
  - `lifestyle`: Json details of smoking, drinking, exercise.
  - `symptoms`: Json list of reported symptoms.
  - `timeline`: Json timeline log of symptom onset and progression.
  - `riskFactors`: Json list of red-flag symptoms or safety factors.
  - `riskLevel`: `LOW` | `MEDIUM` | `HIGH` string.
  - `recommendedSpecialist`: Target medical provider specialty.
  - `doctorSummary`: Comprehensive, human-readable summary block.
  - `consultationState`: JSON object storing state flags:
    ```json
    {
      "knownSymptoms": [],
      "missingInformation": [],
      "conversationComplete": false
    }
    ```
