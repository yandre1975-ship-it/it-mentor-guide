import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { prototypes, layerConfig } from '@/data/prototypes';
import { terms } from '@/data/terms';
import { specialties } from '@/data/specialties';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Layers, ArrowRight,
  Users, GitBranch, Search,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { PrototypeZone, ZoneLayer } from '@/data/prototypes';
import { ProjectOverviewPanel } from '@/components/prototypes/ProjectOverviewPanel';
import { ZoneDetailPanel } from '@/components/prototypes/ZoneDetailPanel';
import { MobileZoneList } from '@/components/prototypes/MobileZoneList';
import { CompareProjects } from '@/components/prototypes/CompareProjects';
import { ProgressDashboard } from '@/components/prototypes/ProgressDashboard';
import { ProjectConstructor } from '@/components/prototypes/ProjectConstructor';

const complexityConfig = {
  beginner: { label: 'Junior', color: 'bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]' },
  intermediate: { label: 'Middle', color: 'bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]' },
  advanced: { label: 'Senior', color: 'bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))]' },
};

const zoneComplexity = {
  low: { label: 'Просто', icon: '🟢' },
  medium: { label: 'Средне', icon: '🟡' },
  high: { label: 'Сложно', icon: '🔴' },
};

type ViewMode = 'structure' | 'roles' | 'complexity' | 'dependencies';
type OverlayPanel = 'compare' | 'progress' | 'constructor' | null;

