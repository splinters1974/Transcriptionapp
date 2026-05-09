'use client';

import type { SummaryDepth } from '@/types';

interface Props {
  value: SummaryDepth;
  onChange: (d: SummaryDepth) => void;
  disabled: boolean;
}

const levels: { depth: SummaryDepth; label: string; sublabel: string }[] = [
  { depth: 'light',    label: 'Light',    sublabel: '~200 words' },
  { depth: 'medium',   label: 'Medium',   sublabel: '~500 words' },
  { depth: 'detailed', label: 'Detailed', sublabel: '~1000 words' },
];

export default function SummaryDepthSelector({ value, onChange, disabled }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
      <p className="text-sm font-semibold text-slate-700 mb-3">Summary Depth</p>
      <div className="flex">
        {levels.map(({ depth, label, sublabel }, i) => {
          const isActive = value === depth;
          const isFirst = i === 0;
          const isLast = i === levels.length - 1;

          return (
            <button
              key={depth}
              onClick={() => onChange(depth)}
              disabled={disabled}
              className={[
                'flex-1 py-2.5 px-3 text-center border transition-colors duration-150',
                isFirst ? 'rounded-l-lg' : '',
                isLast ? 'rounded-r-lg' : '',
                !isFirst ? '-ml-px' : '',
                isActive
                  ? 'bg-blue-600 border-blue-600 text-white z-10'
                  : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              ].join(' ')}
            >
              <div className="text-sm font-semibold leading-tight">{label}</div>
              <div className={`text-xs mt-0.5 ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                {sublabel}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
