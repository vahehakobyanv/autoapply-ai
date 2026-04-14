import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient as createClient } from '@/lib/supabase/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { from_city, to_city, salary } = await req.json();

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `Compare cost of living between two cities for a tech professional. Return ONLY valid JSON:
{
  "from": {"city": "name", "col_index": 100, "avg_rent": "$X", "avg_food": "$X/mo", "transport": "$X/mo", "internet": "$X/mo"},
  "to": {"city": "name", "col_index": 120, "avg_rent": "$X", "avg_food": "$X/mo", "transport": "$X/mo", "internet": "$X/mo"},
  "cost_difference_percent": 20,
  "equivalent_salary": "$X (salary needed in target city to maintain same lifestyle)",
  "summary": "2-3 sentences comparing the cities",
  "pros": ["advantage of moving"],
  "cons": ["disadvantage of moving"],
  "recommendation": "1 sentence recommendation"
}`,
        },
        {
          role: 'user',
          content: `Compare: ${from_city} → ${to_city}${salary ? `\nCurrent salary: ${salary}` : ''}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
    });

    return NextResponse.json(JSON.parse(response.choices[0].message.content || '{}'));
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
