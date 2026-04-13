'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, X, Plus, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const STEPS = ['Name & Location', 'Job Role', 'Experience', 'Skills', 'Languages'];

const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level (0-1 years)' },
  { value: 'junior', label: 'Junior (1-3 years)' },
  { value: 'mid', label: 'Mid-Level (3-5 years)' },
  { value: 'senior', label: 'Senior (5-8 years)' },
  { value: 'lead', label: 'Lead/Principal (8+ years)' },
];

const COMMON_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'SQL',
  'HTML/CSS', 'Git', 'Docker', 'AWS', 'Figma', 'Agile', 'REST API', 'GraphQL',
];

const COMMON_LANGUAGES = ['English', 'Russian', 'Armenian', 'German', 'French', 'Spanish'];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLinkedInImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/linkedin-import', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Auto-fill all fields
      if (data.profile.name) setName(data.profile.name);
      if (data.profile.location) setLocation(data.profile.location);
      if (data.profile.role) setRole(data.profile.role);
      if (data.profile.experience) setExperience(data.profile.experience);
      if (data.profile.skills?.length) setSkills(data.profile.skills);
      if (data.profile.languages?.length) setLanguages(data.profile.languages);

      toast.success('Profile imported from LinkedIn! Review and click Complete.');
      setStep(4); // Jump to last step
    } catch (err: any) {
      toast.error(err.message || 'Failed to import');
    } finally {
      setImporting(false);
    }
  };

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput('');
  };

  const toggleLanguage = (lang: string) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleComplete = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        name,
        location,
        role,
        experience,
        skills,
        languages,
        onboarding_completed: true,
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Failed to save profile:', error);
      setLoading(false);
      return;
    }

    // Send welcome notification (fire and forget)
    fetch('/api/welcome', { method: 'POST' }).catch(() => {});

    router.push('/dashboard');
    router.refresh();
  };

  const canProceed = () => {
    switch (step) {
      case 0: return name.trim() && location.trim();
      case 1: return role.trim();
      case 2: return experience;
      case 3: return skills.length > 0;
      case 4: return languages.length > 0;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold">AutoApply AI</span>
          </div>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Step {step + 1} of {STEPS.length}: {STEPS[step]}
          </CardDescription>
          {/* Progress bar */}
          <div className="flex gap-1 mt-4">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= step ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* LinkedIn Quick Import */}
          {step === 0 && (
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 text-center space-y-2">
              <p className="text-sm font-medium">Quick Start: Import from LinkedIn</p>
              <p className="text-xs text-muted-foreground">
                Download your LinkedIn profile as PDF, then upload it here
              </p>
              <label className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-blue-700 transition-colors">
                {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {importing ? 'Importing...' : 'Upload LinkedIn PDF'}
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleLinkedInImport}
                  disabled={importing}
                />
              </label>
              <p className="text-[10px] text-muted-foreground">
                LinkedIn → Profile → More → Save to PDF
              </p>
            </div>
          )}

          {/* Step 1: Name & Location */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Moscow, Russia / Yerevan, Armenia"
                />
              </div>
            </div>
          )}

          {/* Step 2: Role */}
          {step === 1 && (
            <div className="space-y-2">
              <Label htmlFor="role">Desired Job Role</Label>
              <Input
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Frontend Developer, Product Manager, etc."
              />
            </div>
          )}

          {/* Step 3: Experience */}
          {step === 2 && (
            <div className="space-y-2">
              <Label>Experience Level</Label>
              <Select value={experience} onValueChange={(v) => { if (v) setExperience(v); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Step 4: Skills */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill(skillInput);
                    }
                  }}
                  placeholder="Type a skill and press Enter"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => addSkill(skillInput)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1">
                    {skill}
                    <button onClick={() => setSkills(skills.filter((s) => s !== skill))}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Popular skills:</p>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SKILLS.filter((s) => !skills.includes(s)).map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="cursor-pointer hover:bg-slate-100"
                      onClick={() => addSkill(skill)}
                    >
                      + {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Languages */}
          {step === 4 && (
            <div className="space-y-4">
              <Label>Select languages you speak</Label>
              <div className="flex flex-wrap gap-2">
                {COMMON_LANGUAGES.map((lang) => (
                  <Badge
                    key={lang}
                    variant={languages.includes(lang) ? 'default' : 'outline'}
                    className="cursor-pointer text-sm py-1.5 px-3"
                    onClick={() => toggleLanguage(lang)}
                  >
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 0}
            >
              Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                Next
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={!canProceed() || loading}>
                {loading ? 'Saving...' : 'Complete Setup'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
