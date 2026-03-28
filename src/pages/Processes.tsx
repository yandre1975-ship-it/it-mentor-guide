import { useState, useEffect, useCallback } from 'react';
import { Layout } from '@/components/Layout';
import { MermaidDiagram } from '@/components/MermaidDiagram';
import { processes } from '@/data/processes';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Workflow, Play, Pause, RotateCcw, SkipForward, SkipBack } from 'lucide-react';
import { Button } from '@/components/ui/button';

function StepPlayer({ steps, processId }: { steps: { title: string; description: string }[]; processId: string }) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying || activeStep === null) return;
    if (activeStep >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => setActiveStep((s) => (s ?? 0) + 1), 2500);
    return () => clearTimeout(timer);
  }, [isPlaying, activeStep, steps.length]);

  const handlePlay = useCallback(() => {
    if (activeStep === null || activeStep >= steps.length - 1) {
      setActiveStep(0);
    }
    setIsPlaying(true);
  }, [activeStep, steps.length]);

  const handlePause = () => setIsPlaying(false);
  const handleReset = () => { setIsPlaying(false); setActiveStep(null); };
  const handlePrev = () => { setIsPlaying(false); setActiveStep((s) => Math.max(0, (s ?? 1) - 1)); };
  const handleNext = () => { setIsPlaying(false); setActiveStep((s) => Math.min(steps.length - 1, (s ?? -1) + 1)); };

  const progress = activeStep !== null ? ((activeStep + 1) / steps.length) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={handlePrev} disabled={activeStep === null || activeStep === 0}>
          <SkipBack className="h-4 w-4" />
        </Button>
        {isPlaying ? (
          <Button variant="outline" size="sm" onClick={handlePause}>
            <Pause className="h-4 w-4 mr-1" /> Пауза
          </Button>
        ) : (
          <Button variant="default" size="sm" onClick={handlePlay}>
            <Play className="h-4 w-4 mr-1" /> {activeStep !== null && activeStep < steps.length - 1 ? 'Продолжить' : 'Запустить'}
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={handleNext} disabled={activeStep !== null && activeStep >= steps.length - 1}>
          <SkipForward className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleReset} disabled={activeStep === null}>
          <RotateCcw className="h-4 w-4 mr-1" /> Сброс
        </Button>
        {activeStep !== null && (
          <span className="text-xs text-muted-foreground ml-auto">
            Шаг {activeStep + 1} из {steps.length}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
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
                isActive
                  ? 'bg-primary/10 border-primary shadow-sm scale-[1.01]'
                  : isPast
                  ? 'bg-secondary/30 border-transparent opacity-70'
                  : isFuture
                  ? 'border-transparent opacity-40'
                  : 'border-transparent hover:bg-secondary/50'
              }`}
            >
              <Badge
                className={`shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-xs transition-colors duration-300 ${
                  isActive
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-background'
                    : isPast
                    ? 'bg-primary/60 text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {isPast ? '✓' : i + 1}
              </Badge>
              <div className={`transition-all duration-300 ${isActive ? '' : ''}`}>
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

export default function Processes() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = processes.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.steps.some(s => s.title.toLowerCase().includes(q));
  });

  return (
    <Layout searchQuery={search} onSearchChange={setSearch} showSearch>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Интерактивные схемы процессов</h1>
          <p className="text-muted-foreground mt-1">Визуализация ключевых IT-процессов с пошаговым описанием</p>
        </div>

        <p className="text-sm text-muted-foreground">Найдено: {filtered.length}</p>

        <div className="space-y-4">
          {filtered.map((process) => {
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

                {isExpanded && (
                  <CardContent className="pt-0 space-y-6">
                    <div className="rounded-lg border bg-card p-4">
                      <MermaidDiagram chart={process.diagramCode} />
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-semibold">Пошаговое описание</h3>
                      <StepPlayer steps={process.steps} processId={process.id} />
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}