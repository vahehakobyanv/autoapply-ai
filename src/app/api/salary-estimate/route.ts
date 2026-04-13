import { createServerSupabaseClient } from '@/lib/supabase/server';
import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { jobTitle, location, experience, skills } = await request.json();

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a salary research expert for the CIS region (Russia, Armenia, etc.) and global markets. Estimate salary ranges. Return valid JSON:
{
  "currency": "USD",
  "monthly": {"min": 2000, "mid": 3500, "max": 5000},
  "yearly": {"min": 24000, "mid": 42000, "max": 60000},
  "localCurrency": {"currency": "RUB", "monthly": {"min": 180000, "mid": 300000, "max": 450000}},
  "marketInsight": "Brief 1-2 sentence market analysis",
  "negotiationTips": ["Tip 1 for negotiation", "Tip 2"],
  "factors": [
    {"factor": "Remote work", "impact": "+10-20%"},
    {"factor": "Top company", "impact": "+15-30%"}
  ]
}
Be realistic with ranges based on actual market data for the specified region.`,
        },
        {
          role: 'user',
          content: `Estimate salary for:
Role: ${jobTitle}
Location: ${location || 'Remote'}
Experience: ${experience || 'mid'}
Key Skills: ${skills?.join(', ') || 'General'}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
    });

    return NextResponse.json(JSON.parse(response.choices[0].message.content || '{}'));
  } catch {
    return NextResponse.json({ error: 'Failed to estimate salary' }, { status: 500 });
  }
}
