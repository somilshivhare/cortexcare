# CortexCare Frontend Architecture Document

This document outlines the architecture, layout system, component structure, and integration guidelines for the CortexCare frontend clinical intake platform.

---

## 1. Tech Stack Overview
*   **Framework**: React 19 & Vite.
*   **Routing**: React Router (supporting role-based protected routes).
*   **Styling**: Vanilla CSS and custom HSL variables.
*   **Animations**: Framer Motion for micro-animations (transitions, bubbles, states).
*   **Data Fetching**: TanStack Query (React Query v5) & Axios.
*   **Speech-to-Text**: Browser-native SpeechRecognition API wrapper.

---

## 2. Updated Folder Structure (`client/src/features/consultation/`)

The intake feature has been renamed to **AI Consultation**. The folders and files are organized as follows:
```text
consultation/
├── api/
│   └── consultationApi.js       # Centralized REST network actions
├── components/
│   ├── AIConsultationPage.jsx   # Main room orchestrator container view
│   ├── ChatWindow.jsx           # Scrolling viewport for message bubbles
│   ├── ChatInput.jsx            # Message text input box with microphone button
│   ├── MessageBubble.jsx        # Single chat message bubble (Patient/AI/System)
│   ├── UploadPreview.jsx        # File upload progress visualizer
│   └── SessionAttachments.jsx   # Side list displaying uploaded intake files
└── hooks/
    └── useSpeechToText.js       # Dictation microphone speech recognition hook
```

---

## 3. UI Routing & Route Guards
*   `/patient/dashboard`: Patient dashboard list.
*   `/patient/consultation/:consultationId?`: AI Intake consultation screen.
*   `/doctor/dashboard`: Assigned clinics case tables.
*   `/doctor/consultation/:id`: Comprehensive patient clinical details inspection.

Route access is gated by `RoleGuard` (verifies `PATIENT` or `DOCTOR` claims) and `AuthGuard` (checks active JWT sessions).

---

## 4. Voice Input (Speech-to-Text Dictation)
Instead of streaming realtime WebRTC audio tracks, the voice feature is built using client-side speech dictation:
- **SpeechRecognition API**: Dictates patient voice into text directly in the browser.
- **Microphone Button**: Toggles listening state. Renders red pulsing animations during speech capturing.
- **Textbox Population**: Transcribed results are appended directly to the textbox, allowing the patient to review and edit before sending.

---

## 5. Doctor Dashboard Layout
The clinician detail page renders clinical details in the following order:
1.  **Patient Profile Header**: Name, age, contact, clinic.
2.  **Conversation Logs**: Historical patient/AI messages.
3.  **Uploaded Files**: Case attachments list.
4.  **Clinical Context Card**: Redesigned summary, timeline, meds, risk levels, and recommended specialist.
5.  **Doctor Notes Form**: Realtime note-saving textarea.
6.  **Finalize Action**: Button to archive the review.
