import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { getPromptForDepth, buildEmailPrompt, SYSTEM_PROMPT } from '@/lib/prompts';
import type { SummarizeRequest, SummarizeResponse, EmailSummary, SummaryDepth } from '@/types';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  let body: SummarizeRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { transcription, depth, includeEmail, emailOnly } = body;

  if (!transcription?.trim()) {
    return NextResponse.json({ error: 'Transcription is required' }, { status: 400 });
  }
  if (transcription.length > 100_000) {
    return NextResponse.json({ error: 'Transcription too long (max ~100k characters)' }, { status: 400 });
  }

  const maxTokensForDepth: Record<SummaryDepth, number> = {
    light: 512,
    medium: 1024,
    detailed: 2048,
  };

  const summaryPromise = emailOnly
    ? Promise.resolve(null)
    : client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: maxTokensForDepth[depth],
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: getPromptForDepth(transcription, depth) }],
      });

  const emailPromise = includeEmail
    ? client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: buildEmailPrompt(transcription) }],
      })
    : Promise.resolve(null);

  try {
    const [summaryMsg, emailMsg] = await Promise.all([summaryPromise, emailPromise]);

    const summary = summaryMsg ? (summaryMsg.content[0] as { text: string }).text : undefined;

    let emailSummary: EmailSummary | undefined;
    if (emailMsg) {
      const raw = (emailMsg.content[0] as { text: string }).text.trim();
      try {
        emailSummary = JSON.parse(raw) as EmailSummary;
      } catch {
        // Email parse failed — return summary only, don't crash
      }
    }

    return NextResponse.json({ summary, emailSummary } as SummarizeResponse);
  } catch (err) {
    console.error('Claude API error:', err);
    return NextResponse.json({ error: 'Failed to generate summary. Please try again.' }, { status: 500 });
  }
}
