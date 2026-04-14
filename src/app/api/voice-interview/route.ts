import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient as createClient } from '@/lib/supabase/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { action } = body;

    if (action === 'evaluate_voice') {
      const { transcript, question, role } = body;

      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `Evaluate a spoken interview answer. The transcript is from speech-to-text so may have minor errors. Score communication quality too. Return ONLY valid JSON:
{
  "score": 1-10,
  "communication_score": 1-10,
  "clarity": "how clear and structured the answer was",
  "feedback": "2-3 sentences of constructive feedback",
  "filler_words": ["um", "uh", "like"],
  "filler_count": 5,
  "strengths": ["what was good"],
  "improvements": ["what to improve"],
  "confidence_level": "low|medium|high"
}`,
          },
          {
            role: 'user',
            content: `Role: ${role || 'Software Developer'}\nQuestion: ${question}\nSpoken Answer (transcript): ${transcript}`,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.5,
      });

      return NextResponse.json(JSON.parse(response.choices[0].message.content || '{}'));
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
