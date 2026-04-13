'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Bot, Plus, Play, Pause, Trash2, Loader2, Zap, ExternalLink, Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import type { JobAgent, JobAgentResult } from '@/types';

export default function JobAgentPage() {
  const [agents, setAgents] = useState<JobAgent[]>([]);
  const [results, setResults] = useState<JobAgentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [locations, setLocations] = useState('');
  const [frequency, setFrequency] = useState('daily');

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/job-agent');
      const data = await res.json();
      if (Array.isArray(data)) setAgents(data);
    } catch {} finally {
      setLoading(false);
    }
  };

  const createAgent = async () => {
    try {
      const res = await fetch('/api/job-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          name: name || 'My Agent',
          keywords: keywords.split(',').map((k) => k.trim()).filter(Boolean),
          locations: locations.split(',').map((l) => l.trim()).filter(Boolean),
          frequency,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAgents((prev) => [data, ...prev]);
      setShowCreate(false);
      setName('');
      setKeywords('');
      setLocations('');
      toast.success('Agent created!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create agent');
    }
  };

  const runAgent = async (agentId: string) => {
    setRunning(agentId);
    try {
      const res = await fetch('/api/job-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'run', agent_id: agentId }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success(`Found ${data.count} new jobs!`);
      fetchAgents();
      if (selectedAgent === agentId) fetchResults(agentId);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Agent run failed');
    } finally {
      setRunning(null);
    }
  };

  const toggleAgent = async (agent: JobAgent) => {
    const res = await fetch('/api/job-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle', agent_id: agent.id, active: !agent.active }),
    });
    const data = await res.json();
    setAgents((prev) => prev.map((a) => (a.id === data.id ? data : a)));
  };

  const deleteAgent = async (agentId: string) => {
    await fetch('/api/job-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', agent_id: agentId }),
    });
    setAgents((prev) => prev.filter((a) => a.id !== agentId));
    if (selectedAgent === agentId) setSelectedAgent(null);
    toast.success('Agent deleted');
  };

  const fetchResults = async (agentId: string) => {
    setSelectedAgent(agentId);
    const res = await fetch('/api/job-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'results', agent_id: agentId }),
    });
    const data = await res.json();
    if (Array.isArray(data)) setResults(data);
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
          <h1 className="text-2xl font-bold">AI Job Search Agent</h1>
          <p className="text-muted-foreground">Autonomous agents that find jobs matching your profile 24/7</p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)}>
          <Plus className="h-4 w-4 mr-2" />
          New Agent
        </Button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Agent</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Agent Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Frontend Jobs Moscow" />
            </div>
            <div>
              <label className="text-sm font-medium">Keywords (comma-separated)</label>
              <Input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="e.g. React, TypeScript, Frontend" />
            </div>
            <div>
              <label className="text-sm font-medium">Locations (comma-separated)</label>
              <Input value={locations} onChange={(e) => setLocations(e.target.value)} placeholder="e.g. Moscow, Remote, Yerevan" />
            </div>
            <div>
              <label className="text-sm font-medium">Frequency</label>
              <div className="flex gap-2 mt-1">
                {['hourly', 'daily', 'weekly'].map((f) => (
                  <Button key={f} variant={frequency === f ? 'default' : 'outline'} size="sm" onClick={() => setFrequency(f)} className="capitalize">
                    {f}
                  </Button>
                ))}
              </div>
            </div>
            <Button onClick={createAgent}>
              <Bot className="h-4 w-4 mr-2" />
              Create Agent
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Agents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <Card key={agent.id} className={selectedAgent === agent.id ? 'ring-2 ring-blue-500' : ''}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold">{agent.name}</h3>
                  <Badge variant={agent.active ? 'default' : 'secondary'}>
                    {agent.active ? 'Active' : 'Paused'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1 mb-3 text-sm text-muted-foreground">
                <div>Keywords: {agent.keywords.join(', ') || 'None'}</div>
                <div>Locations: {agent.locations.join(', ') || 'Any'}</div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {agent.frequency} &middot; {agent.results_count} results found
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => runAgent(agent.id)}
                  disabled={running === agent.id}
                >
                  {running === agent.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  <span className="ml-1">Run Now</span>
                </Button>
                <Button size="sm" variant="outline" onClick={() => fetchResults(agent.id)}>
                  Results
                </Button>
                <Button size="sm" variant="outline" onClick={() => toggleAgent(agent)}>
                  {agent.active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button size="sm" variant="outline" onClick={() => deleteAgent(agent.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {agents.length === 0 && !showCreate && (
        <Card>
          <CardContent className="py-12 text-center">
            <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-1">No agents yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Create an AI agent to automatically find jobs for you</p>
            <Button onClick={() => setShowCreate(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Agent
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {selectedAgent && results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Agent Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result) => (
                <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{result.job_title}</p>
                    <p className="text-xs text-muted-foreground">{result.company} &middot; {result.location}</p>
                    {result.salary && <p className="text-xs text-green-600">{result.salary}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={result.match_score >= 80 ? 'default' : 'secondary'}>
                      {result.match_score}% match
                    </Badge>
                    {result.url && (
                      <a href={result.url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
