import { useMemo } from 'react';
import { prototypes } from '@/data/prototypes';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Trophy } from 'lucide-react';

const CHECKLIST_KEY = 'prototype-checklist-progress';

function getChecklistState(): Record<string, Record<string, boolean>> {
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function ProgressDashboard() {
  const state = getChecklistState();

  const stats = useMemo(() => {
    return prototypes.map(project => {
      let totalItems = 0;
      let checkedItems = 0;

      project.zones.forEach(zone => {
        if (zone.checklist) {
          totalItems += zone.checklist.length;
          const zoneState = state[zone.id];
          if (zoneState) {
            zone.checklist.forEach((_, i) => {
              if (zoneState[String(i)]) checkedItems++;
            });
          }
        }
      });

      return {
        id: project.id,
        title: project.title,
        icon: project.icon,
        totalItems,
        checkedItems,
        progress: totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0,
      };
    });
  }, [state]);

  const totalChecked = stats.reduce((a, s) => a + s.checkedItems, 0);
  const totalItems = stats.reduce((a, s) => a + s.totalItems, 0);
  const overallProgress = totalItems > 0 ? Math.round((totalChecked / totalItems) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Overall */}
      <div className="rounded-xl border-2 bg-card p-4">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold">Общий прогресс</span>
          <span className="ml-auto text-xs text-muted-foreground">{totalChecked}/{totalItems}</span>
        </div>
        <Progress value={overallProgress} className="h-2" />
        <p className="text-[10px] text-muted-foreground mt-1">{overallProgress}% чеклистов пройдено</p>
      </div>

      {/* Per project */}
      <div className="space-y-2">
        {stats.map(s => (
          <div key={s.id} className="flex items-center gap-3 rounded-lg border px-3 py-2">
            <span className="text-sm">{s.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium truncate">{s.title}</span>
                <span className="text-muted-foreground shrink-0 ml-2">{s.checkedItems}/{s.totalItems}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${s.progress === 100 ? 'bg-[hsl(var(--success))]' : 'bg-primary'}`}
                  style={{ width: `${s.progress}%` }}
                />
              </div>
            </div>
            {s.progress === 100 && <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))] shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  );
}
