import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { terms } from '@/data/terms';
import { categoryLabels, difficultyLabels } from '@/data/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Printer, Trash2, Undo2, BookOpen, Sprout, Zap, Flame } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CategoryIcon } from '@/components/CategoryIcon';
import { getCategoryStyle, getCategoryBorderColor } from '@/lib/colors';
import { motion } from 'framer-motion';

const difficultyIcons = {
  beginner: { icon: Sprout, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
  intermediate: { icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  advanced: { icon: Flame, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/30' },
};

function EmptyFavorites() {
  return (
    <div className="text-center py-16 space-y-5">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-muted">
        <svg className="w-10 h-10 text-muted-foreground/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
          <path d="M8 7h8" />
          <path d="M8 11h5" />
        </svg>
      </div>
      <div>
        <h1 className="font-heading text-2xl font-bold">Ваша книжная полка пуста</h1>
        <p className="text-muted-foreground mt-1 max-w-sm mx-auto">Добавьте термины в избранное, чтобы быстро возвращаться к ним</p>
      </div>
      <Link to="/">
        <Button className="rounded-xl">Перейти к каталогу</Button>
      </Link>
    </div>
  );
}

export default function Favorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>('it-library-favorites', []);
  const [notes] = useLocalStorage<Record<string, string>>('it-library-notes', {});
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  const favoriteTerms = terms.filter((t) => {
    if (!favorites.includes(t.id)) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return t.title.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q);
  });

  const handlePrint = () => window.print();

  const removeFavorite = (id: string) => {
    const prev = [...favorites];
    setFavorites(favorites.filter((f) => f !== id));
    const term = terms.find(t => t.id === id);
    toast({
      title: `«${term?.title || id}» удалён из избранного`,
      action: (
        <Button variant="outline" size="sm" onClick={() => setFavorites(prev)} className="shrink-0 rounded-xl">
          <Undo2 className="h-3.5 w-3.5 mr-1" /> Отменить
        </Button>
      ),
    });
  };

  if (favorites.length === 0) {
    return (
      <Layout>
        <EmptyFavorites />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-4xl font-bold tracking-tight">Избранное</h1>
            <p className="text-muted-foreground mt-1">{favoriteTerms.length} терминов сохранено</p>
          </div>
          <Button variant="outline" onClick={handlePrint} className="no-print rounded-xl">
            <Printer className="h-4 w-4 mr-2" /> Печать / PDF
          </Button>
        </div>

        {favoriteTerms.length === 0 && search ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg font-medium">Ничего не найдено в избранном</p>
          </div>
        ) : (
          <div className="space-y-4">
            {favoriteTerms.map((term) => {
              const style = getCategoryStyle(term.category);
              const diff = difficultyIcons[term.difficulty];
              const DiffIcon = diff.icon;
              return (
                <motion.div
                  key={term.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className={`hover:shadow-hover transition-shadow border-l-4 ${getCategoryBorderColor(term.category)}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <Link to={`/term/${term.id}`} className="flex-1 group">
                          <div className="flex items-center gap-2 flex-wrap">
                            <CardTitle className="text-lg group-hover:text-primary transition-colors font-heading">
                              {term.title}
                            </CardTitle>
                            <Badge className={`text-xs flex items-center gap-1 ${diff.bg} ${diff.color} border-0`}>
                              <DiffIcon className="h-3 w-3" />
                              {difficultyLabels[term.difficulty]}
                            </Badge>
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
                          <CardDescription className="mt-2">{term.definition}</CardDescription>
                          {notes[term.id] && (
                            <p className="mt-2 text-sm italic text-muted-foreground border-l-2 border-primary/30 pl-3">
                              📝 {notes[term.id]}
                            </p>
                          )}
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFavorite(term.id)}
                          className="no-print shrink-0 text-muted-foreground hover:text-destructive rounded-xl"
                          aria-label={`Удалить ${term.title} из избранного`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
