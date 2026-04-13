'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface HeatmapCalendarProps {
  data: Record<string, number>; // { '2026-04-01': 3, '2026-04-02': 1, ... }
  weeks?: number;
}

const INTENSITY = [
  'bg-slate-100 dark:bg-slate-800',
  'bg-green-200 dark:bg-green-900',
  'bg-green-400 dark:bg-green-700',
  'bg-green-600 dark:bg-green-500',
  'bg-green-800 dark:bg-green-400',
];

export function HeatmapCalendar({ data, weeks = 20 }: HeatmapCalendarProps) {
  const days = useMemo(() => {
    const result: { date: string; count: number; day: number }[] = [];
    const today = new Date();
    const totalDays = weeks * 7;

    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      result.push({
        date: dateStr,
        count: data[dateStr] || 0,
        day: d.getDay(),
      });
    }
    return result;
  }, [data, weeks]);

  const maxCount = Math.max(...Object.values(data), 1);

  const getIntensity = (count: number) => {
    if (count === 0) return 0;
    if (count <= maxCount * 0.25) return 1;
    if (count <= maxCount * 0.5) return 2;
    if (count <= maxCount * 0.75) return 3;
    return 4;
  };

  // Group by week columns
  const columns: typeof days[] = [];
  let col: typeof days = [];
  days.forEach((d, i) => {
    col.push(d);
    if (d.day === 6 || i === days.length - 1) {
      columns.push(col);
      col = [];
    }
  });

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-[3px] min-w-fit">
        {columns.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day) => (
              <div
                key={day.date}
                className={cn('w-3 h-3 rounded-sm', INTENSITY[getIntensity(day.count)])}
                title={`${day.date}: ${day.count} application${day.count !== 1 ? 's' : ''}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 mt-2">
        <span className="text-[10px] text-muted-foreground mr-1">Less</span>
        {INTENSITY.map((cls, i) => (
          <div key={i} className={cn('w-3 h-3 rounded-sm', cls)} />
        ))}
        <span className="text-[10px] text-muted-foreground ml-1">More</span>
      </div>
    </div>
  );
}
