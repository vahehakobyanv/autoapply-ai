import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient as createClient } from '@/lib/supabase/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { action, skill, difficulty, question, user_answer } = await req.json();

    if (action === 'generate') {
      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `Generate 10 multiple-choice quiz questions to assess the skill "${skill}" at ${difficulty || 'intermediate'} level. Return ONLY valid JSON:
{
  "questions": [
    {
      "id": 1,
      "question": "What is...",
      "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
      "correct": "B",
      "explanation": "why B is correct"
    }
  ]
}`,
          },
          { role: 'user', content: `Generate a ${difficulty || 'intermediate'} quiz for: ${skill}` },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.6,
      });

      return NextResponse.json(JSON.parse(response.choices[0].message.content || '{}'));
    }

    if (action === 'evaluate') {
      return NextResponse.json({ correct: user_answer === question?.correct });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
