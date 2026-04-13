import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

const MODEL = 'llama-3.3-70b-versatile';

export async function generateResume(
  profile: {
    name: string;
    role: string;
    skills: string[];
    experience: string;
    languages: string[];
    location: string;
  },
  language: string
): Promise<string> {
  const langLabel = language === 'ru' ? 'Russian' : language === 'hy' ? 'Armenian' : 'English';

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: `You are a professional resume writer. Generate a complete, well-structured resume in ${langLabel}. Return ONLY valid JSON matching this structure:
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
  language: string
): Promise<string> {
  const langLabel = language === 'ru' ? 'Russian' : language === 'hy' ? 'Armenian' : 'English';

  const response = await groq.chat.completions.create({
    model: MODEL,
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
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: `Extract job details from the provided content. Return ONLY valid JSON:
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

export async function analyzeRejection(
  profile: { name: string; role: string; skills: string[]; experience: string },
  jobTitle: string,
  jobDescription: string,
  jobRequirements: string
): Promise<{
  match_score: number;
  gaps: { category: string; description: string; severity: string; action: string }[];
  suggestions: string[];
}> {
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: `You are a career coach AI. Analyze why a candidate might not match a job and provide actionable feedback. Return ONLY valid JSON:
{
  "match_score": 0-100,
  "gaps": [{"category": "skills|experience|education|location|seniority", "description": "what's missing", "severity": "low|medium|high", "action": "specific step to fix"}],
  "suggestions": ["actionable improvement tip"]
}`,
      },
      {
        role: 'user',
        content: `Candidate: ${profile.name}, ${profile.role}\nSkills: ${profile.skills.join(', ')}\nExperience: ${profile.experience}\n\nJob: ${jobTitle}\nDescription: ${jobDescription.slice(0, 2000)}\nRequirements: ${jobRequirements.slice(0, 1000)}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.5,
  });

  return JSON.parse(response.choices[0].message.content || '{}');
}

export async function generateCompanyInsights(companyName: string): Promise<{
  summary: string;
  culture: string;
  salary_range: string;
  interview_process: string;
  pros: string[];
  cons: string[];
  rating: number;
  employee_count: string;
  industry: string;
  headquarters: string;
}> {
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: `You are a company research AI. Provide detailed insights about a company for job seekers. Return ONLY valid JSON:
{
  "summary": "2-3 sentence company overview",
  "culture": "description of company culture",
  "salary_range": "typical salary range for tech roles",
  "interview_process": "typical interview steps",
  "pros": ["pro1", "pro2", "pro3"],
  "cons": ["con1", "con2"],
  "rating": 3.5,
  "employee_count": "1000-5000",
  "industry": "Technology",
  "headquarters": "City, Country"
}`,
      },
      {
        role: 'user',
        content: `Provide detailed insights about: ${companyName}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.6,
  });

  return JSON.parse(response.choices[0].message.content || '{}');
}

export async function generatePortfolio(profile: {
  name: string;
  role: string;
  skills: string[];
  experience: string;
  languages: string[];
}): Promise<{
  title: string;
  bio: string;
  sections: { type: string; visible: boolean; content: Record<string, unknown> }[];
}> {
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: `Generate portfolio website content. Return ONLY valid JSON:
{
  "title": "Name — Role",
  "bio": "2-3 sentence professional bio",
  "sections": [
    {"type": "hero", "visible": true, "content": {"headline": "string", "subheadline": "string"}},
    {"type": "about", "visible": true, "content": {"text": "about paragraph"}},
    {"type": "experience", "visible": true, "content": {"items": [{"title": "string", "company": "string", "period": "string", "description": "string"}]}},
    {"type": "skills", "visible": true, "content": {"categories": [{"name": "string", "items": ["skill1"]}]}},
    {"type": "projects", "visible": true, "content": {"items": [{"name": "string", "description": "string", "tech": ["string"]}]}},
    {"type": "contact", "visible": true, "content": {"email": "", "message": "string"}}
  ]
}`,
      },
      {
        role: 'user',
        content: `Generate portfolio for:\nName: ${profile.name}\nRole: ${profile.role}\nSkills: ${profile.skills.join(', ')}\nExperience: ${profile.experience}\nLanguages: ${profile.languages.join(', ')}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  return JSON.parse(response.choices[0].message.content || '{}');
}

export async function parseCV(text: string): Promise<{
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  languages: string[];
  experience: { title: string; company: string; startDate: string; endDate: string; description: string }[];
  education: { degree: string; institution: string; year: string }[];
}> {
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: `Parse the CV/resume text into structured data. Return ONLY valid JSON:
{
  "name": "string", "role": "string", "email": "", "phone": "", "location": "",
  "summary": "professional summary",
  "skills": ["skill1"], "languages": ["lang1"],
  "experience": [{"title": "string", "company": "string", "startDate": "string", "endDate": "string", "description": "string"}],
  "education": [{"degree": "string", "institution": "string", "year": "string"}]
}`,
      },
      { role: 'user', content: text.slice(0, 6000) },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });

  return JSON.parse(response.choices[0].message.content || '{}');
}

export async function searchJobsAI(
  keywords: string[],
  locations: string[],
  profile: { role: string; skills: string[] }
): Promise<{
  jobs: { title: string; company: string; url: string; salary: string; location: string; match_score: number; source: string }[];
}> {
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: `You are a job search assistant. Based on criteria, generate realistic job recommendations for hh.ru and staff.am markets. Return ONLY valid JSON:
{
  "jobs": [{"title": "string", "company": "string", "url": "", "salary": "string", "location": "string", "match_score": 85, "source": "hh.ru"}]
}
Generate 5-10 relevant jobs.`,
      },
      {
        role: 'user',
        content: `Keywords: ${keywords.join(', ')}\nLocations: ${locations.join(', ')}\nRole: ${profile.role}\nSkills: ${profile.skills.join(', ')}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
  });

  return JSON.parse(response.choices[0].message.content || '{"jobs":[]}');
}
