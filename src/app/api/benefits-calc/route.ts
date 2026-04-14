import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient as createClient } from '@/lib/supabase/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { offers } = await req.json();

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `Compare total compensation packages including benefits. Calculate the total value of each offer. Return ONLY valid JSON:
{
  "comparisons": [
    {
      "company": "name",
      "base_salary": 100000,
      "bonus_value": 10000,
      "equity_annual_value": 15000,
      "benefits_value": 8000,
      "pto_value": 5000,
      "total_compensation": 138000,
      "notes": "key highlights"
    }
  ],
  "winner": "company with highest total comp",
  "analysis": "2-3 sentences comparing the packages"
}`,
        },
        {
          role: 'user',
          content: `Compare these offers:\n${offers.map((o: Record<string, unknown>, i: number) => `Offer ${i+1}: ${o.company} - $${o.salary} base, ${o.bonus || 'no bonus'}, ${o.equity || 'no equity'}, ${o.pto_days || '?'} PTO days, Benefits: ${(o.benefits as string[])?.join(', ') || 'standard'}`).join('\n')}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
    });

    return NextResponse.json(JSON.parse(response.choices[0].message.content || '{}'));
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
