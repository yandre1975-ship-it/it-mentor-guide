import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { specialties, demandLabels, demandColors } from '@/data/specialties';
import { terms } from '@/data/terms';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Briefcase, Wrench, TrendingUp, Code, ChevronDown, ChevronUp } from 'lucide-react';

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
          <h1 className="text-3xl font-bold tracking-tight">IT-специальности</h1>
          <p className="text-muted-foreground mt-1">Обзор востребованных профессий в сфере информационных технологий</p>
        </div>

        <p className="text-sm text-muted-foreground">Найдено: {filtered.length}</p>

        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((spec) => {
            const isExpanded = expandedId === spec.id;
            const related = terms.filter((t) => spec.relatedTermIds.includes(t.id));

            return (
              <Card key={spec.id} className="overflow-hidden flex flex-col">
                <CardHeader
                  className="cursor-pointer hover:bg-secondary/50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : spec.id)}
                  role="button"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <Briefcase className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <CardTitle className="text-lg">{spec.title}</CardTitle>
                        <CardDescription className="mt-1 line-clamp-2">{spec.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={`text-xs ${demandColors[spec.demand]}`}>{demandLabels[spec.demand]}</Badge>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-0 space-y-5 flex-1">
                    {/* Salary */}
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <TrendingUp className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm font-medium">Зарплата: </span>
                      <span className="text-sm text-muted-foreground">{spec.salaryRange}</span>
                    </div>

                    {/* Skills */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Code className="h-4 w-4 text-primary" />
                        <h4 className="font-semibold text-sm">Ключевые навыки</h4>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {spec.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
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
                          <Badge key={tool} variant="outline" className="text-xs">{tool}</Badge>
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
                              <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs">
                                {term.title}
                              </Badge>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
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