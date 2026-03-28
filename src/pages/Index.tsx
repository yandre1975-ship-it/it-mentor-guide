import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { terms } from '@/data/terms';
import { categoryLabels, difficultyLabels, difficultyColors, type Category, type Difficulty } from '@/data/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const Index = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

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

  return (
    <Layout searchQuery={search} onSearchChange={setSearch} showSearch>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Каталог терминов</h1>
          <p className="text-muted-foreground mt-1">Интерактивный справочник для начинающих в IT</p>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border
                ${!selectedCategory ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border hover:bg-secondary/80'}`}
            >
              Все категории
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
          <div className="flex flex-wrap gap-2">
            {difficulties.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedDifficulty(selectedDifficulty === key ? null : key)}
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
              <Card className="h-full hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group">
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
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
