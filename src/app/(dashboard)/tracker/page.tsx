'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Building2, ExternalLink, FileText, MessageSquare, Loader2, Sparkles, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import type { Application, ApplicationStatus } from '@/types';

const COLUMNS: { id: ApplicationStatus; label: string; color: string }[] = [
  { id: 'saved', label: 'Saved', color: 'bg-slate-100' },
  { id: 'applied', label: 'Applied', color: 'bg-blue-50' },
  { id: 'interview', label: 'Interview', color: 'bg-yellow-50' },
  { id: 'offer', label: 'Offer', color: 'bg-green-50' },
  { id: 'rejected', label: 'Rejected', color: 'bg-red-50' },
];

export default function TrackerPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [generatingCL, setGeneratingCL] = useState(false);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const res = await fetch('/api/applications');
    const data = await res.json();
    if (Array.isArray(data)) setApplications(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );

    try {
      await fetch('/api/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
    } catch {
      toast.error('Failed to update status');
      fetchApplications();
    }
  };

  const saveNotes = async () => {
    if (!selectedApp) return;
    try {
      await fetch('/api/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedApp.id, notes }),
      });
      setApplications((prev) =>
        prev.map((a) => (a.id === selectedApp.id ? { ...a, notes } : a))
      );
      toast.success('Notes saved');
    } catch {
      toast.error('Failed to save notes');
    }
  };

  const generateCoverLetter = async () => {
    if (!selectedApp?.job) return;
    setGeneratingCL(true);
    try {
      const res = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: `${selectedApp.job.title}\n${selectedApp.job.description}\n${selectedApp.job.requirements}`,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCoverLetter(data.coverLetter);

      await fetch('/api/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedApp.id, cover_letter: data.coverLetter }),
      });
      toast.success('Cover letter generated!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setGeneratingCL(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const overId = over.id as string;
    const isColumn = COLUMNS.some((c) => c.id === overId);

    if (isColumn) {
      updateStatus(active.id as string, overId as ApplicationStatus);
    }
  };

  const getColumnApps = (status: ApplicationStatus) =>
    applications.filter((a) => a.status === status);

  const activeApp = applications.find((a) => a.id === activeId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Application Tracker</h1>
        <p className="text-muted-foreground">
          Drag and drop to update status. {applications.length} total applications.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {COLUMNS.map((column) => {
            const columnApps = getColumnApps(column.id);
            return (
              <div key={column.id} className="space-y-2">
                <div className={`rounded-lg p-3 ${column.color}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">{column.label}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {columnApps.length}
                    </Badge>
                  </div>
                </div>

                <SortableContext
                  items={columnApps.map((a) => a.id)}
                  strategy={verticalListSortingStrategy}
                  id={column.id}
                >
                  <div className="space-y-2 min-h-[100px]" data-column={column.id}>
                    {columnApps.map((app) => (
                      <SortableApplicationCard
                        key={app.id}
                        application={app}
                        onClick={() => {
                          setSelectedApp(app);
                          setNotes(app.notes);
                          setCoverLetter(app.cover_letter);
                        }}
                      />
                    ))}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeApp && <ApplicationCardContent application={activeApp} />}
        </DragOverlay>
      </DndContext>

      {/* Application Detail Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedApp?.job?.title || 'Application'}</DialogTitle>
          </DialogHeader>
          {selectedApp?.job && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{selectedApp.job.company}</span>
                {selectedApp.job.url && (
                  <a
                    href={selectedApp.job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" /> View
                  </a>
                )}
              </div>

              {selectedApp.job.description && (
                <div>
                  <h4 className="font-semibold text-sm mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedApp.job.description}</p>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm flex items-center gap-1">
                    <FileText className="h-4 w-4" /> Cover Letter
                  </h4>
                  <Button size="sm" variant="outline" onClick={generateCoverLetter} disabled={generatingCL}>
                    {generatingCL ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Sparkles className="h-3 w-3 mr-1" />}
                    Generate
                  </Button>
                </div>
                <Textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={6}
                  placeholder="Cover letter will appear here..."
                />
              </div>

              <div>
                <h4 className="font-semibold text-sm flex items-center gap-1 mb-2">
                  <MessageSquare className="h-4 w-4" /> Notes
                </h4>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Add notes about this application..."
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button onClick={saveNotes}>Save Notes</Button>
                <div className="flex gap-1">
                  {COLUMNS.map((col) => (
                    <Button
                      key={col.id}
                      variant={selectedApp.status === col.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        updateStatus(selectedApp.id, col.id);
                        setSelectedApp({ ...selectedApp, status: col.id });
                      }}
                    >
                      {col.label}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setDeleteConfirm(selectedApp.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        title="Delete Application"
        description="This will permanently remove this application and its data. This action cannot be undone."
        onConfirm={async () => {
          if (!deleteConfirm) return;
          const res = await fetch(`/api/applications?id=${deleteConfirm}`, { method: 'DELETE' });
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          setApplications((prev) => prev.filter((a) => a.id !== deleteConfirm));
          setSelectedApp(null);
          toast.success('Application removed');
        }}
      />
    </div>
  );
}

function SortableApplicationCard({
  application,
  onClick,
}: {
  application: Application;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: application.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div onClick={onClick} className="cursor-pointer">
        <ApplicationCardContent application={application} />
      </div>
    </div>
  );
}

function ApplicationCardContent({ application }: { application: Application }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-3">
        <h4 className="font-medium text-sm truncate">{application.job?.title || 'Job'}</h4>
        <p className="text-xs text-muted-foreground truncate">
          {application.job?.company || 'Company'}
        </p>
        {application.notes && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
            {application.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
