import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { terms } from '@/data/terms';
import { categoryLabels, difficultyLabels, difficultyColors } from '@/data/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, ArrowRight, CheckCircle2, Clock, BookOpen, Lightbulb } from 'lucide-react';
import { reviewCard, isDue, type SrsCard } from '@/lib/srs';
import { motion, AnimatePresence } from 'framer-motion';

export default function Review() {
  const [srsData, setSrsData] = useLocalStorage<Record<string, SrsCard>>('it-library-srs', {});
  const [favorites] = useLocalStorage<string[]>('it-library-favorites', []);
  const [flipped, setFlipped] = useState(false);

  const dueCards = useMemo(() => {
    const cards = favorites
      .map((id) => {
        const term = terms.find((t) => t.id === id);
        if (!term) return null;
        const card = srsData[id] || { termId: id, interval: 0, repetitions: 0, easeFactor: 2.5, nextReview: new Date().toISOString() };
        return { term, card, due: isDue(card) };
      })
      .filter(Boolean) as { term: typeof terms[0]; card: SrsCard; due: boolean }[];
    return cards.filter((c) => c.due);
  }, [srsData, favorites]);

  const handleReview = (termId: string, quality: number) => {
    const existing = srsData[termId] || { termId, interval: 0, repetitions: 0, easeFactor: 2.5, nextReview: new Date().toISOString() };
    const updated = reviewCard(existing, quality);
    setSrsData({ ...srsData, [termId]: updated });
    setFlipped(false);
  };

  if (favorites.length === 0) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center py-16 space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-muted">
            <BookOpen className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <p className="text-lg font-medium">Добавьте термины в избранное, чтобы повторять их</p>
          <Link to="/">
            <Button className="rounded-xl">Перейти к каталогу</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  if (dueCards.length === 0) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center py-16 space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <p className="text-lg font-medium">Всё повторено!</p>
          <p className="text-muted-foreground">Следующие карточки появятся позже. Добавьте новые термины в избранное.</p>
          <Link to="/">
            <Button variant="outline" className="rounded-xl">К каталогу</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const current = dueCards[0];
  const term = current.term;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="font-heading text-4xl font-bold tracking-tight">Повторение</h1>
          <p className="text-muted-foreground mt-1">Закрепляйте знания методом интервального повторения</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Карточек на повторение: {dueCards.length}</span>
        </div>

        {/* Flip Card */}
        <div className="perspective-1000">
          <div
            className={`relative w-full min-h-[280px] cursor-pointer transition-transform duration-500 preserve-3d ${flipped ? 'rotate-y-180' : ''}`}
            onClick={() => setFlipped(!flipped)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setFlipped(!flipped)}
          >
            {/* Front */}
            <div className="absolute inset-0 backface-hidden">
              <div className="h-full rounded-2xl border-2 border-primary/20 bg-card p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-card">
                <Badge className={difficultyColors[term.difficulty]}>{difficultyLabels[term.difficulty]}</Badge>
                <h2 className="font-heading text-3xl font-bold">{term.title}</h2>
                <p className="text-muted-foreground">{term.definition}</p>
                <p className="text-xs text-muted-foreground">Нажмите, чтобы перевернуть</p>
              </div>
            </div>

            {/* Back */}
            <div className="absolute inset-0 backface-hidden rotate-y-180">
              <div className="h-full rounded-2xl border-2 border-warning/30 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 p-8 flex flex-col items-center justify-center text-center space-y-4">
                <Lightbulb className="h-8 w-8 text-warning" />
                <p className="text-xl font-medium leading-relaxed">"{term.analogy}"</p>
                <p className="text-xs text-muted-foreground">Нажмите, чтобы перевернуть обратно</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rating buttons */}
        <AnimatePresence>
          {flipped && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-2"
            >
              <Button variant="outline" onClick={() => handleReview(term.id, 0)} className="rounded-xl">
                <RotateCcw className="h-4 w-4 mr-1" /> Снова
              </Button>
              <Button variant="outline" onClick={() => handleReview(term.id, 3)} className="rounded-xl">
                Сложно
              </Button>
              <Button onClick={() => handleReview(term.id, 4)} className="rounded-xl">
                <CheckCircle2 className="h-4 w-4 mr-1" /> Хорошо
              </Button>
              <Button variant="secondary" onClick={() => handleReview(term.id, 5)} className="rounded-xl">
                Легко
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <Link to={`/term/${term.id}`} className="text-sm text-primary hover:underline inline-flex items-center gap-1">
          Открыть термин <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </Layout>
  );
}
