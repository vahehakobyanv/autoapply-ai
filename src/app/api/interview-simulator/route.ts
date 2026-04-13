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

    if (action === 'start') {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are an interviewer conducting a job interview. Ask ONE interview question for a ${body.role || profile?.role || 'Software Developer'} position at ${body.company || 'a tech company'}. The question should be ${body.difficulty || 'medium'} difficulty and ${body.type || 'behavioral'} type. Be natural and conversational. Just ask the question, nothing else.`,
          },
          { role: 'user', content: 'Start the interview.' },
        ],
        temperature: 0.8,
      });

      return NextResponse.json({
        question: response.choices[0].message.content,
        questionNumber: 1,
      });
    }

    if (action === 'answer') {
      const { question, answer, role, company } = body;

      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are an expert interviewer evaluating a candidate's answer. Return ONLY valid JSON:
{
  "score": 1-10,
  "feedback": "2-3 sentences of constructive feedback",
  "strengths": ["what was good"],
  "improvements": ["what could be better"],
  "ideal_answer": "a brief ideal answer for comparison"
}`,
          },
          {
            role: 'user',
            content: `Role: ${role || 'Software Developer'}\nCompany: ${company || 'Tech Company'}\n\nQuestion: ${question}\n\nCandidate's Answer: ${answer}`,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.5,
      });

      return NextResponse.json(JSON.parse(response.choices[0].message.content || '{}'));
    }

    if (action === 'next_question') {
      const { previousQuestions, role, company, difficulty, type } = body;

      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are an interviewer. Ask the NEXT interview question for a ${role || 'Software Developer'} position at ${company || 'a tech company'}. Difficulty: ${difficulty || 'medium'}. Type: ${type || 'mixed'}. Don't repeat previous questions. Just ask the question naturally.`,
          },
          {
            role: 'user',
            content: `Previous questions asked:\n${(previousQuestions || []).join('\n')}\n\nAsk the next question.`,
          },
        ],
        temperature: 0.8,
      });

      return NextResponse.json({
        question: response.choices[0].message.content,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Interview simulator failed' }, { status: 500 });
  }
}
