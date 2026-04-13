'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Users, Plus, UserPlus, Loader2, Crown, Shield, User, BarChart3, Trash2, Mail,
} from 'lucide-react';
import { toast } from 'sonner';

interface Team {
  id: string;
  name: string;
  slug: string;
  role: string;
  member_count: number;
  plan: string;
  created_at: string;
}

interface Member {
  id: string;
  user_id: string;
  role: string;
  profile?: { name: string; role: string; skills: string[] };
}

interface MemberStat {
  user_id: string;
  total: number;
  applied: number;
  interviews: number;
  offers: number;
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState<MemberStat[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await fetch('/api/teams');
      const data = await res.json();
      if (Array.isArray(data)) setTeams(data);
    } catch {} finally {
      setLoading(false);
    }
  };

  const createTeam = async () => {
    if (!teamName.trim()) return;
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', name: teamName }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success('Team created!');
      setShowCreate(false);
      setTeamName('');
      fetchTeams();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create team');
    }
  };

  const selectTeam = async (teamId: string) => {
    setSelectedTeam(teamId);
    // Fetch members and stats in parallel
    const [membersRes, statsRes] = await Promise.all([
      fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'members', team_id: teamId }),
      }),
      fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dashboard', team_id: teamId }),
      }),
    ]);

    const membersData = await membersRes.json();
    const statsData = await statsRes.json();

    if (Array.isArray(membersData)) setMembers(membersData);
    if (Array.isArray(statsData)) setStats(statsData);
  };

  const inviteMember = async () => {
    if (!inviteEmail.trim() || !selectedTeam) return;
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'invite', team_id: selectedTeam, email: inviteEmail }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success(`Invite sent to ${inviteEmail}`);
      setInviteEmail('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to invite');
    }
  };

  const roleIcon = (role: string) => {
    if (role === 'owner') return <Crown className="h-4 w-4 text-yellow-500" />;
    if (role === 'admin') return <Shield className="h-4 w-4 text-blue-500" />;
    return <User className="h-4 w-4 text-slate-400" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team Mode</h1>
          <p className="text-muted-foreground">Manage candidates as a recruiter, coach, or bootcamp</p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Team
        </Button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Team name" />
              <Button onClick={createTeam}>Create</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Teams List */}
      {teams.length === 0 && !showCreate ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-1">No teams yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Create a team to manage multiple candidates</p>
            <Button onClick={() => setShowCreate(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Team
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((team) => (
            <Card
              key={team.id}
              className={`cursor-pointer transition-all ${selectedTeam === team.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => selectTeam(team.id)}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{team.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">{team.role}</Badge>
                    <Badge variant="secondary">{team.member_count} members</Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">/{team.slug}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Team Details */}
      {selectedTeam && (
        <>
          {/* Invite */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Invite Member
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Email address"
                    className="pl-10"
                  />
                </div>
                <Button onClick={inviteMember}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Members & Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Team Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {members.map((member) => {
                  const memberStat = stats.find((s) => s.user_id === member.user_id);
                  return (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {roleIcon(member.role)}
                        <div>
                          <p className="font-medium text-sm">{member.profile?.name || 'User'}</p>
                          <p className="text-xs text-muted-foreground">{member.profile?.role || 'No role set'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-bold">{memberStat?.total || 0}</p>
                          <p className="text-xs text-muted-foreground">Total</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-blue-600">{memberStat?.applied || 0}</p>
                          <p className="text-xs text-muted-foreground">Applied</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-purple-600">{memberStat?.interviews || 0}</p>
                          <p className="text-xs text-muted-foreground">Interviews</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-green-600">{memberStat?.offers || 0}</p>
                          <p className="text-xs text-muted-foreground">Offers</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
