import type { SummaryDepth } from '@/types';

const SYSTEM_PROMPT = `You are a professional meeting summarizer. You receive raw voice-recorder transcriptions (often unedited, with filler words and informal speech) and transform them into clear, structured business documents. Always write in clean professional prose. Never include timestamps or speaker labels unless explicitly present and meaningful. Never hallucinate — only use information present in the transcription.`;

export { SYSTEM_PROMPT };

function buildLightPrompt(transcription: string): string {
  return `Summarize the following meeting transcription at a LIGHT level (target 150-250 words total).

Use exactly this structure — no extra sections:

**Headline**
One sentence capturing the core outcome or purpose of this meeting.

**Key Decisions**
- [3-5 bullet points, each a crisp decision or conclusion reached]

**Action Items**
- [Person or role]: [what they will do] — one bullet per action item

Do not add any other sections. Be concise. If a person's name is unclear, use "TBD" for ownership.

TRANSCRIPTION:
${transcription}`;
}

function buildMediumPrompt(transcription: string): string {
  return `Summarize the following meeting transcription at a MEDIUM level (target 400-600 words total).

Use exactly this structure:

**Context & Purpose**
1-2 sentences on why this meeting happened and what it aimed to achieve.

**Key Discussion Points**
Organize by topic. Use sub-headings if there are 2+ distinct topics. 2-4 sentences per topic.

**Decisions Made**
- [Bullet per decision — state what was decided, not how the discussion went]

**Action Items**
- [Owner name or role]: [Task description] — include any stated deadline

Do not add any other sections. Write in clean professional prose.

TRANSCRIPTION:
${transcription}`;
}

function buildDetailedPrompt(transcription: string): string {
  return `Summarize the following meeting transcription at a DETAILED level (target 800-1200 words total).

Use exactly this structure:

**Meeting Context & Participants**
State the apparent purpose, date/time if mentioned, and list participants if identifiable. If not mentioned, state "Not specified."

**Discussion Coverage**

For each major topic discussed, create a sub-section with a bold topic heading. Write 3-6 sentences covering what was discussed, key perspectives raised, and how the conversation progressed.

**Decisions & Rationale**
For each decision: state what was decided AND the reasoning or context that led to it. Use this format:
- **[Decision]:** [What was decided]. *Rationale:* [Why, as stated or implied in the discussion.]

**Detailed Action Items**
Use this format per item:
- **Owner:** [Name or role] | **Task:** [Full description] | **Deadline:** [Stated deadline or "Not specified"]

**Open Questions & Follow-ups**
List any unresolved questions, items explicitly deferred, or topics flagged for a future conversation.

Do not compress or abbreviate. Be thorough. Write in professional prose.

TRANSCRIPTION:
${transcription}`;
}

export function buildEmailPrompt(transcription: string): string {
  return `Based on the following meeting transcription, write a professional stakeholder update email for people who were NOT in the meeting. This is NOT a meeting summary — it is a professional communication informing stakeholders of outcomes and what they need to know.

Return your response as valid JSON with exactly this shape:
{"subject":"string — a concise, informative email subject line (max 10 words, no RE: prefix)","body":"string — the full email body as plain text with \\n for line breaks"}

The email body must follow this structure exactly:

Hi [Team],

[ONE sentence of context: what meeting happened, when if stated, and the core outcome. Do not assume the reader knows anything about this meeting.]

What Was Decided:
• [Decision 1 — written for an audience that wasn't there, audience-facing language]
• [Decision 2]
• [Decision 3-5 as needed]

What Happens Next:
• [Next step 1 — who is doing what and approximate timing if known]
• [Next step 2]
• [Additional next steps as needed]

Please reach out if you have any questions.

[Your name]

RULES:
- Tone: professional, clear, and concise. NOT conversational.
- Do NOT write meeting minutes. Write a stakeholder communication.
- Do NOT use jargon like "action items" or "key decisions" — use natural business language.
- The subject line must stand alone and make sense without reading the email.
- Output ONLY the JSON object. No markdown code fences, no extra text.

TRANSCRIPTION:
${transcription}`;
}

export function getPromptForDepth(transcription: string, depth: SummaryDepth): string {
  switch (depth) {
    case 'light':    return buildLightPrompt(transcription);
    case 'medium':   return buildMediumPrompt(transcription);
    case 'detailed': return buildDetailedPrompt(transcription);
  }
}
