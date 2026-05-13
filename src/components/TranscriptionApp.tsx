'use client';

import { useState } from 'react';
import TranscriptionInput from './TranscriptionInput';
import SummaryDepthSelector from './SummaryDepthSelector';
import SummaryOutput from './SummaryOutput';
import EmailOutput from './EmailOutput';
import LoadingSpinner from './LoadingSpinner';
import { downloadSummaryPDF } from '@/lib/pdfGenerator';
import { buildOutlookMailtoUrl } from '@/lib/mailtoBuilder';
import type { SummaryDepth, EmailSummary } from '@/types';

type Tab = 'summary' | 'email';

export default function TranscriptionApp() {
  const [transcription, setTranscription] = useState('');
  const [depth, setDepth] = useState<SummaryDepth>('medium');
  const [summary, setSummary] = useState<string | null>(null);
  const [emailSummary, setEmailSummary] = useState<EmailSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('summary');
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  const hasOutput = summary !== null;

  const handleGenerate = async () => {
    if (!transcription.trim()) return;
    setIsLoading(true);
    setError(null);
    setSummary(null);
    setEmailSummary(null);

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcription, depth, includeEmail: false }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      setSummary(data.summary);
      setEmailSummary(data.emailSummary ?? null);
      setActiveTab('summary');
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!summary) return;
    setIsPdfLoading(true);
    try {
      const date = new Date().toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
      });
      await downloadSummaryPDF(summary, depth, date);
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleOpenOutlook = () => {
    if (!emailSummary) return;
    window.location.href = buildOutlookMailtoUrl(emailSummary);
  };

  const handleGenerateEmail = async () => {
    if (!transcription.trim()) return;
    setIsEmailLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcription, depth, includeEmail: true, emailOnly: true }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      setEmailSummary(data.emailSummary ?? null);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleReset = () => {
    setTranscription('');
    setSummary(null);
    setEmailSummary(null);
    setError(null);
    setActiveTab('summary');
    setIsEmailLoading(false);
  };

  return (
    <div className="space-y-4">
      {/* Input */}
      <TranscriptionInput
        value={transcription}
        onChange={setTranscription}
        disabled={isLoading}
      />

      {/* Depth selector */}
      <SummaryDepthSelector
        value={depth}
        onChange={setDepth}
        disabled={isLoading}
      />

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={!transcription.trim() || isLoading}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-xl transition-colors duration-150 text-base shadow-sm"
      >
        {isLoading ? (
          <>
            <LoadingSpinner size={18} />
            Generating summary...
          </>
        ) : (
          'Generate Summary'
        )}
      </button>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Output panel */}
      {hasOutput && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-slate-200">
            {(['summary', 'email'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={[
                  'flex-1 py-3 text-sm font-semibold transition-colors',
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600 -mb-px'
                    : 'text-slate-500 hover:text-slate-700',
                ].join(' ')}
              >
                {tab === 'summary' ? 'Summary' : 'Email Format'}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-5">
            {activeTab === 'summary' && summary && (
              <>
                <SummaryOutput summary={summary} depth={depth} />

                {/* Action buttons */}
                <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100">
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isPdfLoading}
                    className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-800 disabled:opacity-60 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors"
                  >
                    {isPdfLoading ? (
                      <LoadingSpinner size={14} />
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    )}
                    Download PDF
                  </button>

                  <button
                    onClick={handleReset}
                    className="text-sm text-slate-400 hover:text-slate-600 transition-colors px-2"
                  >
                    Start Over
                  </button>
                </div>
              </>
            )}

            {activeTab === 'email' && (
              emailSummary ? (
                <EmailOutput
                  emailSummary={emailSummary}
                  onOpenOutlook={handleOpenOutlook}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-500 mb-4">
                    Generate a professional stakeholder email based on this transcription.
                  </p>
                  <button
                    onClick={handleGenerateEmail}
                    disabled={isEmailLoading}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold py-2.5 px-5 rounded-lg transition-colors"
                  >
                    {isEmailLoading ? (
                      <>
                        <LoadingSpinner size={14} />
                        Generating email...
                      </>
                    ) : (
                      'Generate Email'
                    )}
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
