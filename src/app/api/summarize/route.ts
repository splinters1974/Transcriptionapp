import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { getPromptForDepth, buildEmailPrompt, SYSTEM_PROMPT } from '@/lib/prompts';
import type { SummarizeRequest, SummarizeResponse, EmailSummary } from '@/types';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  let body: SummarizeRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { transcription, depth, includeEmail } = body;

  if (!transcription?.trim()) {
    return NextResponse.json({ error: 'Transcription is required' }, { status: 400 });
  }
  if (transcription.length > 100_000) {
    return NextResponse.json({ error: 'Transcription too long (max ~100k characters)' }, { status: 400 });
  }

  const summaryPromise = client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: getPromptForDepth(transcription, depth) }],
  });

  const emailPromise = includeEmail
    ? client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: buildEmailPrompt(transcription) }],
      })
    : Promise.resolve(null);

  try {
    const [summaryMsg, emailMsg] = await Promise.all([summaryPromise, emailPromise]);

    const summary = (summaryMsg.content[0] as { text: string }).text;

    let emailSummary: EmailSummary | undefined;
    if (emailMsg) {
      const raw = (emailMsg.content[0] as { text: string }).text.trim();
      try {
        emailSummary = JSON.parse(raw) as EmailSummary;
      } catch {
        // Email parse failed — return summary only, don't crash
      }
    }

    return NextResponse.json({ summary, emailSummary } satisfies SummarizeResponse);
  } catch (err) {
    console.error('Claude API error:', err);
    return NextResponse.json({ error: 'Failed to generate summary. Please try again.' }, { status: 500 });
  }
}
