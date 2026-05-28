import { useState, useMemo, useEffect, useCallback } from 'react';
import { Layout } from '@/components/Layout';
import { MermaidDiagram } from '@/components/MermaidDiagram';
import { processes } from '@/data/processes';
import {
  features,
  featureCategoryLabels,
  featureComplexityLabels,
  featureComplexityColors,
  type FeatureCategory,
} from '@/data/features';
import { terms } from '@/data/terms';
import { specialties } from '@/data/specialties';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import {
  Zap, ChevronDown, ChevronUp, Workflow, Play, Pause,
  RotateCcw, SkipForward, SkipBack,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// ─── Step Player (from Processes) ───────────────────────────────────────────
function StepPlayer({ steps }: { steps: { title: string; description: string }[] }) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying || activeStep === null) return;
    if (activeStep >= steps.length - 1) { setIsPlaying(false); return; }
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const delay = prefersReduced ? 15000 : 2500;
    const timer = setTimeout(() => setActiveStep(s => (s ?? 0) + 1), delay);
    return () => clearTimeout(timer);
  }, [isPlaying, activeStep, steps.length]);

  const handlePlay = useCallback(() => {
    if (activeStep === null || activeStep >= steps.length - 1) setActiveStep(0);
    setIsPlaying(true);
  }, [activeStep, steps.length]);

  const progress = activeStep !== null ? ((activeStep + 1) / steps.length) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={() => { setIsPlaying(false); setActiveStep(s => Math.max(0, (s ?? 1) - 1)); }} disabled={activeStep === null || activeStep === 0}>
          <SkipBack className="h-4 w-4" />
        </Button>
        {isPlaying ? (
          <Button variant="outline" size="sm" onClick={() => setIsPlaying(false)}>
            <Pause className="h-4 w-4 mr-1" /> Пауза
          </Button>
        ) : (
          <Button variant="default" size="sm" onClick={handlePlay}>
            <Play className="h-4 w-4 mr-1" /> {activeStep !== null && activeStep < steps.length - 1 ? 'Продолжить' : 'Запустить'}
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={() => { setIsPlaying(false); setActiveStep(s => Math.min(steps.length - 1, (s ?? -1) + 1)); }} disabled={activeStep !== null && activeStep >= steps.length - 1}>
          <SkipForward className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => { setIsPlaying(false); setActiveStep(null); }} disabled={activeStep === null}>
          <RotateCcw className="h-4 w-4 mr-1" /> Сброс
        </Button>
        {activeStep !== null && (
          <span className="text-xs text-muted-foreground ml-auto">Шаг {activeStep + 1} из {steps.length}</span>
        )}
      </div>
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>
      <div className="space-y-2">
        {steps.map((step, i) => {
          const isActive = activeStep === i;
          const isPast = activeStep !== null && i < activeStep;
          const isFuture = activeStep !== null && i > activeStep;
          return (
            <div
              key={i}
              onClick={() => { setIsPlaying(false); setActiveStep(i); }}
              className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 border ${
                isActive ? 'bg-primary/10 border-primary shadow-sm scale-[1.01]'
                : isPast ? 'bg-secondary/30 border-transparent opacity-70'
                : isFuture ? 'border-transparent opacity-40'
                : 'border-transparent hover:bg-secondary/50'
              }`}
            >
              <Badge className={`shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-xs transition-colors duration-300 ${
                isActive ? 'bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-background'
                : isPast ? 'bg-primary/60 text-primary-foreground'
                : 'bg-muted text-muted-foreground'
              }`}>
                {isPast ? '✓' : i + 1}
              </Badge>
              <div>
                <p className={`font-medium text-sm ${isActive ? 'text-primary' : ''}`}>{step.title}</p>
                <div className={`overflow-hidden transition-all duration-300 ${isActive ? 'max-h-40 opacity-100 mt-1' : isPast || activeStep === null ? 'max-h-40 opacity-100 mt-0.5' : 'max-h-0 opacity-0'}`}>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
type SectionTab = 'features' | 'processes';

export default function HowItWorks() {
  const [tab, setTab] = useState<SectionTab>('features');
  const [selectedCategory, setSelectedCategory] = useState<FeatureCategory | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFeatures = useMemo(() => {
    return features.filter(f => !selectedCategory || f.category === selectedCategory);
  }, [selectedCategory]);

  const categories = Object.entries(featureCategoryLabels) as [FeatureCategory, string][];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Как это работает</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Популярные фичи IT-продуктов и ключевые процессы разработки — с диаграммами и пошаговым описанием
          </p>
        </div>

        <Tabs value={tab} onValueChange={v => { setTab(v as SectionTab); setExpandedId(null); }}>
          <TabsList>
            <TabsTrigger value="features" className="gap-1.5">
              <Zap className="h-4 w-4" /> Фичи
            </TabsTrigger>
            <TabsTrigger value="processes" className="gap-1.5">
              <Workflow className="h-4 w-4" /> Процессы
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* ── Features tab ── */}
        {tab === 'features' && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border
                  ${!selectedCategory ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border hover:bg-secondary/80'}`}
              >
                Все
              </button>
              {categories.map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border
                    ${selectedCategory === key ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border hover:bg-secondary/80'}`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFeatures.map(feature => {
                const isExpanded = expandedId === feature.id;
                const relatedTerms = terms.filter(t => feature.relatedTermIds.includes(t.id));
                const relatedSpecs = specialties.filter(s => feature.specialistIds.includes(s.id));

                return (
                  <Card
                    key={feature.id}
                    className={`transition-all cursor-pointer ${isExpanded ? 'border-primary/40 shadow-md' : 'hover:shadow-md hover:border-primary/30'}`}
                    onClick={() => setExpandedId(isExpanded ? null : feature.id)}
                    role="button"
                    aria-expanded={isExpanded}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-primary shrink-0" />
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge className={`text-xs ${featureComplexityColors[feature.complexity]}`}>
                            {featureComplexityLabels[feature.complexity]}
                          </Badge>
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                        </div>
                      </div>
                      <CardDescription className={isExpanded ? '' : 'line-clamp-2'}>{feature.description}</CardDescription>
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">{featureCategoryLabels[feature.category]}</Badge>
                      </div>
                    </CardHeader>

                    <div className={`animate-collapse ${isExpanded ? 'animate-collapse-open' : ''}`}>
                      <div className="animate-collapse-inner">
                        <CardContent className="space-y-4 pt-0" onClick={e => e.stopPropagation()}>
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Поток данных</h4>
                            <div className="rounded-lg border bg-card p-4">
                              <MermaidDiagram chart={feature.diagramCode} />
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold mb-1">Как это работает</h4>
                            <p className="text-sm text-muted-foreground">{feature.howItWorks}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold mb-1">Инструменты</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {feature.tools.map(tool => <Badge key={tool} variant="secondary" className="text-xs">{tool}</Badge>)}
                            </div>
                          </div>
                          {relatedTerms.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold mb-1">Связанные термины</h4>
                              <div className="flex flex-wrap gap-1.5">
                                {relatedTerms.map(t => (
                                  <Link key={t.id} to={`/term/${t.id}`}>
                                    <Badge variant="outline" className="text-xs hover:bg-primary/10 cursor-pointer">{t.title}</Badge>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                          {relatedSpecs.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold mb-1">Кто реализует</h4>
                              <div className="flex flex-wrap gap-1.5">
                                {relatedSpecs.map(s => <Badge key={s.id} variant="outline" className="text-xs">{s.title}</Badge>)}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Processes tab ── */}
        {tab === 'processes' && (
          <div className="space-y-4">
            {processes.map(process => {
              const isExpanded = expandedId === process.id;
              return (
                <Card key={process.id} className="overflow-hidden">
                  <CardHeader
                    className="cursor-pointer hover:bg-secondary/50 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : process.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Workflow className="h-5 w-5 text-primary shrink-0" />
                        <div>
                          <CardTitle className="text-lg">{process.title}</CardTitle>
                          <CardDescription className="mt-1">{process.description}</CardDescription>
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" /> : <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />}
                    </div>
                  </CardHeader>
                  <div className={`animate-collapse ${isExpanded ? 'animate-collapse-open' : ''}`}>
                    <div className="animate-collapse-inner">
                      <CardContent className="pt-0 space-y-6">
                        <div className="rounded-lg border bg-card p-4">
                          <MermaidDiagram chart={process.diagramCode} />
                        </div>
                        <div className="space-y-3">
                          <h3 className="font-semibold">Пошаговое описание</h3>
                          <StepPlayer steps={process.steps} />
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
