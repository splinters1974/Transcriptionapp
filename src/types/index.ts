export type SummaryDepth = 'light' | 'medium' | 'detailed';

export interface SummarizeRequest {
  transcription: string;
  depth: SummaryDepth;
  includeEmail: boolean;
}

export interface EmailSummary {
  subject: string;
  body: string;
}

export interface SummarizeResponse {
  summary: string;
  emailSummary?: EmailSummary;
  error?: string;
}
