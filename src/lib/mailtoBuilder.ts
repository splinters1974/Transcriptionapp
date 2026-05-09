import type { EmailSummary } from '@/types';

export function buildOutlookMailtoUrl(emailSummary: EmailSummary): string {
  const subject = encodeURIComponent(emailSummary.subject);
  const body = encodeURIComponent(emailSummary.body);
  return `mailto:?subject=${subject}&body=${body}`;
}
