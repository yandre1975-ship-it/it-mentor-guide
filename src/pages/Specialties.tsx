import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { specialties, demandLabels, demandColors, type Specialty } from '@/data/specialties';
import { terms } from '@/data/terms';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Briefcase, Wrench, TrendingUp, Code, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

function parseSalaryRange(range: string): { min: number; max: number; avg: number } | null {
  const match = range.replace(/\s/g, '').match(/(\d+)[–-](\d+)/);
  if (!match) return null;
  const min = parseInt(match[1], 10);
  const max = parseInt(match[2], 10);
  return { min, max, avg: Math.round((min + max) / 2) };
}

function SalaryBar({ range }: { range: string }) {
  const parsed = useMemo(() => parseSalaryRange(range), [range]);
  if (!parsed) {
    return <span className="text-sm text-muted-foreground">{range}</span>;
  }
  const { min, max, avg } = parsed;
  const minDisplay = (min / 1000).toFixed(0);
  const maxDisplay = (max / 1000).toFixed(0);
  const avgPercent = ((avg - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{minDisplay}k</span>
        <span>{maxDisplay}k</span>
      </div>
      <div className="relative h-2 rounded-full bg-muted overflow-hidden">
        <div className="absolute inset-y-0 left-0 rounded-full bg-primary/30" style={{ width: '100%' }} />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background shadow-sm"
          style={{ left: `${avgPercent}%` }}
        />
      </div>
      <p className="text-sm font-medium text-center">{range}</p>
    </div>
  );
}

function DemandBadge({ demand }: { demand: Specialty['demand'] }) {
  const isHigh = demand === 'high';
  return (
    <Badge className={`${demandColors[demand]} relative`}>
      {isHigh && (
        <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      )}
      <span className={isHigh ? 'ml-1.5' : ''}>{demandLabels[demand]}</span>
    </Badge>
  );
}

export default function Specialties() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = specialties.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.skills.some(sk => sk.toLowerCase().includes(q));
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-4xl font-bold tracking-tight">IT-специальности</h1>
          <p className="text-muted-foreground mt-1">Обзор востребованных профессий в сфере информационных технологий</p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию или навыку..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-full"
          />
        </div>

        <p className="text-sm text-muted-foreground">Найдено: {filtered.length}</p>

        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((spec, i) => {
            const isExpanded = expandedId === spec.id;
            const related = terms.filter((t) => spec.relatedTermIds.includes(t.id));

            return (
              <motion.div
                key={spec.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="overflow-hidden flex flex-col hover:shadow-hover transition-shadow">
                  <CardHeader
                    className="cursor-pointer hover:bg-secondary/30 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : spec.id)}
                    role="button"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-heading">{spec.title}</CardTitle>
                          <CardDescription className="mt-1 line-clamp-2">{spec.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <DemandBadge demand={spec.demand} />
                        {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    </div>
                  </CardHeader>

                  <div className={`animate-collapse ${isExpanded ? 'animate-collapse-open' : ''}`}>
                    <div className="animate-collapse-inner">
                      <CardContent className="pt-0 space-y-5 flex-1">
                        {/* Salary */}
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                          <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="h-4 w-4 text-primary shrink-0" />
                            <span className="text-sm font-semibold">Зарплата</span>
                          </div>
                          <SalaryBar range={spec.salaryRange} />
                        </div>

                        {/* Skills */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Code className="h-4 w-4 text-primary" />
                            <h4 className="font-semibold text-sm">Ключевые навыки</h4>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {spec.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs rounded-lg">{skill}</Badge>
                            ))}
                          </div>
                        </div>

                        {/* Tools */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Wrench className="h-4 w-4 text-primary" />
                            <h4 className="font-semibold text-sm">Инструменты</h4>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {spec.tools.map((tool) => (
                              <Badge key={tool} variant="outline" className="text-xs rounded-lg">{tool}</Badge>
                            ))}
                          </div>
                        </div>

                        {/* Related terms */}
                        {related.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Связанные термины</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {related.map((term) => (
                                <Link key={term.id} to={`/term/${term.id}`}>
                                  <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs rounded-lg">
                                    {term.title}
                                  </Badge>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
