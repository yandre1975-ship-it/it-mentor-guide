import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { CodeBlock } from '@/components/CodeBlock';
import { terms } from '@/data/terms';
import { categoryLabels, difficultyLabels, difficultyColors } from '@/data/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Star, StarOff, ArrowLeft, Lightbulb, Code, LinkIcon, Play, ChevronRight } from 'lucide-react';
import { quizzes } from '@/data/quizzes';

export default function TermDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const term = terms.find((t) => t.id === id);

  const [favorites, setFavorites] = useLocalStorage<string[]>('it-library-favorites', []);
  const [notes, setNotes] = useLocalStorage<Record<string, string>>('it-library-notes', {});

  if (!term) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Термин не найден</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/')}>
            Вернуться к каталогу
          </Button>
        </div>
      </Layout>
    );
  }

  const isFavorite = favorites.includes(term.id);
  const toggleFavorite = () => {
    setFavorites(isFavorite ? favorites.filter((f) => f !== term.id) : [...favorites, term.id]);
  };

  const relatedTermObjects = terms.filter((t) => term.relatedTerms.includes(t.id));
  const relatedQuiz = quizzes.find((q) => q.relatedTermId === term.id);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Каталог</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to={`/?category=${term.category}`} className="hover:text-foreground transition-colors">
            {categoryLabels[term.category]}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium truncate">{term.title}</span>
        </nav>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Назад
          </Button>
          <Button variant={isFavorite ? 'default' : 'outline'} size="sm" onClick={toggleFavorite}>
            {isFavorite ? <StarOff className="h-4 w-4 mr-1" /> : <Star className="h-4 w-4 mr-1" />}
            {isFavorite ? 'Убрать из избранного' : 'В избранное'}
          </Button>
        </div>

        {/* Title */}
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold">{term.title}</h1>
            <Badge className={difficultyColors[term.difficulty]}>{difficultyLabels[term.difficulty]}</Badge>
            <Badge variant="outline">{categoryLabels[term.category]}</Badge>
          </div>
          <p className="text-lg text-muted-foreground mt-3">{term.definition}</p>
        </div>

        {/* Analogy */}
        <section className="rounded-lg border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-5 w-5 text-warning" />
            <h2 className="font-semibold text-lg">Простая аналогия</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">{term.analogy}</p>
        </section>

        {/* Code example */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Code className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">Технический пример</h2>
          </div>
          <CodeBlock code={term.exampleCode} language={term.exampleLanguage} />
        </section>

        {/* Related quiz */}
        {relatedQuiz && (
          <section className="rounded-lg border bg-primary/5 border-primary/20 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-sm">🧠 Проверь себя</p>
                <p className="text-sm text-muted-foreground">{relatedQuiz.title} — {relatedQuiz.questions.length} вопросов</p>
              </div>
              <Link to="/quizzes">
                <Button size="sm" variant="outline">Пройти квиз</Button>
              </Link>
            </div>
          </section>
        )}

        {/* Related terms */}
        {relatedTermObjects.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <LinkIcon className="h-5 w-5 text-accent" />
              <h2 className="font-semibold text-lg">Связанные термины</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {relatedTermObjects.map((rt) => (
                <Link key={rt.id} to={`/term/${rt.id}`}>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-sm py-1 px-3">
                    {rt.title}
                  </Badge>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Video */}
        {term.videoUrl && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Play className="h-5 w-5 text-destructive" />
              <h2 className="font-semibold text-lg">Видео-объяснение</h2>
            </div>
            <a
              href={term.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              Смотреть на YouTube →
            </a>
          </section>
        )}

        {/* Notes */}
        <section>
          <h2 className="font-semibold text-lg mb-3">📝 Ваши заметки</h2>
          <Textarea
            placeholder="Оставьте заметку к этому термину..."
            value={notes[term.id] || ''}
            onChange={(e) => setNotes({ ...notes, [term.id]: e.target.value })}
            rows={4}
          />
        </section>
      </div>
    </Layout>
  );
}
