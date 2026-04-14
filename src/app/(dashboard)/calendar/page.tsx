'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Loader2, Plus, Download, Calendar as CalIcon, X } from 'lucide-react';
import { toast } from 'sonner';
import type { Application } from '@/types';

interface CalendarEvent {
  id: string; title: string; event_date: string; event_type: string; notes: string;
}

const STATUS_COLORS: Record<string, string> = {
  saved: 'bg-slate-200 text-slate-700',
  applied: 'bg-blue-100 text-blue-700',
  interview: 'bg-yellow-100 text-yellow-700',
  offer: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function CalendarPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', event_date: '', event_type: 'custom', notes: '' });

  useEffect(() => {
    Promise.all([
      fetch('/api/applications').then(r => r.json()),
      fetch('/api/calendar-events').then(r => r.json()),
    ]).then(([apps, evts]) => {
      if (Array.isArray(apps)) setApplications(apps);
      if (Array.isArray(evts)) setEvents(evts);
    }).finally(() => setLoading(false));
  }, []);

  const addEvent = async () => {
    if (!newEvent.title || !newEvent.event_date) { toast.error('Title and date required'); return; }
    try {
      const res = await fetch('/api/calendar-events', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setEvents(prev => [...prev, data]);
      setShowAddEvent(false);
      setNewEvent({ title: '', event_date: '', event_type: 'custom', notes: '' });
      toast.success('Event added!');
    } catch { toast.error('Failed to add event'); }
  };

  const deleteEvent = async (id: string) => {
    await fetch('/api/calendar-events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id }) });
    setEvents(prev => prev.filter(e => e.id !== id));
    toast.success('Event removed');
  };

  const exportICS = () => {
    window.open('/api/calendar-events?action=ics', '_blank');
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: { date: number; apps: Application[] }[] = [];

    // Empty slots for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      days.push({ date: 0, apps: [] });
    }

    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayApps = applications.filter((a) => a.applied_at?.startsWith(dateStr) || a.updated_at?.startsWith(dateStr));
      days.push({ date: d, apps: dayApps });
    }

    return days;
  }, [applications, year, month]);

  const monthName = new Date(year, month).toLocaleString('en', { month: 'long', year: 'numeric' });
  const today = new Date();
  const isToday = (d: number) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

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
          <h1 className="text-2xl font-bold">Application Calendar</h1>
          <p className="text-muted-foreground">Track your applications and interviews over time</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportICS}><Download className="h-4 w-4 mr-1" />Export .ics</Button>
          <Button size="sm" onClick={() => setShowAddEvent(!showAddEvent)}><Plus className="h-4 w-4 mr-1" />Add Event</Button>
        </div>
      </div>

      {showAddEvent && (
        <Card>
          <CardContent className="pt-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input placeholder="Event title *" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
              <Input type="date" value={newEvent.event_date} onChange={e => setNewEvent({...newEvent, event_date: e.target.value})} />
              <div className="flex gap-1">
                {['interview', 'deadline', 'follow_up', 'custom'].map(t => (
                  <Button key={t} size="sm" variant={newEvent.event_type === t ? 'default' : 'outline'} onClick={() => setNewEvent({...newEvent, event_type: t})} className="capitalize text-xs">{t.replace('_', ' ')}</Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={addEvent}><Plus className="h-3 w-3 mr-1" />Add</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowAddEvent(false)}><X className="h-3 w-3" /></Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Custom Events */}
      {events.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><CalIcon className="h-4 w-4" />Upcoming Events</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {events.map(evt => (
              <div key={evt.id} className="flex items-center justify-between p-2 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize text-xs">{evt.event_type.replace('_', ' ')}</Badge>
                  <span className="text-sm font-medium">{evt.title}</span>
                  <span className="text-xs text-muted-foreground">{evt.event_date}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => deleteEvent(evt.id)}><X className="h-3 w-3" /></Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <CardTitle>{monthName}</CardTitle>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => (
              <div
                key={i}
                className={`min-h-[80px] p-1.5 rounded-lg border text-sm transition-colors ${
                  day.date === 0
                    ? 'border-transparent'
                    : isToday(day.date)
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                    : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                {day.date > 0 && (
                  <>
                    <span className={`text-xs font-medium ${isToday(day.date) ? 'text-blue-600' : 'text-muted-foreground'}`}>
                      {day.date}
                    </span>
                    <div className="mt-1 space-y-0.5">
                      {day.apps.slice(0, 3).map((app, j) => (
                        <div
                          key={j}
                          className={`text-[10px] px-1 py-0.5 rounded truncate ${STATUS_COLORS[app.status] || 'bg-slate-100'}`}
                          title={`${app.job?.title} - ${app.status}`}
                        >
                          {app.job?.title || 'App'}
                        </div>
                      ))}
                      {day.apps.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">+{day.apps.length - 3} more</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <div key={status} className="flex items-center gap-1.5">
            <div className={`h-3 w-3 rounded ${color}`} />
            <span className="text-xs text-muted-foreground capitalize">{status}</span>
          </div>
        ))}
      </div>

      {/* Upcoming interviews */}
      {applications.filter((a) => a.status === 'interview').length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Interviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {applications
              .filter((a) => a.status === 'interview')
              .map((app) => (
                <div key={app.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-sm">{app.job?.title}</p>
                    <p className="text-xs text-muted-foreground">{app.job?.company}</p>
                  </div>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Interview</Badge>
                </div>
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
