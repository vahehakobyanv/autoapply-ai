import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateResume(
  profile: {
    name: string;
    role: string;
    skills: string[];
    experience: string;
    languages: string[];
    location: string;
  },
  language: 'en' | 'ru'
): Promise<string> {
  const langLabel = language === 'ru' ? 'Russian' : 'English';

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a professional resume writer. Generate a complete, well-structured resume in ${langLabel}. Return valid JSON matching this structure:
{
  "name": "string",
  "role": "string",
  "email": "",
  "phone": "",
  "location": "string",
  "summary": "2-3 sentence professional summary",
  "experience": [{"title": "string", "company": "string", "startDate": "string", "endDate": "string", "description": "string"}],
  "education": [{"degree": "string", "institution": "string", "year": "string"}],
  "skills": ["string"],
  "languages": ["string"]
}`,
      },
      {
        role: 'user',
        content: `Generate a professional resume for:
Name: ${profile.name}
Role: ${profile.role}
Skills: ${profile.skills.join(', ')}
Experience Level: ${profile.experience}
Languages: ${profile.languages.join(', ')}
Location: ${profile.location}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  return response.choices[0].message.content || '{}';
}

export async function generateCoverLetter(
  profile: {
    name: string;
    role: string;
    skills: string[];
    experience: string;
  },
  jobDescription: string,
  language: 'en' | 'ru'
): Promise<string> {
  const langLabel = language === 'ru' ? 'Russian' : 'English';

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a professional cover letter writer. Write a compelling, personalized cover letter in ${langLabel}. Keep it concise (3-4 paragraphs). Do not use markdown formatting.`,
      },
      {
        role: 'user',
        content: `Write a cover letter for:
Applicant: ${profile.name}, ${profile.role}
Skills: ${profile.skills.join(', ')}
Experience: ${profile.experience}

Job Description:
${jobDescription}`,
      },
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content || '';
}

export async function parseJobDescription(html: string): Promise<{
  title: string;
  company: string;
  description: string;
  requirements: string;
  salary?: string;
  location?: string;
}> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Extract job details from the provided content. Return valid JSON:
{
  "title": "job title",
  "company": "company name",
  "description": "job description summary",
  "requirements": "key requirements",
  "salary": "salary if mentioned or null",
  "location": "location if mentioned or null"
}`,
      },
      {
        role: 'user',
        content: html.slice(0, 4000),
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });

  return JSON.parse(response.choices[0].message.content || '{}');
}

export default openai;
