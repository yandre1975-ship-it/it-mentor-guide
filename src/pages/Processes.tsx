import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { MermaidDiagram } from '@/components/MermaidDiagram';
import { processes } from '@/data/processes';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Workflow } from 'lucide-react';

export default function Processes() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Интерактивные схемы процессов</h1>
          <p className="text-muted-foreground mt-1">Визуализация ключевых IT-процессов с пошаговым описанием</p>
        </div>

        <div className="space-y-4">
          {processes.map((process) => {
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
                    {/* Diagram */}
                    <div className="rounded-lg border bg-card p-4">
                      <MermaidDiagram chart={process.diagramCode} />
                    </div>

                    {/* Steps */}
                    <div className="space-y-3">
                      <h3 className="font-semibold">Пошаговое описание</h3>
                      <div className="space-y-2">
                        {process.steps.map((step, i) => (
                          <div key={i} className="flex gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                            <Badge className="shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-xs bg-primary text-primary-foreground">
                              {i + 1}
                            </Badge>
                            <div>
                              <p className="font-medium text-sm">{step.title}</p>
                              <p className="text-sm text-muted-foreground mt-0.5">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
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
