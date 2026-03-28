import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { terms } from '@/data/terms';
import { specialties } from '@/data/specialties';
import type { PrototypeZone } from '@/data/prototypes';
import {
  User, Wrench, BookOpen, X, AlertTriangle, CheckCircle2,
  Lightbulb, Target, Package, GitBranch, ChevronDown, ChevronUp,
  Layers, ArrowRight
} from 'lucide-react';

const zoneComplexity = {
  low: { label: 'Просто', icon: '🟢' },
  medium: { label: 'Средне', icon: '🟡' },
  high: { label: 'Сложно', icon: '🔴' },
};

type DetailLevel = 'summary' | 'details' | 'deep';

const levelConfig = {
  summary: { label: 'Обзор', icon: Layers },
  details: { label: 'Детали', icon: BookOpen },
  deep: { label: 'Deep dive', icon: Target },
};

export function ZoneDetailPanel({ zone, allZones, onClose }: {
  zone: PrototypeZone;
  allZones: PrototypeZone[];
  onClose: () => void;
}) {
  const [level, setLevel] = useState<DetailLevel>('summary');

  const relatedTerms = terms.filter(t => zone.terms.includes(t.id));
  const relatedSpecs = specialties.filter(s => zone.specialists.includes(s.id));
  const dependsOn = allZones.filter(z => zone.dependencies?.includes(z.id));
  const dependedBy = allZones.filter(z => z.dependencies?.includes(zone.id));

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

      {/* Level tabs */}
      <div className="flex border-b bg-muted/20">
        {(Object.entries(levelConfig) as [DetailLevel, typeof levelConfig.summary][]).map(([key, cfg]) => {
          const Icon = cfg.icon;
          const isActive = level === key;
          return (
            <button
              key={key}
              onClick={() => setLevel(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors border-b-2 ${
                isActive
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
              }`}
            >
              <Icon className="h-3 w-3" />
              {cfg.label}
            </button>
          );
        })}
      </div>

      <div className="p-4 space-y-3 max-h-[55vh] overflow-y-auto">
        {/* === SUMMARY level === */}
        {level === 'summary' && (
          <SummaryLevel
            zone={zone}
            relatedSpecs={relatedSpecs}
            dependsOn={dependsOn}
            dependedBy={dependedBy}
          />
        )}

        {/* === DETAILS level === */}
        {level === 'details' && (
          <DetailsLevel
            zone={zone}
            relatedTerms={relatedTerms}
            relatedSpecs={relatedSpecs}
          />
        )}

        {/* === DEEP DIVE level === */}
        {level === 'deep' && (
          <DeepDiveLevel
            zone={zone}
            allZones={allZones}
            relatedTerms={relatedTerms}
            dependsOn={dependsOn}
            dependedBy={dependedBy}
          />
        )}

        {/* Navigation hint */}
        <div className="pt-2 border-t flex items-center justify-between text-[10px] text-muted-foreground">
          <span>
            {level === 'summary' && 'Перейдите в «Детали» для элементов и практик'}
            {level === 'details' && 'Перейдите в «Deep dive» для зависимостей и терминов'}
            {level === 'deep' && 'Полная информация о блоке'}
          </span>
          {level !== 'deep' && (
            <button
              onClick={() => setLevel(level === 'summary' ? 'details' : 'deep')}
              className="flex items-center gap-1 text-primary hover:underline font-medium"
            >
              Далее <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Summary Level ──────────────────────────────────────────────────────────
function SummaryLevel({ zone, relatedSpecs, dependsOn, dependedBy }: {
  zone: PrototypeZone;
  relatedSpecs: { id: string; title: string }[];
  dependsOn: PrototypeZone[];
  dependedBy: PrototypeZone[];
}) {
  return (
    <>
      <p className="text-sm text-muted-foreground leading-relaxed">{zone.description}</p>

      {/* Key elements preview */}
      {zone.elements && zone.elements.length > 0 && (
        <div className="rounded-lg border bg-muted/20 p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Package className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold">Ключевые элементы</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {zone.elements.slice(0, 5).map(el => (
              <Badge key={el} variant="secondary" className="text-[10px]">{el}</Badge>
            ))}
            {zone.elements.length > 5 && (
              <Badge variant="outline" className="text-[10px] text-muted-foreground">+{zone.elements.length - 5}</Badge>
            )}
          </div>
        </div>
      )}

      {/* Team */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <User className="h-3.5 w-3.5 text-primary shrink-0" />
        <span className="text-xs font-semibold mr-1">Команда:</span>
        {relatedSpecs.map(s => (
          <Link key={s.id} to="/specialties">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
              {s.title}
            </Badge>
          </Link>
        ))}
      </div>

      {/* Dependencies summary */}
      {(dependsOn.length > 0 || dependedBy.length > 0) && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <GitBranch className="h-3.5 w-3.5 shrink-0" />
          {dependsOn.length > 0 && <span>Зависит от <strong className="text-foreground">{dependsOn.length}</strong> блоков</span>}
          {dependsOn.length > 0 && dependedBy.length > 0 && <span>·</span>}
          {dependedBy.length > 0 && <span>Блокирует <strong className="text-foreground">{dependedBy.length}</strong> блоков</span>}
        </div>
      )}
    </>
  );
}

// ─── Details Level ──────────────────────────────────────────────────────────
function DetailsLevel({ zone, relatedTerms, relatedSpecs }: {
  zone: PrototypeZone;
  relatedTerms: { id: string; title: string }[];
  relatedSpecs: { id: string; title: string }[];
}) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    elements: true, mistakes: true, best: false,
  });
  const toggle = (key: string) => setExpandedSections(p => ({ ...p, [key]: !p[key] }));

  const sections = [
    { key: 'elements', icon: Package, label: 'Ключевые элементы', items: zone.elements, color: 'text-primary', dotColor: 'bg-primary' },
    { key: 'mistakes', icon: AlertTriangle, label: 'Частые ошибки', items: zone.mistakes, color: 'text-destructive', dotColor: 'bg-destructive' },
    { key: 'best', icon: Lightbulb, label: 'Лучшие практики', items: zone.bestPractices, color: 'text-[hsl(var(--success))]', dotColor: 'bg-[hsl(var(--success))]' },
  ];

  return (
    <>
      {sections.map(({ key, icon: Icon, label, items, color, dotColor }) => items && items.length > 0 && (
        <div key={key} className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggle(key)}
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
                  <span className={`mt-1.5 h-1 w-1 rounded-full shrink-0 ${dotColor}`} />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {/* Tools */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Wrench className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold">Инструменты</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {zone.tools.map(t => (
            <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
          ))}
        </div>
      </div>

      {/* Specialists */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <User className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold">Кто делает</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {relatedSpecs.map(s => (
            <Link key={s.id} to="/specialties">
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                {s.title}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Deep Dive Level ────────────────────────────────────────────────────────
function DeepDiveLevel({ zone, allZones, relatedTerms, dependsOn, dependedBy }: {
  zone: PrototypeZone;
  allZones: PrototypeZone[];
  relatedTerms: { id: string; title: string }[];
  dependsOn: PrototypeZone[];
  dependedBy: PrototypeZone[];
}) {
  const [showChecklist, setShowChecklist] = useState(true);

  return (
    <>
      {/* Checklist */}
      {zone.checklist && zone.checklist.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => setShowChecklist(p => !p)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-muted/50 transition-colors"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[hsl(var(--info))]" />
            <span className="flex-1 text-left">Чеклист готовности</span>
            <Badge variant="secondary" className="text-[10px] h-5">{zone.checklist.length}</Badge>
            {showChecklist ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
          {showChecklist && (
            <ul className="px-3 pb-2 space-y-1">
              {zone.checklist.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="mt-1.5 h-1 w-1 rounded-full shrink-0 bg-[hsl(var(--info))]" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Terms */}
      {relatedTerms.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold">Связанные термины</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {relatedTerms.map(t => (
              <Link key={t.id} to={`/term/${t.id}`}>
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-[10px]">
                  {t.title}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Artifacts */}
      {zone.artifacts && zone.artifacts.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Package className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold">Артефакты</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {zone.artifacts.map(a => (
              <Badge key={a} variant="outline" className="text-[10px] bg-muted/50">{a}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Dependencies full */}
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
                <Badge key={d.id} variant="outline" className="text-[10px]">{d.label}</Badge>
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
    </>
  );
}
