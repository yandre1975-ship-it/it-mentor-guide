import { useState, useMemo } from 'react';
import { prototypes } from '@/data/prototypes';
import { specialties } from '@/data/specialties';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { X, Layers, Users, Wrench, BarChart3 } from 'lucide-react';

export function CompareProjects({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<string[]>(
    prototypes.length >= 2 ? [prototypes[0].id, prototypes[1].id] : [prototypes[0].id]
  );

  const toggleProject = (id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(p => p !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const projects = selected.map(id => prototypes.find(p => p.id === id)!).filter(Boolean);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Сравнение проектов</h2>
        <button onClick={onClose} className="p-1 rounded-md hover:bg-secondary"><X className="h-4 w-4" /></button>
      </div>

      {/* Selector */}
      <div className="flex flex-wrap gap-1.5">
        {prototypes.map(p => (
          <button
            key={p.id}
            onClick={() => toggleProject(p.id)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              selected.includes(p.id)
                ? 'bg-primary text-primary-foreground border-primary'
                : 'hover:bg-muted border-border'
            }`}
          >
            {p.icon} {p.title}
          </button>
        ))}
      </div>

      {/* Comparison table */}
      {projects.length >= 2 && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3 text-muted-foreground font-medium w-32">Метрика</th>
                {projects.map(p => (
                  <th key={p.id} className="text-left py-2 px-3 font-bold">
                    <span className="mr-1">{p.icon}</span>{p.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  label: 'Сложность',
                  icon: <BarChart3 className="h-3 w-3" />,
                  getValue: (p: typeof projects[0]) => {
                    const map = { beginner: '🟢 Junior', intermediate: '🟡 Middle', advanced: '🔴 Senior' };
                    return p.complexity ? map[p.complexity] : '—';
                  }
                },
                {
                  label: 'Блоков',
                  icon: <Layers className="h-3 w-3" />,
                  getValue: (p: typeof projects[0]) => String(p.zones.length)
                },
                {
                  label: 'Ролей',
                  icon: <Users className="h-3 w-3" />,
                  getValue: (p: typeof projects[0]) => String([...new Set(p.zones.flatMap(z => z.specialists))].length)
                },
                {
                  label: 'Инструментов',
                  icon: <Wrench className="h-3 w-3" />,
                  getValue: (p: typeof projects[0]) => String([...new Set(p.zones.flatMap(z => z.tools))].length)
                },
                {
                  label: 'Этапов',
                  icon: null,
                  getValue: (p: typeof projects[0]) => p.stages ? String(p.stages.length) : '—'
                },
                {
                  label: 'Сложных блоков',
                  icon: null,
                  getValue: (p: typeof projects[0]) => String(p.zones.filter(z => z.complexity === 'high').length)
                },
              ].map(row => (
                <tr key={row.label} className="border-b last:border-0">
                  <td className="py-2 px-3 text-muted-foreground flex items-center gap-1.5">
                    {row.icon}{row.label}
                  </td>
                  {projects.map(p => (
                    <td key={p.id} className="py-2 px-3 font-medium">{row.getValue(p)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Shared tools */}
      {projects.length >= 2 && (
        <div>
          <span className="text-xs font-semibold text-muted-foreground">Общие инструменты:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {(() => {
              const toolSets = projects.map(p => new Set(p.zones.flatMap(z => z.tools)));
              const shared = [...toolSets[0]].filter(t => toolSets.every(s => s.has(t)));
              return shared.length > 0
                ? shared.map(t => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)
                : <span className="text-[10px] text-muted-foreground">Нет общих инструментов</span>;
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
