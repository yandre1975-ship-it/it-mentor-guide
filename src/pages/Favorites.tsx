import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { terms } from '@/data/terms';
import { categoryLabels, difficultyLabels, difficultyColors } from '@/data/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Printer, Trash2 } from 'lucide-react';

export default function Favorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>('it-library-favorites', []);
  const [notes] = useLocalStorage<Record<string, string>>('it-library-notes', {});

  const favoriteTerms = terms.filter((t) => favorites.includes(t.id));

  const handlePrint = () => window.print();
  const removeFavorite = (id: string) => setFavorites(favorites.filter((f) => f !== id));

  if (favoriteTerms.length === 0) {
    return (
      <Layout>
        <div className="text-center py-16 space-y-4">
          <Star className="h-16 w-16 mx-auto text-muted-foreground/30" />
          <h1 className="text-2xl font-bold">Избранное пусто</h1>
          <p className="text-muted-foreground">Добавьте термины в избранное, чтобы быстро возвращаться к ним</p>
          <Link to="/">
            <Button>Перейти к каталогу</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Избранное</h1>
            <p className="text-muted-foreground mt-1">{favoriteTerms.length} терминов сохранено</p>
          </div>
          <Button variant="outline" onClick={handlePrint} className="no-print">
            <Printer className="h-4 w-4 mr-2" /> Печать / PDF
          </Button>
        </div>

        <div className="space-y-4">
          {favoriteTerms.map((term) => (
            <Card key={term.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <Link to={`/term/${term.id}`} className="flex-1 group">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {term.title}
                      </CardTitle>
                      <Badge className={`text-xs ${difficultyColors[term.difficulty]}`}>
                        {difficultyLabels[term.difficulty]}
                      </Badge>
                      <Badge variant="outline" className="text-xs">{categoryLabels[term.category]}</Badge>
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
                    className="no-print shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
