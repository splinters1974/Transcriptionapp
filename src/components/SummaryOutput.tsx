'use client';

import ReactMarkdown from 'react-markdown';
import type { SummaryDepth } from '@/types';

interface Props {
  summary: string;
  depth: SummaryDepth;
}

const depthLabels: Record<SummaryDepth, string> = {
  light: 'Light Summary',
  medium: 'Medium Summary',
  detailed: 'Detailed Summary',
};

export default function SummaryOutput({ summary, depth }: Props) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {depthLabels[depth]}
        </span>
      </div>
      <div className="prose prose-slate prose-sm max-w-none">
        <ReactMarkdown>{summary}</ReactMarkdown>
      </div>
    </div>
  );
}
