/**
 * PromptBuilder — the only place in the codebase that constructs Gemini prompts.
 * Combines: system instructions, patient profile, conversation history,
 * attachment content, consultation state, and current message.
 */
export class PromptBuilder {
  /**
   * Build the ongoing conversation prompt for Gemini.
   * @param {object} opts
   * @param {object} opts.patient - Patient model with firstName, lastName
   * @param {object[]} opts.messages - Ordered message history
   * @param {object[]} opts.attachments - Uploaded files with optional extractedText
   * @param {object|null} opts.consultationState - JSON state blob from ClinicalContext
   * @param {string} opts.currentMessage - The patient's latest message
   */
  static buildConversationPrompt({ patient, messages, attachments, consultationState, currentMessage }) {
    const patientName = `${patient.firstName} ${patient.lastName}`;

    // Optimize token usage: Only send the last 8 messages for context
    const filteredMessages = messages.filter((m) => m.speaker !== 'SYSTEM');
    const recentMessages = filteredMessages.slice(-8);

    const historyText = recentMessages.length > 0
      ? recentMessages
          .map((m) => `${m.speaker === 'PATIENT' ? 'Patient' : 'AI'}: ${m.text}`)
          .join('\n')
      : 'No prior conversation.';

    // Optimize token usage: Limit extracted attachment text context to 300 characters
    const attachmentsText = attachments.length > 0
      ? attachments.map((att) => {
          const content = att.extractedText
            ? `\n  Extracted Content:\n  ${att.extractedText.slice(0, 300)}`
            : '';
          return `- ${att.fileName} (${att.fileType})${content}`;
        }).join('\n')
      : 'No files uploaded.';

    const stateText = consultationState
      ? `Known symptoms: ${(consultationState.knownSymptoms || []).join(', ') || 'none'}\nMissing info: ${(consultationState.missingInformation || []).join(', ') || 'none'}`
      : 'No state tracked yet.';

    return `You are the CortexCare AI Clinical Intake Assistant. Your purpose is to gather structured medical information from the patient before they consult a doctor. You are NOT a clinician.

# Guardrails
1. NEVER diagnose the patient.
2. NEVER prescribe or recommend medication.
3. NEVER use phrasing like "I think you have..." or "This sounds like...".
4. If asked for medical advice, redirect: "Your doctor will address that during your consultation."
5. For emergencies (chest pain, difficulty breathing, stroke signs), immediately instruct: "Please call 911 or go to the nearest ER now."

# Conversation Rules
1. Ask only ONE follow-up question per response.
2. Keep responses to 1–3 sentences maximum.
3. Be empathetic, calm, and professional.
4. Gather: chief complaint, duration, severity, timeline, medications, allergies, and medical history.
5. VARY YOUR OPENINGS: Do NOT repeat the same acknowledgment pattern (like "Thank you for sharing that, [name]") every turn. Sometimes use a brief, natural acknowledgment, and sometimes go straight to the next question.
6. VALIDATE IMPLAUSIBLE/INCONSISTENT VALUES: Notice when a patient provides a numeric or unit-based answer that seems inconsistent or implausible (e.g. pain level "15 out of 10", weight "3 pounds", taking "500 grams of ibuprofen", or duration mix-up). Ask a polite clarifying question about that specific value instead of silently accepting it.
7. ACKNOWLEDGE PATIENT EMOTION/DIRECTIVES: Explicitly acknowledge when a patient expresses urgency, frustration, or repeatedly requests to speak to the doctor directly, instead of ignoring it and repeating the intake script.
8. AVOID REDUNDANCY: Check the "Consultation State" and "Conversation History". Never re-ask for any information that has already been captured.

# Patient
Name: ${patientName}

# Consultation State
${stateText}

# Uploaded Documents
${attachmentsText}

# Conversation History
${historyText}

# Patient's New Message
Patient: ${currentMessage}

Respond empathetically and ask exactly ONE follow-up question.`.trim();
  }

  /**
   * Build the synthesis prompt for background clinical context generation.
   * @param {object} opts
   * @param {object} opts.patient - Patient model
   * @param {object[]} opts.messages - Full message history
   * @param {object[]} opts.attachments - Uploaded files with optional extractedText
   * @param {object[]} opts.pastHistory - Past clinical contexts
   */
  static buildSynthesisPrompt({ patient, messages, attachments, pastHistory = [] }) {
    const patientName = `${patient.firstName} ${patient.lastName}`;

    const transcript = messages
      .map((m) => `${m.speaker === 'PATIENT' ? 'Patient' : 'AI'}: ${m.text}`)
      .join('\n');

    const attachmentsText = attachments.length > 0
      ? attachments.map((a) => `[File: ${a.fileName}, Type: ${a.fileType}]\nContent: ${a.extractedText || 'None'}`).join('\n---\n')
      : 'No attachments.';

    let pastHistoryText = 'No previous medical history recorded in this clinic.';
    if (pastHistory && pastHistory.length > 0) {
      pastHistoryText = pastHistory.map((h, i) => {
        const dateStr = new Date(h.createdAt).toLocaleDateString('en-US');
        return `[Past Consultation on ${dateStr}]
- Chief Complaint: ${h.chiefComplaint}
- Illness Summary: ${h.presentIllness}
- Doctor Summary: ${h.doctorSummary || 'None'}`;
      }).join('\n\n');
    }

    return `You are an expert clinical documentation system. Analyze the intake transcript and documents below and return a structured JSON object for the doctor.

Patient: ${patientName}

# Patient Past Clinical History Context:
${pastHistoryText}

# Instructions for Synthesizing Current vs Past History:
If the patient has a past clinical history above:
1. Synthesize how the current symptoms compare to, build upon, or relate to their past history (e.g. is it a recurrence? worsening of an ongoing condition? a new, unrelated issue?).
2. Address this relationship explicitly in the "presentIllness" and "doctorSummary" fields of your JSON response.

Uploaded Documents:
${attachmentsText}

Intake Transcript:
${transcript}

Return ONLY a raw JSON object with these exact fields. No markdown, no explanation:
{
  "chiefComplaint": "Main reason for the visit in one sentence.",
  "presentIllness": "Narrative description of the current illness and symptom progression.",
  "pastMedicalHistory": ["List of past conditions or surgeries"],
  "currentMedications": [
    {
      "name": "Medication name",
      "dosage": "Dosage/frequency (e.g. 10mg daily, or none)",
      "status": "ongoing | as-needed | discontinued"
    }
  ],
  "allergies": ["List of allergies or none"],
  "lifestyle": {"smoking": "...", "alcohol": "...", "exercise": "..."},
  "symptoms": ["List of reported symptoms"],
  "timeline": ["Chronological progression of symptoms"],
  "riskFactors": ["Red flags or risk factors identified"],
  "riskLevel": "LOW | MEDIUM | HIGH",
  "recommendedSpecialist": "Type of specialist recommended",
  "doctorSummary": "Comprehensive clinical summary for the doctor.",
  "consultationState": {
    "knownSymptoms": ["symptoms gathered"],
    "missingInformation": ["any gaps in the intake"],
    "conversationComplete": true
  }
}

Rules for Medications:
Determine from the transcript and documents whether each medication the patient mentions is:
- "ongoing": The patient is currently taking it regularly.
- "as-needed": The patient takes it only when needed or on an irregular basis.
- "discontinued": The patient was taking it previously but stopped taking it recently.
If no dosage is mentioned, omit or write null for the dosage field.`.trim();
  }
}
