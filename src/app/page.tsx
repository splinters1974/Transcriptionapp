import TranscriptionApp from '@/components/TranscriptionApp';

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Transcription Summarizer
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Paste a Plaud transcription, choose your summary depth, and generate a structured summary or stakeholder email.
        </p>
      </div>
      <TranscriptionApp />
    </main>
  );
}
