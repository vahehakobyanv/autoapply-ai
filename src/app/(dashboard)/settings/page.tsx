'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Check, Share2, Send, Unlink, ExternalLink, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Profile } from '@/types';

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [telegramStatus, setTelegramStatus] = useState<{
    connected: boolean;
    linkUrl?: string;
    chatId?: string;
  }>({ connected: false });
  const [telegramLoading, setTelegramLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchProfile();
    fetchTelegramStatus();
  }, []);

  const fetchProfile = async () => {
    const res = await fetch('/api/profile');
    const data = await res.json();
    if (data.id) setProfile(data);
    setLoading(false);
  };

  const fetchTelegramStatus = async () => {
    try {
      const res = await fetch('/api/telegram');
      const data = await res.json();
      setTelegramStatus(data);
    } catch {
      // Telegram not configured
    }
  };

  const saveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          role: profile.role,
          location: profile.location,
          experience: profile.experience,
          skills: profile.skills,
          languages: profile.languages,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success('Profile updated!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const disconnectTelegram = async () => {
    setTelegramLoading(true);
    try {
      await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'disconnect' }),
      });
      setTelegramStatus({ connected: false });
      toast.success('Telegram disconnected');
      fetchTelegramStatus();
    } catch {
      toast.error('Failed to disconnect');
    } finally {
      setTelegramLoading(false);
    }
  };

  const testTelegram = async () => {
    setTelegramLoading(true);
    try {
      const res = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test' }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Test notification sent! Check your Telegram.');
      } else {
        toast.error(data.error || 'Failed to send test');
      }
    } catch {
      toast.error('Failed to send test');
    } finally {
      setTelegramLoading(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/register?ref=${profile?.user_id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and preferences</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={profile?.name || ''}
                onChange={(e) => setProfile((p) => p && { ...p, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={profile?.location || ''}
                onChange={(e) => setProfile((p) => p && { ...p, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Desired Role</Label>
              <Input
                value={profile?.role || ''}
                onChange={(e) => setProfile((p) => p && { ...p, role: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Experience</Label>
              <Select
                value={profile?.experience || ''}
                onValueChange={(v) => { if (v) setProfile((p) => p && { ...p, experience: v }); }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="mid">Mid-Level</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex flex-wrap gap-1">
              {profile?.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <Button onClick={saveProfile} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      {/* Telegram Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" /> Telegram Notifications
          </CardTitle>
          <CardDescription>
            Get instant notifications when applications are sent, new jobs found, or interviews scheduled
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {telegramStatus.connected ? (
            <>
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                <span className="text-sm text-green-700 font-medium">Connected to Telegram</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  Chat ID: {telegramStatus.chatId}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={testTelegram} disabled={telegramLoading}>
                  {telegramLoading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Send className="h-3 w-3 mr-1" />}
                  Send Test
                </Button>
                <Button variant="outline" size="sm" onClick={disconnectTelegram} disabled={telegramLoading}>
                  <Unlink className="h-3 w-3 mr-1" /> Disconnect
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                <div className="h-2 w-2 bg-slate-300 rounded-full" />
                <span className="text-sm text-slate-600">Not connected</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Click the button below to connect your Telegram account:
                </p>
                {telegramStatus.linkUrl ? (
                  <a href={telegramStatus.linkUrl} target="_blank" rel="noopener noreferrer">
                    <Button>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Connect Telegram Bot
                    </Button>
                  </a>
                ) : (
                  <Button onClick={fetchTelegramStatus}>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading...
                  </Button>
                )}
                <p className="text-xs text-muted-foreground">
                  This will open @autoapply_ai_bot in Telegram. Click Start to connect.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Referral Program */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" /> Referral Program
          </CardTitle>
          <CardDescription>
            Invite friends and get 5 free application credits for each signup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              readOnly
              value={`${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${profile?.user_id || ''}`}
              className="font-mono text-sm"
            />
            <Button variant="outline" onClick={copyReferralLink}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
