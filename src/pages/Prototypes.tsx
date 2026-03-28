import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { prototypes } from '@/data/prototypes';
import { terms } from '@/data/terms';
import { specialties } from '@/data/specialties';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Layers, User, Wrench, BookOpen, X, AlertTriangle, CheckCircle2,
  Lightbulb, ArrowRight, Target, Package, Link2, BarChart3,
  Users, GitBranch, Eye, ChevronDown, ChevronUp, Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { PrototypeZone } from '@/data/prototypes';
import { difficultyLabels } from '@/data/types';
import { ProjectOverviewPanel } from '@/components/prototypes/ProjectOverviewPanel';
import { ZoneDetailPanel } from '@/components/prototypes/ZoneDetailPanel';

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

  return (
    <div className="relative w-full rounded-xl border-2 border-border bg-muted/20 overflow-hidden" style={{ paddingBottom: '55%' }}>
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

// ─── Rich Detail Panel ──────────────────────────────────────────────────────
function ZoneDetailPanel({ zone, allZones, onClose }: { zone: PrototypeZone; allZones: PrototypeZone[]; onClose: () => void }) {
  const relatedTerms = terms.filter((t) => zone.terms.includes(t.id));
  const relatedSpecs = specialties.filter((s) => zone.specialists.includes(s.id));
  const dependsOn = allZones.filter(z => zone.dependencies?.includes(z.id));
  const dependedBy = allZones.filter(z => z.dependencies?.includes(zone.id));
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    elements: true, mistakes: false, best: false, checklist: false
  });

  const toggleSection = (key: string) => setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));

  const sections = [
    { key: 'elements', icon: Package, label: 'Ключевые элементы', items: zone.elements, color: 'text-primary' },
    { key: 'mistakes', icon: AlertTriangle, label: 'Частые ошибки', items: zone.mistakes, color: 'text-destructive' },
    { key: 'best', icon: Lightbulb, label: 'Лучшие практики', items: zone.bestPractices, color: 'text-[hsl(var(--success))]' },
    { key: 'checklist', icon: CheckCircle2, label: 'Чеклист', items: zone.checklist, color: 'text-[hsl(var(--info))]' },
  ];

  return (
    <div className="rounded-xl border-2 border-primary/30 bg-card shadow-lg overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="bg-primary/5 border-b px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-base">{zone.label}</h3>
              {zone.complexity && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted font-medium">
                  {zoneComplexity[zone.complexity]?.icon} {zoneComplexity[zone.complexity]?.label}
                </span>
              )}
            </div>
            {zone.purpose && (
              <p className="text-xs text-muted-foreground mt-1 flex items-start gap-1.5">
                <Target className="h-3 w-3 mt-0.5 shrink-0 text-primary" />
                {zone.purpose}
              </p>
            )}
          </div>
          <button onClick={onClose} className="shrink-0 p-1 rounded-md hover:bg-secondary" aria-label="Закрыть">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
        {/* Description */}
        <p className="text-sm text-muted-foreground">{zone.description}</p>

        {/* Collapsible sections */}
        {sections.map(({ key, icon: Icon, label, items, color }) => items && items.length > 0 && (
          <div key={key} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection(key)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-muted/50 transition-colors"
            >
              <Icon className={`h-4 w-4 shrink-0 ${color}`} />
              <span className="flex-1 text-left">{label}</span>
              <Badge variant="secondary" className="text-[10px] h-5">{items.length}</Badge>
              {expandedSections[key] ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            {expandedSections[key] && (
              <ul className="px-3 pb-2 space-y-1">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className={`mt-1.5 h-1 w-1 rounded-full shrink-0 ${
                      key === 'mistakes' ? 'bg-destructive' :
                      key === 'checklist' ? 'bg-[hsl(var(--info))]' :
                      key === 'best' ? 'bg-[hsl(var(--success))]' : 'bg-primary'
                    }`} />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {/* Specialists */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <User className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold">Кто делает</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {relatedSpecs.map((s) => (
              <Link key={s.id} to="/specialties">
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                  {s.title}
                </Badge>
              </Link>
            ))}
          </div>
        </div>

        {/* Terms */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold">Термины</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {relatedTerms.map((t) => (
              <Link key={t.id} to={`/term/${t.id}`}>
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-[10px]">
                  {t.title}
                </Badge>
              </Link>
            ))}
          </div>
        </div>

        {/* Tools */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Wrench className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold">Инструменты</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {zone.tools.map((tool) => (
              <Badge key={tool} variant="outline" className="text-[10px]">{tool}</Badge>
            ))}
          </div>
        </div>

        {/* Artifacts */}
        {zone.artifacts && zone.artifacts.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Package className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold">Артефакты</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {zone.artifacts.map((a) => (
                <Badge key={a} variant="outline" className="text-[10px] bg-muted/50">{a}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Dependencies */}
        {(dependsOn.length > 0 || dependedBy.length > 0) && (
          <div className="border rounded-lg p-3 bg-muted/30">
            <div className="flex items-center gap-1.5 mb-2">
              <GitBranch className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold">Зависимости</span>
            </div>
            {dependsOn.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap text-[10px] text-muted-foreground mb-1">
                <span>Зависит от:</span>
                {dependsOn.map(d => (
                  <Badge key={d.id} variant="outline" className="text-[10px] cursor-pointer" onClick={() => {}}>{d.label}</Badge>
                ))}
              </div>
            )}
            {dependedBy.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap text-[10px] text-muted-foreground">
                <span>Блокирует:</span>
                {dependedBy.map(d => (
                  <Badge key={d.id} variant="outline" className="text-[10px]">{d.label}</Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
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
  const [selectedPrototype, setSelectedPrototype] = useState(prototypes[0].id);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('structure');
  const [highlightSpecialist, setHighlightSpecialist] = useState<string | null>(null);

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
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Найти проект..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>

        {/* Project selector */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {filtered.map((p) => {
            const isSelected = current.id === p.id;
            const cx = p.complexity ? complexityConfig[p.complexity] : null;
            return (
              <button
                key={p.id}
                onClick={() => { setSelectedPrototype(p.id); setActiveZone(null); setHighlightSpecialist(null); }}
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
            <PrototypeVisual
              zones={current.zones}
              activeZone={activeZone}
              onSelect={setActiveZone}
              viewMode={viewMode}
              highlightSpecialist={highlightSpecialist}
            />

            {/* Complexity legend */}
            {viewMode === 'complexity' && (
              <div className="flex items-center gap-4 text-xs text-muted-foreground px-1">
                {Object.entries(zoneComplexity).map(([, v]) => (
                  <span key={v.label} className="flex items-center gap-1">{v.icon} {v.label}</span>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            {currentZone ? (
              <ZoneDetailPanel zone={currentZone} allZones={current.zones} onClose={() => setActiveZone(null)} />
            ) : (
              <div className="rounded-xl border-2 border-dashed bg-card p-6 text-center text-muted-foreground h-full flex flex-col items-center justify-center gap-3 min-h-[200px]">
                <Eye className="h-8 w-8 opacity-30" />
                <div>
                  <p className="text-sm font-medium">Выберите блок на схеме</p>
                  <p className="text-xs mt-1">Увидите: назначение, элементы, ошибки, чеклист, инструменты и зависимости</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Team block */}
        <TeamBlock zones={current.zones} activeZone={activeZone} />
      </div>
    </Layout>
  );
}
