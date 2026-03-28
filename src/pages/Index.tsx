import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { terms } from '@/data/terms';
import { categoryLabels, difficultyLabels, difficultyColors, type Category, type Difficulty } from '@/data/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Book, Workflow, BrainCircuit, Layers, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');

  const selectedCategory = (searchParams.get('category') as Category) || null;
  const selectedDifficulty = (searchParams.get('difficulty') as Difficulty) || null;

  const setSelectedCategory = (cat: Category | null) => {
    const params = new URLSearchParams(searchParams);
    if (cat) params.set('category', cat); else params.delete('category');
    setSearchParams(params, { replace: true });
  };

  const setSelectedDifficulty = (diff: Difficulty | null) => {
    const params = new URLSearchParams(searchParams);
    if (diff) params.set('difficulty', diff); else params.delete('difficulty');
    setSearchParams(params, { replace: true });
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

  const showHero = !search && !selectedCategory && !selectedDifficulty;

  return (
    <Layout searchQuery={search} onSearchChange={setSearch} showSearch>
      <div className="space-y-6">

        {/* Hero block */}
        {showHero && (
          <section className="rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6 sm:p-8 space-y-6">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Изучай IT через <span className="text-primary">аналогии</span>, схемы и квизы
              </h1>
              <p className="text-muted-foreground mt-3 text-lg">
                {terms.length} терминов с понятными объяснениями, примерами кода и связями между концепциями. Для тех, кто начинает путь в IT.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Link to="/specialties" className="group">
                <div className="rounded-xl border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all">
                  <Layers className="h-5 w-5 text-primary mb-2" />
                  <p className="font-semibold text-sm">Специальности</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Кем можно работать в IT</p>
                </div>
              </Link>
              <Link to="/features" className="group">
                <div className="rounded-xl border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all">
                  <Zap className="h-5 w-5 text-primary mb-2" />
                  <p className="font-semibold text-sm">Фичи</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Как устроены продукты</p>
                </div>
              </Link>
              <Link to="/processes" className="group">
                <div className="rounded-xl border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all">
                  <Workflow className="h-5 w-5 text-primary mb-2" />
                  <p className="font-semibold text-sm">Процессы</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Интерактивные схемы</p>
                </div>
              </Link>
              <Link to="/quizzes" className="group">
                <div className="rounded-xl border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all">
                  <BrainCircuit className="h-5 w-5 text-primary mb-2" />
                  <p className="font-semibold text-sm">Квизы</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Проверь свои знания</p>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Section title when hero is hidden */}
        {!showHero && (
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Каталог терминов</h1>
            <p className="text-muted-foreground mt-1">Интерактивный справочник для начинающих в IT</p>
          </div>
        )}

        {/* Filters */}
        <div className="space-y-3" role="group" aria-label="Фильтры">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              aria-pressed={!selectedCategory}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border
                ${!selectedCategory ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border hover:bg-secondary/80'}`}
            >
              Все категории
            </button>
            {categories.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                aria-pressed={selectedCategory === key}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border
                  ${selectedCategory === key ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border hover:bg-secondary/80'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {difficulties.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedDifficulty(selectedDifficulty === key ? null : key)}
                aria-pressed={selectedDifficulty === key}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border
                  ${selectedDifficulty === key ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border hover:bg-secondary/80'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          Найдено терминов: {filtered.length}
        </p>

        {/* Terms grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((term) => (
            <Link key={term.id} to={`/term/${term.id}`}>
              <Card className="h-full hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group" role="article">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {term.title}
                    </CardTitle>
                    <Badge className={`shrink-0 text-xs ${difficultyColors[term.difficulty]}`}>
                      {difficultyLabels[term.difficulty]}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2 mt-1.5">
                    {term.definition}
                  </CardDescription>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      {categoryLabels[term.category]}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">Ничего не найдено</p>
            <p className="text-sm mt-1">Попробуйте изменить фильтры или поисковый запрос</p>
            <p className="text-sm mt-3">Попробуйте: <button onClick={() => setSearch('API')} className="text-primary hover:underline">API</button>, <button onClick={() => setSearch('Docker')} className="text-primary hover:underline">Docker</button>, <button onClick={() => setSearch('React')} className="text-primary hover:underline">React</button></p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
