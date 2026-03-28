import { useState, useMemo } from 'react';
import { Layout } from '@/components/Layout';
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
import { Link } from 'react-router-dom';
import { Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { MermaidDiagram } from '@/components/MermaidDiagram';

const Features = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FeatureCategory | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return features.filter((f) => {
      const q = search.toLowerCase();
      const matchSearch = !q || f.title.toLowerCase().includes(q) || f.description.toLowerCase().includes(q);
      const matchCat = !selectedCategory || f.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [search, selectedCategory]);

  const categories = Object.entries(featureCategoryLabels) as [FeatureCategory, string][];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Каталог фич</h1>
          <p className="text-muted-foreground mt-1">Популярные функции в IT-продуктах: как работают, кто делает, какие технологии нужны</p>
        </div>

        {/* Category filters */}
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

        <p className="text-sm text-muted-foreground">Найдено: {filtered.length}</p>

        {/* Features grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((feature) => {
            const isExpanded = expandedId === feature.id;
            const relatedTerms = terms.filter((t) => feature.relatedTermIds.includes(t.id));
            const relatedSpecs = specialties.filter((s) => feature.specialistIds.includes(s.id));

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

                {isExpanded && (
                  <CardContent className="space-y-4 pt-0" onClick={(e) => e.stopPropagation()}>
                    {/* Diagram */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Поток данных</h4>
                      <div className="rounded-lg border bg-card p-4">
                        <MermaidDiagram chart={feature.diagramCode} />
                      </div>
                    </div>

                    {/* How it works */}
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Как это работает</h4>
                      <p className="text-sm text-muted-foreground">{feature.howItWorks}</p>
                    </div>

                    {/* Tools */}
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Инструменты</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {feature.tools.map((tool) => (
                          <Badge key={tool} variant="secondary" className="text-xs">{tool}</Badge>
                        ))}
                      </div>
                    </div>

                    {/* Related terms */}
                    {relatedTerms.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Связанные термины</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {relatedTerms.map((t) => (
                            <Link key={t.id} to={`/term/${t.id}`}>
                              <Badge variant="outline" className="text-xs hover:bg-primary/10 cursor-pointer">{t.title}</Badge>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Specialists */}
                    {relatedSpecs.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Кто реализует</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {relatedSpecs.map((s) => (
                            <Badge key={s.id} variant="outline" className="text-xs">{s.title}</Badge>
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

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">Ничего не найдено</p>
            <p className="text-sm mt-1">Попробуйте изменить фильтры</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Features;
