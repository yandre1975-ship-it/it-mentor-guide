import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { getModuleById } from '@/data/learningPaths';
import { terms } from '@/data/terms';
import { categoryLabels, difficultyLabels, difficultyColors } from '@/data/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ArrowLeft, CheckCircle2, Circle, BookOpen, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

export default function LearnModule() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const module = getModuleById(moduleId || '');

  const [progress, setProgress] = useLocalStorage<Record<string, string[]>>(
    'it-library-module-progress',
    {}
  );

  useEffect(() => {
    if (module) {
      const viewed = progress[module.id] || [];
      const moduleTerms = module.termIds.map((id) => terms.find((t) => t.id === id)).filter(Boolean);
      if (viewed.length === moduleTerms.length && moduleTerms.length > 0) {
        confetti({
          particleCount: 100,
          spread: 60,
          origin: { y: 0.5 },
          colors: ['#6366F1', '#10B981', '#F59E0B', '#EC4899'],
        });
      }
    }
  }, [module, progress]);

  if (!module) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Модуль не найден</p>
          <Link to="/">
            <Button variant="outline" className="mt-4 rounded-xl">Вернуться на главную</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const moduleTerms = module.termIds
    .map((id) => terms.find((t) => t.id === id))
    .filter(Boolean);

  const viewed = progress[module.id] || [];
  const progressPercent = moduleTerms.length > 0
    ? Math.round((viewed.length / moduleTerms.length) * 100)
    : 0;

  const markViewed = (termId: string) => {
    if (!viewed.includes(termId)) {
      setProgress({ ...progress, [module.id]: [...viewed, termId] });
    }
  };

  const isViewed = (termId: string) => viewed.includes(termId);
  const currentIndex = moduleTerms.findIndex((t) => t && !isViewed(t.id));

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="rounded-xl">
              <ArrowLeft className="h-4 w-4 mr-1" /> Назад
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-4xl">{module.icon}</span>
            <div>
              <p className="text-sm text-muted-foreground font-medium">{module.subtitle}</p>
              <h1 className="font-heading text-3xl font-bold tracking-tight">{module.title}</h1>
            </div>
          </div>

          <p className="text-lg text-muted-foreground">{module.description}</p>
        </div>

        {/* Story */}
        <section className="rounded-2xl border bg-primary/5 p-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="font-heading font-semibold text-lg">О чём этот модуль</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">{module.story}</p>
        </section>

        {/* Roadmap */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-semibold text-lg">Дорожная карта</h2>
            <span className="text-sm text-muted-foreground">{viewed.length} из {moduleTerms.length}</span>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-muted" />

            <div className="space-y-4">
              {moduleTerms.map((term, index) => {
                if (!term) return null;
                const viewedFlag = isViewed(term.id);
                const isCurrent = index === currentIndex;

                return (
                  <motion.div
                    key={term.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative flex items-start gap-4"
                  >
                    {/* Checkpoint */}
                    <div className="relative z-10 shrink-0">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors
                          ${viewedFlag
                            ? 'bg-primary border-primary text-primary-foreground'
                            : isCurrent
                              ? 'bg-background border-primary text-primary'
                              : 'bg-muted border-muted text-muted-foreground'
                        }`}
                      >
                        {viewedFlag ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : isCurrent ? (
                          <Circle className="h-5 w-5 animate-pulse" />
                        ) : (
                          <Lock className="h-4 w-4" />
                        )}
                      </div>
                    </div>

                    {/* Card */}
                    <Link
                      to={`/term/${term.id}`}
                      onClick={() => markViewed(term.id)}
                      className="flex-1 min-w-0"
                    >
                      <Card className={`hover:shadow-hover transition-all cursor-pointer group ${viewedFlag ? 'border-primary/20 bg-primary/5' : ''}`}>
                        <CardHeader className="py-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <CardTitle className={`text-base font-heading group-hover:text-primary transition-colors ${viewedFlag ? 'line-through opacity-60' : ''}`}>
                                  {term.title}
                                </CardTitle>
                                <Badge className={`text-xs ${difficultyColors[term.difficulty]}`}>
                                  {difficultyLabels[term.difficulty]}
                                </Badge>
                              </div>
                              <CardDescription className="line-clamp-2 mt-1">
                                {term.definition}
                              </CardDescription>
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0 hidden sm:block">
                              {categoryLabels[term.category]}
                            </span>
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Completion */}
        {progressPercent === 100 && (
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border bg-emerald-50 dark:bg-emerald-950/20 p-8 text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-emerald-800 dark:text-emerald-200">Модуль пройден!</h2>
            <p className="text-muted-foreground max-w-md mx-auto">Вы разобрались в том, как работает интернет. Можете переходить к следующему разделу.</p>
            <Link to="/">
              <Button className="mt-2 rounded-xl">Вернуться на главную</Button>
            </Link>
          </motion.section>
        )}
      </div>
    </Layout>
  );
}
