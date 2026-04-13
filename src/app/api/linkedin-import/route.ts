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

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const text = formData.get('text') as string | null;

  let content = '';

  if (file) {
    // Parse PDF
    const buffer = Buffer.from(await file.arrayBuffer());
    try {
      const pdfParse = await import('pdf-parse');
      const parseFn = (pdfParse as any).default || pdfParse;
      const pdf = await parseFn(buffer);
      content = pdf.text;
    } catch {
      return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 400 });
    }
  } else if (text) {
    content = text;
  } else {
    return NextResponse.json({ error: 'No file or text provided' }, { status: 400 });
  }

  if (!content.trim()) {
    return NextResponse.json({ error: 'No text found in the document' }, { status: 400 });
  }

  // Use AI to extract structured profile data
  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `Extract professional profile data from this LinkedIn profile or resume text. Return valid JSON:
{
  "name": "full name",
  "role": "current or desired job title",
  "location": "city, country",
  "experience": "entry|junior|mid|senior|lead based on total years",
  "skills": ["skill1", "skill2"],
  "languages": ["language1", "language2"],
  "summary": "2-3 sentence professional summary",
  "workExperience": [
    {"title": "job title", "company": "company name", "startDate": "start", "endDate": "end or Present", "description": "responsibilities"}
  ],
  "education": [
    {"degree": "degree name", "institution": "school name", "year": "graduation year"}
  ],
  "email": "email if found or empty string",
  "phone": "phone if found or empty string"
}
Extract as much detail as possible. If something isn't found, use empty string or empty array.`,
        },
        {
          role: 'user',
          content: content.slice(0, 6000),
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const parsed = JSON.parse(response.choices[0].message.content || '{}');

    // Update user profile
    await supabase
      .from('profiles')
      .update({
        name: parsed.name || undefined,
        role: parsed.role || undefined,
        location: parsed.location || undefined,
        experience: parsed.experience || undefined,
        skills: parsed.skills?.length > 0 ? parsed.skills : undefined,
        languages: parsed.languages?.length > 0 ? parsed.languages : undefined,
        onboarding_completed: true,
      })
      .eq('user_id', user.id);

    return NextResponse.json({
      profile: parsed,
      resumeContent: {
        name: parsed.name || '',
        role: parsed.role || '',
        email: parsed.email || '',
        phone: parsed.phone || '',
        location: parsed.location || '',
        summary: parsed.summary || '',
        experience: parsed.workExperience || [],
        education: parsed.education || [],
        skills: parsed.skills || [],
        languages: parsed.languages || [],
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to parse profile with AI' }, { status: 500 });
  }
}
