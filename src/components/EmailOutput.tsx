'use client';

import { useState } from 'react';
import type { EmailSummary } from '@/types';

interface Props {
  emailSummary: EmailSummary;
  onOpenOutlook: () => void;
}

export default function EmailOutput({ emailSummary, onOpenOutlook }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopySubject = async () => {
    await navigator.clipboard.writeText(emailSummary.subject);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
          Suggested Subject Line
        </p>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
          <span className="flex-1 text-sm font-medium text-slate-700 font-mono">
            {emailSummary.subject}
          </span>
          <button
            onClick={handleCopySubject}
            className="text-xs text-slate-400 hover:text-slate-700 transition-colors shrink-0"
            title="Copy subject line"
          >
            {copied ? (
              <span className="text-green-600 font-medium">Copied!</span>
            ) : (
              <span>Copy</span>
            )}
          </button>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
          Email Body
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
            {emailSummary.body}
          </pre>
        </div>
      </div>

      <button
        onClick={onOpenOutlook}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M2 7l10 7 10-7" />
        </svg>
        Open in Outlook
      </button>

      <p className="text-xs text-slate-400 text-center">
        Opens your default email client with subject and body pre-filled. Add recipients and send.
      </p>
    </div>
  );
}