// ─── Enhanced Visual Schema ─────────────────────────────────────────────────
function PrototypeVisual({ zones, activeZone, onSelect, viewMode, highlightSpecialist }: {
  zones: PrototypeZone[];
  activeZone: string | null;
  onSelect: (id: string | null) => void;
  viewMode: ViewMode;
  highlightSpecialist?: string | null;
}) {
  const getDependencyHighlight = (zone: PrototypeZone) => {
    if (viewMode !== 'dependencies' || !activeZone) return false;
    const activeZ = zones.find(z => z.id === activeZone);
    return activeZ?.dependencies?.includes(zone.id) || zone.dependencies?.includes(activeZone);
  };

  const getComplexityBg = (zone: PrototypeZone) => {
    if (viewMode !== 'complexity') return '';
    switch (zone.complexity) {
      case 'low': return 'bg-[hsl(var(--success))]/10 border-[hsl(var(--success))]';
      case 'medium': return 'bg-[hsl(var(--warning))]/10 border-[hsl(var(--warning))]';
      case 'high': return 'bg-[hsl(var(--destructive))]/10 border-[hsl(var(--destructive))]';
      default: return '';
    }
  };

  const isHighlightedByRole = (zone: PrototypeZone) => {
    if (viewMode !== 'roles' || !highlightSpecialist) return true;
    return zone.specialists.includes(highlightSpecialist);
  };

  // Build dependency edges
  const dependencyEdges = useMemo(() => {
    if (viewMode !== 'dependencies') return [];
    const edges: { from: PrototypeZone; to: PrototypeZone; highlighted: boolean }[] = [];
    zones.forEach(zone => {
      zone.dependencies?.forEach(depId => {
        const dep = zones.find(z => z.id === depId);
        if (dep) {
          const highlighted = activeZone ? (zone.id === activeZone || depId === activeZone) : false;
          edges.push({ from: dep, to: zone, highlighted });
        }
      });
    });
    return edges;
  }, [zones, viewMode, activeZone]);

  // Compute layer boundaries for visual grouping
  const layerGroups = useMemo(() => {
    if (viewMode !== 'structure') return [];
    const map = new Map<ZoneLayer, { minY: number; maxY: number; maxH: number }>();
    zones.forEach(z => {
      if (!z.layer) return;
      const existing = map.get(z.layer);
      const bottom = z.y + z.height;
      if (existing) {
        existing.minY = Math.min(existing.minY, z.y);
        existing.maxY = Math.max(existing.maxY, bottom);
      } else {
        map.set(z.layer, { minY: z.y, maxY: bottom, maxH: 0 });
      }
    });
    return Array.from(map.entries())
      .map(([layer, bounds]) => ({ layer, ...bounds }))
      .sort((a, b) => a.minY - b.minY);
  }, [zones, viewMode]);

  return (
    <div className="relative w-full rounded-xl border-2 border-border bg-muted/20 overflow-hidden" style={{ paddingBottom: '55%' }}>
      {/* Layer group labels */}
      {layerGroups.map(({ layer, minY, maxY }) => {
        const cfg = layerConfig[layer];
        return (
          <div
            key={layer}
            className="absolute left-0 z-[1] flex items-center pointer-events-none"
            style={{
              top: `${minY + 0.5}%`,
              height: `${maxY - minY - 1}%`,
            }}
          >
            <div
              className="h-full w-1 rounded-r-full opacity-60"
              style={{ backgroundColor: cfg.color }}
            />
            <span
              className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider -rotate-90 origin-left whitespace-nowrap ml-2.5 opacity-50"
              style={{ color: cfg.color }}
            >
              {cfg.icon} {cfg.label}
            </span>
          </div>
        );
      })}

      {/* SVG dependency lines */}
      {dependencyEdges.length > 0 && (
        <svg className="absolute inset-0 w-full h-full z-[5] pointer-events-none" preserveAspectRatio="none">
          <defs>
            <marker id="dep-arrow" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 3.5 L 0 7 z" className="fill-primary" />
            </marker>
            <marker id="dep-arrow-dim" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 3.5 L 0 7 z" className="fill-muted-foreground/30" />
            </marker>
          </defs>
          {dependencyEdges.map(({ from, to, highlighted }) => {
            const x1 = from.x + from.width / 2;
            const y1 = from.y + from.height / 2;
            const x2 = to.x + to.width / 2;
            const y2 = to.y + to.height / 2;
            const isHighlighted = !activeZone || highlighted;
            return (
              <line
                key={`${from.id}-${to.id}`}
                x1={`${x1}%`} y1={`${y1}%`}
                x2={`${x2}%`} y2={`${y2}%`}
                className={`transition-all duration-300 ${
                  isHighlighted
                    ? 'stroke-primary stroke-[2px]'
                    : 'stroke-muted-foreground/20 stroke-[1px]'
                }`}
                markerEnd={isHighlighted ? 'url(#dep-arrow)' : 'url(#dep-arrow-dim)'}
                strokeDasharray={isHighlighted ? 'none' : '4 3'}
              />
            );
          })}
        </svg>
      )}

      {zones.map((zone) => {
        const isActive = activeZone === zone.id;
        const isDep = getDependencyHighlight(zone);
        const roleMatch = isHighlightedByRole(zone);
        const complexityBg = getComplexityBg(zone);

        return (
          <button
            key={zone.id}
            onClick={() => onSelect(isActive ? null : zone.id)}
            aria-pressed={isActive}
            className={`absolute rounded-lg transition-all duration-300 flex flex-col items-start justify-center text-left px-2 sm:px-3 py-1 sm:py-2 group
              ${isActive
                ? 'bg-primary/15 shadow-lg shadow-primary/20 ring-2 ring-primary z-20 scale-[1.02]'
                : isDep
                  ? 'bg-accent/10 ring-1 ring-accent/50 z-10'
                  : complexityBg
                    ? complexityBg
                    : 'bg-card/90 hover:bg-card border border-border hover:border-primary/40'
              }
              ${!roleMatch ? 'opacity-25' : ''}
            `}
            style={{
              left: `${zone.x + 0.5}%`,
              top: `${zone.y + 0.5}%`,
              width: `${zone.width - 1}%`,
              height: `${zone.height - 1}%`,
            }}
          >
            <span className={`font-semibold text-[10px] sm:text-xs md:text-sm truncate w-full ${isActive ? 'text-primary' : 'text-foreground'}`}>
              {zone.complexity && viewMode === 'complexity' && <span className="mr-1">{zoneComplexity[zone.complexity]?.icon}</span>}
              {zone.label}
            </span>
            {zone.elements && zone.height > 15 && (
              <span className="text-[9px] sm:text-[10px] text-muted-foreground truncate w-full mt-0.5 hidden sm:block">
                {zone.elements.slice(0, 3).join(' · ')}
              </span>
            )}
            {isActive && (
              <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-6 bg-primary rounded-full hidden lg:block" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Team Block ─────────────────────────────────────────────────────────────
function TeamBlock({ zones, activeZone }: { zones: PrototypeZone[]; activeZone: string | null }) {
  const allSpecIds = [...new Set(zones.flatMap((z) => z.specialists))];
  const specs = specialties.filter((s) => allSpecIds.includes(s.id));
  const activeZoneData = zones.find(z => z.id === activeZone);

  return (
    <Card className="border-2">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm">
            {activeZoneData ? `Команда: ${activeZoneData.label}` : 'Вся команда проекта'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {specs.map((s) => {
            const zonesCount = zones.filter((z) => z.specialists.includes(s.id)).length;
            const isInActive = activeZoneData?.specialists.includes(s.id);
            return (
              <Link key={s.id} to="/specialties">
                <Badge
                  variant={isInActive || !activeZoneData ? 'secondary' : 'outline'}
                  className={`cursor-pointer transition-all py-1.5 px-3 text-xs ${
                    isInActive
                      ? 'bg-primary text-primary-foreground ring-2 ring-primary/30'
                      : activeZoneData
                        ? 'opacity-40'
                        : 'hover:bg-primary hover:text-primary-foreground'
                  }`}
                >
                  {s.title}
                  <span className="ml-1.5 text-[10px] opacity-70">({zonesCount})</span>
                </Badge>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function Prototypes() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Deep link: read initial state from URL
  const initialProject = searchParams.get('project') || prototypes[0].id;
  const initialZone = searchParams.get('zone') || null;

  const [selectedPrototype, setSelectedPrototype] = useState(initialProject);
  const [activeZone, setActiveZone] = useState<string | null>(initialZone);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('structure');
  const [highlightSpecialist, setHighlightSpecialist] = useState<string | null>(null);
  const [overlayPanel, setOverlayPanel] = useState<OverlayPanel>(null);

  // Deep link: sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedPrototype !== prototypes[0].id) params.set('project', selectedPrototype);
    if (activeZone) params.set('zone', activeZone);
    setSearchParams(params, { replace: true });
  }, [selectedPrototype, activeZone, setSearchParams]);

  const filtered = prototypes.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.zones.some(z => z.label.toLowerCase().includes(q));
  });

  const current = filtered.find((p) => p.id === selectedPrototype) || filtered[0] || prototypes[0];
  const currentZone = current.zones.find((z) => z.id === activeZone);

  // Stats
  const totalTerms = [...new Set(current.zones.flatMap(z => z.terms))].length;
  const totalTools = [...new Set(current.zones.flatMap(z => z.tools))].length;
  const totalSpecs = [...new Set(current.zones.flatMap(z => z.specialists))].length;

  // Unique specialists for role filter
  const uniqueSpecs = useMemo(() => {
    const ids = [...new Set(current.zones.flatMap(z => z.specialists))];
    return specialties.filter(s => ids.includes(s.id));
  }, [current]);

  const selectProject = (id: string) => {
    setSelectedPrototype(id);
    setActiveZone(null);
    setHighlightSpecialist(null);
  };

  return (
    <Layout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Схемы проектов</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Изучайте архитектуру реальных IT-проектов: блоки, роли, инструменты и зависимости
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Sprint 4 tools */}
            <div className="flex gap-1">
              {[
                { key: 'compare' as const, icon: GitCompare, label: 'Сравнить' },
                { key: 'progress' as const, icon: Trophy, label: 'Прогресс' },
                { key: 'constructor' as const, icon: Hammer, label: 'Конструктор' },
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setOverlayPanel(overlayPanel === key ? null : key)}
                  className={`p-2 rounded-lg border text-xs transition-colors ${
                    overlayPanel === key
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'hover:bg-muted border-border'
                  }`}
                  title={label}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-52">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Найти проект..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
        </div>

        {/* Overlay panels (Sprint 4) */}
        {overlayPanel && (
          <div className="rounded-xl border-2 bg-card p-4 animate-in fade-in slide-in-from-top-2 duration-200">
            {overlayPanel === 'compare' && <CompareProjects onClose={() => setOverlayPanel(null)} />}
            {overlayPanel === 'progress' && <ProgressDashboard />}
            {overlayPanel === 'constructor' && <ProjectConstructor onClose={() => setOverlayPanel(null)} />}
          </div>
        )}

        {/* Project selector */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {filtered.map((p) => {
            const isSelected = current.id === p.id;
            const cx = p.complexity ? complexityConfig[p.complexity] : null;
            return (
              <button
                key={p.id}
                onClick={() => selectProject(p.id)}
                aria-pressed={isSelected}
                className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border-2 ${
                  isSelected
                    ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20'
                    : 'bg-card text-foreground border-border hover:border-primary/40'
                }`}
              >
                <span>{p.icon}</span>
                <span>{p.title}</span>
                {cx && !isSelected && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${cx.color}`}>{cx.label}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Project info bar */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 rounded-xl bg-muted/40 border text-xs text-muted-foreground">
          <span className="font-medium text-foreground text-sm">{current.icon} {current.title}</span>
          <span className="hidden sm:inline">—</span>
          <span className="hidden sm:inline flex-1 truncate">{current.description}</span>
          <div className="flex gap-4 ml-auto">
            <span><strong className="text-foreground">{current.zones.length}</strong> блоков</span>
            <span><strong className="text-foreground">{totalSpecs}</strong> ролей</span>
            <span><strong className="text-foreground">{totalTerms}</strong> терминов</span>
            <span><strong className="text-foreground">{totalTools}</strong> инструментов</span>
          </div>
        </div>

        {/* Stages */}
        {current.stages && (
          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            <span className="text-muted-foreground shrink-0 mr-1">Этапы:</span>
            {current.stages.map((stage, i) => (
              <span key={stage} className="flex items-center gap-1 shrink-0">
                <span className="px-2.5 py-1 rounded-md bg-card border font-medium">{stage}</span>
                {i < current.stages!.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
              </span>
            ))}
          </div>
        )}

        {/* View modes */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <Tabs value={viewMode} onValueChange={(v) => { setViewMode(v as ViewMode); setHighlightSpecialist(null); }}>
            <TabsList className="h-8">
              <TabsTrigger value="structure" className="text-xs gap-1 px-3"><Layers className="h-3 w-3" /> Структура</TabsTrigger>
              <TabsTrigger value="roles" className="text-xs gap-1 px-3"><Users className="h-3 w-3" /> По ролям</TabsTrigger>
              <TabsTrigger value="complexity" className="text-xs gap-1 px-3"><BarChart3 className="h-3 w-3" /> Сложность</TabsTrigger>
              <TabsTrigger value="dependencies" className="text-xs gap-1 px-3"><GitBranch className="h-3 w-3" /> Зависимости</TabsTrigger>
            </TabsList>
          </Tabs>

          {viewMode === 'roles' && (
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setHighlightSpecialist(null)}
                className={`text-[10px] px-2 py-1 rounded-md border transition-colors ${
                  !highlightSpecialist ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
              >
                Все
              </button>
              {uniqueSpecs.map(s => (
                <button
                  key={s.id}
                  onClick={() => setHighlightSpecialist(s.id === highlightSpecialist ? null : s.id)}
                  className={`text-[10px] px-2 py-1 rounded-md border transition-colors ${
                    highlightSpecialist === s.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>
          )}

          {viewMode === 'dependencies' && !activeZone && (
            <p className="text-xs text-muted-foreground">← Выберите блок, чтобы увидеть зависимости</p>
          )}
        </div>

        {/* Main grid: Schema + Detail */}
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-3">
            {/* Desktop schema */}
            <div className="hidden md:block">
              <PrototypeVisual
                zones={current.zones}
                activeZone={activeZone}
                onSelect={setActiveZone}
                viewMode={viewMode}
                highlightSpecialist={highlightSpecialist}
              />
            </div>

            {/* Mobile accordion list */}
            <MobileZoneList
              zones={current.zones}
              activeZone={activeZone}
              onSelect={setActiveZone}
            />

            {/* Complexity legend */}
            {viewMode === 'complexity' && (
              <div className="flex items-center gap-4 text-xs text-muted-foreground px-1">
                {Object.entries(zoneComplexity).map(([, v]) => (
                  <span key={v.label} className="flex items-center gap-1">{v.icon} {v.label}</span>
                ))}
              </div>
            )}

            {/* Layer legend (structure mode) */}
            {viewMode === 'structure' && (
              <div className="hidden md:flex items-center gap-3 text-[10px] text-muted-foreground px-1">
                {Object.entries(layerConfig).map(([, cfg]) => (
                  <span key={cfg.label} className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                    {cfg.icon} {cfg.label}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            {currentZone ? (
              <ZoneDetailPanel zone={currentZone} allZones={current.zones} onClose={() => setActiveZone(null)} />
            ) : (
              <ProjectOverviewPanel project={current} />
            )}
          </div>
        </div>

        {/* Team block */}
        <TeamBlock zones={current.zones} activeZone={activeZone} />
      </div>
    </Layout>
  );
}
