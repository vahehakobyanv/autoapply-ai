import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient as createClient } from '@/lib/supabase/server';
import { parseCV } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const text = formData.get('text') as string | null;

    let cvText = text || '';

    if (file) {
      if (file.type === 'application/pdf') {
        // Read PDF as text (basic extraction)
        const buffer = Buffer.from(await file.arrayBuffer());
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfParse = require('pdf-parse');
        const pdf = await pdfParse(buffer);
        cvText = pdf.text;
      } else {
        // DOCX or plain text
        cvText = await file.text();
      }
    }

    if (!cvText.trim()) {
      return NextResponse.json({ error: 'No content to parse' }, { status: 400 });
    }

    const parsed = await parseCV(cvText);

    // Update profile with parsed data
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        name: parsed.name || undefined,
        role: parsed.role || undefined,
        skills: parsed.skills?.length ? parsed.skills : undefined,
        languages: parsed.languages?.length ? parsed.languages : undefined,
        location: parsed.location || undefined,
      })
      .eq('user_id', user.id);

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({ parsed, message: 'CV imported successfully' });
  } catch (error) {
    console.error('CV import error:', error);
    return NextResponse.json({ error: 'Failed to import CV' }, { status: 500 });
  }
}
