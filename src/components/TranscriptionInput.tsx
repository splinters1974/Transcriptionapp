'use client';

interface Props {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}

function wordCount(text: string): number {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}

export default function TranscriptionInput({ value, onChange, disabled }: Props) {
  const words = wordCount(value);
  const chars = value.length;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-slate-700">
          Transcription
        </label>
        {value && (
          <button
            onClick={() => onChange('')}
            disabled={disabled}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-40"
            aria-label="Clear transcription"
          >
            Clear
          </button>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Paste your Plaud transcription here..."
        className="w-full min-h-48 max-h-[500px] resize-y text-sm text-slate-800 placeholder-slate-400 border-0 outline-none focus:ring-0 disabled:opacity-60 leading-relaxed"
        style={{ fontFamily: 'inherit' }}
      />
      <div className="flex justify-end mt-1">
        <span className="text-xs text-slate-400">
          {words.toLocaleString()} {words === 1 ? 'word' : 'words'} · {chars.toLocaleString()} characters
        </span>
      </div>
    </div>
  );
}
