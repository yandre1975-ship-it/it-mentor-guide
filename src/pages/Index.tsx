import { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { terms } from '@/data/terms';
import { categoryLabels, difficultyLabels, type Category, type Difficulty } from '@/data/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, Rocket, Briefcase, BrainCircuit, ArrowRight, RotateCcw, TrendingUp, BookOpen, LayoutGrid, List, Sprout, Zap, Flame, X, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { CategoryIcon } from '@/components/CategoryIcon';
import { getCategoryStyle, getCategoryBorderColor } from '@/lib/colors';
import { motion, useInView } from 'framer-motion';

const difficultyIcons = {
  beginner: { icon: Sprout, color: 'text-emerald-500', label: 'Для всех' },
  intermediate: { icon: Zap, color: 'text-amber-500', label: 'Нужны основы' },
  advanced: { icon: Flame, color: 'text-red-500', label: 'Для разбирающихся' },
};

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const view = (searchParams.get('view') as 'grid' | 'list') || 'grid';
  const [catalogOpen, setCatalogOpen] = useState(false);
  const catalogRef = useRef<HTMLDivElement>(null);

  const selectedCategory = (searchParams.get('category') as Category) || null;
  const selectedDifficulty = (searchParams.get('difficulty') as Difficulty) || null;

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value); else params.delete(key);
    });
    setSearchParams(params, { replace: true });
  };

  const setSelectedCategory = (cat: Category | null) => {
    updateParams({ category: cat });
  };

  const setSelectedDifficulty = (diff: Difficulty | null) => {
    updateParams({ difficulty: diff });
  };

  const setSearch = (value: string) => {
    updateParams({ search: value || null });
  };

  const setView = (v: 'grid' | 'list') => {
    updateParams({ view: v === 'grid' ? null : v });
  };

  const filtered = useMemo(() => {
    return terms.filter((t) => {
      const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.definition.toLowerCase().includes(search.toLowerCase());
      const matchCat = !selectedCategory || t.category === selectedCategory;
      const matchDiff = !selectedDifficulty || t.difficulty === selectedDifficulty;
      return matchSearch && matchCat && matchDiff;
    });
  }, [search, selectedCategory, selectedDifficulty]);

  const categories = Object.entries(categoryLabels) as [Category, string][];
  const difficulties = Object.entries(difficultyLabels) as [Difficulty, string][];

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const showHero = !search && !selectedCategory && !selectedDifficulty;
  const showCatalog = !showHero || catalogOpen || search || selectedCategory || selectedDifficulty;

  return (
    <Layout>
      <div className="space-y-10">

        {/* Hero block */}
        {showHero && (
          <section className="relative rounded-3xl border overflow-hidden bg-gradient-to-br from-background to-muted/40 p-6 sm:p-10 space-y-8">
            {/* Subtle pattern background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" className="fill-foreground" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <div className="relative max-w-2xl mx-auto text-center space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="font-heading text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] text-balance"
              >
                IT простыми словами
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-muted-foreground text-lg sm:text-xl max-w-lg mx-auto"
              >
                Без воды и сложного кода
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  <AnimatedCounter target={terms.length} className="mr-1" /> терминов
                </Badge>
              </motion.div>
            </div>

            {/* Entry points */}
            <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <EntryCard
                to="/learn/internet"
                icon={Rocket}
                title="Я ничего не знаю"
                subtitle="С чего начать в IT"
                colorClass="bg-violet-500"
                colorBg="bg-violet-500/5"
                delay={0}
              />
              <EntryCard
                asButton
                onClick={scrollToCatalog}
                icon={Search}
                title="Найти термин"
                subtitle="Словарь технологий"
                colorClass="bg-blue-500"
                colorBg="bg-blue-500/5"
                delay={0.1}
              />
              <EntryCard
                to="/specialties"
                icon={Briefcase}
                title="Кем работать в IT"
                subtitle="Специальности и зарплаты"
                colorClass="bg-emerald-500"
                colorBg="bg-emerald-500/5"
                delay={0.2}
              />
              <EntryCard
                to="/quizzes"
                icon={BrainCircuit}
                title="Проверить знания"
                subtitle="Квизы и тесты"
                colorClass="bg-amber-500"
                colorBg="bg-amber-500/5"
                delay={0.3}
              />
            </div>
          </section>
        )}

        {/* Progress / Continue learning */}
        {showHero && <ProgressSection />}

        {/* Catalog section */}
        <div ref={catalogRef} id="catalog" className="space-y-6">
          {/* Compact search + categories when hero is visible */}
          {showHero && !catalogOpen && (
            <div className="max-w-xl mx-auto space-y-6 py-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Найти термин..."
                  value={search}
                  onChange={(e) => {
                    setCatalogOpen(true);
                    scrollToCatalog();
                    setSearch(e.target.value);
                  }}
                  className="h-12 pl-10 pr-4 rounded-full text-base"
                />
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className="px-4 py-2 rounded-xl text-sm font-medium border bg-card hover:border-primary/40 hover:shadow-sm transition-all"
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="text-center">
                <button
                  onClick={() => { setCatalogOpen(true); scrollToCatalog(); }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
                >
                  Показать все {terms.length} терминов
                </button>
              </div>
            </div>
          )}

          {/* Full catalog */}
          {showCatalog && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="overline">Каталог</span>
                  <h2 className="text-3xl font-bold tracking-tight font-heading">Термины</h2>
                  <p className="text-muted-foreground mt-1">Ищите по названию или фильтруйте по теме</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Поиск термина..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-10 pl-9 pr-9 rounded-full"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center border rounded-xl overflow-hidden h-10">
                    <button
                      onClick={() => setView('grid')}
                      aria-pressed={view === 'grid'}
                      className={`px-3 h-full flex items-center transition-colors ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
                      title="Карточки"
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setView('list')}
                      aria-pressed={view === 'list'}
                      className={`px-3 h-full flex items-center transition-colors ${view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
                      title="Список"
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="space-y-3" role="group" aria-label="Фильтры">
                <div className="flex flex-wrap gap-2">
                  <FilterChip active={!selectedCategory} onClick={() => setSelectedCategory(null)}>
                    Все категории
                  </FilterChip>
                  {categories.map(([key, label]) => {
                    const active = selectedCategory === key;
                    const style = getCategoryStyle(key);
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedCategory(active ? null : key)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border flex items-center gap-1.5
                          ${active ? 'text-white border-transparent shadow-sm' : 'bg-secondary text-secondary-foreground border-border hover:bg-secondary/80'}`}
                        style={active ? { backgroundColor: style.hex } : {}}
                      >
                        <CategoryIcon category={key} className="w-3.5 h-3.5" />
                        {label}
                      </button>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map(([key, label]) => {
                    const diff = difficultyIcons[key];
                    const Icon = diff.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedDifficulty(selectedDifficulty === key ? null : key)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border flex items-center gap-1.5
                          ${selectedDifficulty === key ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border hover:bg-secondary/80'}`}
                      >
                        <Icon className={`h-3.5 w-3.5 ${selectedDifficulty !== key ? diff.color : ''}`} />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Найдено терминов: {filtered.length}
              </p>
            </>
          )}

          {showCatalog && (
            <>
              {view === 'grid' ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((term, i) => {
                    const style = getCategoryStyle(term.category);
                    const diff = difficultyIcons[term.difficulty];
                    const DiffIcon = diff.icon;
                    return (
                      <motion.div
                        key={term.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <Link to={`/term/${term.id}`}>
                          <Card
                            className={`h-full hover:shadow-hover hover:-translate-y-1 transition-all cursor-pointer group border-l-4 ${getCategoryBorderColor(term.category)}`}
                            role="article"
                          >
                            <CardHeader className="pb-4">
                              <div className="flex items-start justify-between gap-2">
                                <CardTitle className="text-lg group-hover:text-primary transition-colors font-heading">
                                  {term.title}
                                </CardTitle>
                                <Badge className={`shrink-0 text-xs flex items-center gap-1 ${diff.color.replace('text-', 'bg-').replace('500', '100')} ${diff.color.replace('500', '700')}`}>
                                  <DiffIcon className="h-3 w-3" />
                                  {difficultyLabels[term.difficulty]}
                                </Badge>
                              </div>
                              <CardDescription className="line-clamp-2 mt-1.5">
                                {term.definition}
                              </CardDescription>
                              <div className="mt-2 flex items-center gap-1.5">
                                <span
                                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border"
                                  style={{
                                    backgroundColor: style.bgLight,
                                    borderColor: style.hex + '30',
                                    color: style.hex,
                                  }}
                                >
                                  <CategoryIcon category={term.category} className="w-3 h-3" />
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
              ) : (
                <div className="rounded-xl border overflow-hidden bg-card">
                  {filtered.map((term, idx) => {
                    const diff = difficultyIcons[term.difficulty];
                    const DiffIcon = diff.icon;
                    return (
                      <Link
                        key={term.id}
                        to={`/term/${term.id}`}
                        className={`flex items-center justify-between gap-3 px-4 py-3 hover:bg-secondary/40 transition-colors ${idx !== filtered.length - 1 ? 'border-b' : ''}`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <CategoryIcon category={term.category} className="w-5 h-5 shrink-0 text-muted-foreground" />
                          <span className="font-medium truncate">{term.title}</span>
                          <span className="text-xs text-muted-foreground hidden sm:inline-flex">
                            {categoryLabels[term.category]}
                          </span>
                        </div>
                        <Badge className={`shrink-0 text-xs flex items-center gap-1 ${diff.color.replace('text-', 'bg-').replace('500', '100')} ${diff.color.replace('500', '700')}`}>
                          <DiffIcon className="h-3 w-3" />
                          {difficultyLabels[term.difficulty]}
                        </Badge>
                      </Link>
                    );
                  })}
                </div>
              )}

              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-medium">Ничего не найдено</p>
                  <p className="text-sm text-muted-foreground mt-1">Попробуйте изменить фильтры или поисковый запрос</p>
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {['API', 'Docker', 'React'].map((q) => (
                      <button
                        key={q}
                        onClick={() => setSearch(q)}
                        className="text-sm px-3 py-1 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

/* Entry Card */
function EntryCard({
  to,
  asButton,
  onClick,
  icon: Icon,
  title,
  subtitle,
  colorClass,
  colorBg,
  delay,
}: {
  to?: string;
  asButton?: boolean;
  onClick?: () => void;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  colorClass: string;
  colorBg: string;
  delay: number;
}) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className={`group block rounded-2xl ${colorBg} p-5 border border-transparent hover:shadow-hover transition-all cursor-pointer`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`h-10 w-10 rounded-xl ${colorClass} bg-opacity-10 flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <p className="font-semibold text-sm">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
    </motion.div>
  );

  if (asButton) {
    return (
      <button onClick={onClick} className="w-full text-left">
        {content}
      </button>
    );
  }
  return <Link to={to!} className="block">{content}</Link>;
}

/* Filter Chip */
function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border
        ${active ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border hover:bg-secondary/80'}`}
    >
      {children}
    </button>
  );
}

/* Progress Section */
function ProgressSection() {
  const [progress] = useLocalStorage<Record<string, string[]>>('it-library-module-progress', {});
  const moduleProgress = progress['internet'] || [];
  const totalSteps = 5;
  const currentStep = moduleProgress.length;
  const percent = Math.round((currentStep / totalSteps) * 100);

  if (currentStep === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border bg-card p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="font-heading font-semibold text-lg">Продолжить обучение</h2>
        </div>
        {percent === 100 && (
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
            Модуль пройден
          </Badge>
        )}
      </div>

      {/* Roadmap */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isCompleted = i < currentStep;
          const isCurrent = i === currentStep && percent < 100;
          return (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div
                className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 shrink-0 transition-colors
                  ${isCompleted ? 'bg-primary border-primary text-primary-foreground' : isCurrent ? 'border-primary bg-background' : 'border-muted bg-muted'}`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : isCurrent ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                ) : (
                  <span className="text-xs text-muted-foreground">{i + 1}</span>
                )}
              </div>
              {i < totalSteps - 1 && (
                <div className={`flex-1 h-0.5 rounded-full ${i < currentStep ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Link to="/learn/internet">
          <Button size="lg" variant={percent === 100 ? 'outline' : 'default'}>
            {percent === 100 ? <RotateCcw className="h-4 w-4 mr-2" /> : <ArrowRight className="h-4 w-4 mr-2" />}
            {percent === 100 ? 'Повторить' : 'Продолжить'}
          </Button>
        </Link>
        <Link to="/review">
          <Button size="lg" variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" /> Карточки
          </Button>
        </Link>
      </div>
    </motion.section>
  );
}

export default Index;
