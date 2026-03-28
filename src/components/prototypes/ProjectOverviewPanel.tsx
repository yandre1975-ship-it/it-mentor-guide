import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { specialties } from '@/data/specialties';
import { terms } from '@/data/terms';
import type { ProjectPrototype } from '@/data/prototypes';
import {
  Layers, Users, BookOpen, Wrench, ArrowRight, BarChart3,
  Target, Package, GitBranch, Zap
} from 'lucide-react';

const complexityMeta = {
  beginner: { label: 'Junior', icon: '🟢', desc: 'Подходит для начинающих разработчиков' },
  intermediate: { label: 'Middle', icon: '🟡', desc: 'Требует уверенного владения основами' },
  advanced: { label: 'Senior', icon: '🔴', desc: 'Для опытных специалистов' },
};

export function ProjectOverviewPanel({ project }: { project: ProjectPrototype }) {
  const allTermIds = [...new Set(project.zones.flatMap(z => z.terms))];
  const allToolNames = [...new Set(project.zones.flatMap(z => z.tools))];
  const allSpecIds = [...new Set(project.zones.flatMap(z => z.specialists))];
  const allArtifacts = [...new Set(project.zones.flatMap(z => z.artifacts ?? []))];
  const specs = specialties.filter(s => allSpecIds.includes(s.id));
  const relatedTerms = terms.filter(t => allTermIds.includes(t.id));

  const complexityDistribution = {
    low: project.zones.filter(z => z.complexity === 'low').length,
    medium: project.zones.filter(z => z.complexity === 'medium').length,
    high: project.zones.filter(z => z.complexity === 'high').length,
  };

  const cx = project.complexity ? complexityMeta[project.complexity] : null;

  return (
    <div className="rounded-xl border-2 border-border bg-card shadow-sm overflow-hidden animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-primary/5 border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{project.icon}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base truncate">{project.title}</h3>
            {cx && (
              <span className="text-[10px] text-muted-foreground">
                {cx.icon} {cx.label} · {cx.desc}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>

        {/* Quick stats grid */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: Layers, label: 'Блоков', value: project.zones.length, color: 'text-primary' },
            { icon: Users, label: 'Ролей', value: specs.length, color: 'text-primary' },
            { icon: BookOpen, label: 'Терминов', value: relatedTerms.length, color: 'text-primary' },
            { icon: Wrench, label: 'Инструментов', value: allToolNames.length, color: 'text-primary' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2">
              <Icon className={`h-4 w-4 shrink-0 ${color}`} />
              <div>
                <div className="text-lg font-bold leading-none">{value}</div>
                <div className="text-[10px] text-muted-foreground">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Stages timeline */}
        {project.stages && project.stages.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold">Этапы проекта</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {project.stages.map((stage, i) => (
                <span key={stage} className="flex items-center gap-1">
                  <span className="px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
                    {i + 1}. {stage}
                  </span>
                  {i < project.stages!.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Complexity distribution */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold">Сложность блоков</span>
          </div>
          <div className="space-y-1.5">
            {([
              { key: 'low', label: '🟢 Простые', count: complexityDistribution.low, color: 'bg-[hsl(var(--success))]' },
              { key: 'medium', label: '🟡 Средние', count: complexityDistribution.medium, color: 'bg-[hsl(var(--warning))]' },
              { key: 'high', label: '🔴 Сложные', count: complexityDistribution.high, color: 'bg-[hsl(var(--destructive))]' },
            ] as const).map(({ label, count, color }) => (
              <div key={label} className="flex items-center gap-2 text-xs">
                <span className="w-24 text-muted-foreground">{label}</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${color}`}
                    style={{ width: `${project.zones.length ? (count / project.zones.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="w-6 text-right font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold">Команда проекта</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {specs.map(s => {
              const zonesCount = project.zones.filter(z => z.specialists.includes(s.id)).length;
              return (
                <Link key={s.id} to="/specialties">
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                    {s.title}
                    <span className="ml-1 opacity-60">({zonesCount})</span>
                  </Badge>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Key tools */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Wrench className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold">Технологический стек</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {allToolNames.map(t => (
              <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
            ))}
          </div>
        </div>

        {/* Artifacts */}
        {allArtifacts.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Package className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold">Артефакты проекта</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {allArtifacts.map(a => (
                <Badge key={a} variant="outline" className="text-[10px] bg-muted/50">{a}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Zones list */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold">Все блоки</span>
          </div>
          <div className="space-y-1">
            {project.zones.map(z => (
              <div key={z.id} className="flex items-center gap-2 text-xs px-2 py-1.5 rounded-md border bg-muted/20 hover:bg-muted/40 transition-colors">
                <span className="shrink-0">
                  {z.complexity === 'low' ? '🟢' : z.complexity === 'medium' ? '🟡' : z.complexity === 'high' ? '🔴' : '⚪'}
                </span>
                <span className="font-medium flex-1 truncate">{z.label}</span>
                {z.dependencies && z.dependencies.length > 0 && (
                  <GitBranch className="h-3 w-3 text-muted-foreground shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
