import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { CodeBlock } from '@/components/CodeBlock';
import { terms } from '@/data/terms';
import { categoryLabels, difficultyLabels, type Difficulty } from '@/data/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  Star,
  StarOff,
  ArrowLeft,
  Lightbulb,
  Code,
  LinkIcon,
  Play,
  ChevronRight,
  GraduationCap,
  Share2,
  Printer,
  Sprout,
  Zap,
  Flame,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { quizzes } from '@/data/quizzes';
import { TermComments } from '@/components/TermComments';
import { CategoryIcon } from '@/components/CategoryIcon';
import { getCategoryStyle } from '@/lib/colors';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const difficultyConfig: Record<Difficulty, { icon: React.ElementType; color: string; bg: string }> = {
  beginner: { icon: Sprout, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
  intermediate: { icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  advanced: { icon: Flame, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/30' },
};

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

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: term.title, text: term.definition, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: 'Ссылка скопирована', description: 'Отправьте её коллеге или сохраните.' });
      }
    } catch {
      // ignore share cancellation
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const youtubeId = term.videoUrl
    ? (term.videoUrl.match(/(?:youtu\.be\/|v=|embed\/)([a-zA-Z0-9_-]{11})/)?.[1] ?? null)
    : null;

  const relatedTermObjects = terms.filter((t) => term.relatedTerms.includes(t.id));
  const prerequisiteTerms = term.prerequisites
    ? terms.filter((t) => term.prerequisites!.includes(t.id))
    : [];
  const relatedQuiz = quizzes.find((q) => q.relatedTermId === term.id);

  const categoryStyle = getCategoryStyle(term.category);
  const diffConfig = difficultyConfig[term.difficulty];
  const DiffIcon = diffConfig.icon;

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

        {/* Quick actions bar */}
        <div className="flex items-center justify-between gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="rounded-xl">
            <ArrowLeft className="h-4 w-4 mr-1" /> Назад
          </Button>
          <TooltipProvider>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-xl" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Поделиться</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isFavorite ? 'default' : 'outline'}
                    size="icon"
                    className="rounded-xl"
                    onClick={toggleFavorite}
                  >
                    {isFavorite ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isFavorite ? 'Убрать из избранного' : 'В избранное'}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-xl" onClick={handlePrint}>
                    <Printer className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Печать</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>

        {/* Cover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1]">
              {term.title}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium border"
              style={{
                backgroundColor: categoryStyle.bgLight,
                borderColor: categoryStyle.hex + '30',
                color: categoryStyle.hex,
              }}
            >
              <CategoryIcon category={term.category} className="w-4 h-4" />
              {categoryLabels[term.category]}
            </span>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium border ${diffConfig.bg} ${diffConfig.color} border-current/20`}>
              <DiffIcon className="h-4 w-4" />
              {difficultyLabels[term.difficulty]}
            </span>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">{term.definition}</p>
        </motion.div>

        {/* Prerequisites */}
        {prerequisiteTerms.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border bg-amber-50 dark:bg-amber-950/20 p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="h-5 w-5 text-amber-600" />
              <h2 className="font-heading font-semibold text-sm">Сначала рекомендуем</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {prerequisiteTerms.map((pt) => (
                <Link key={pt.id} to={`/term/${pt.id}`}>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors rounded-lg">
                    {pt.title}
                  </Badge>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* Analogy — visual center */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative rounded-2xl border-l-4 border-warning bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 p-6 sm:p-8"
        >
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <Lightbulb className="h-6 w-6 text-warning" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-lg mb-2">Простая аналогия</h2>
              <p className="text-xl font-medium leading-relaxed text-foreground">"{term.analogy}"</p>
            </div>
          </div>
        </motion.section>

        {/* Code / Tabs */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="analogy" className="w-full">
            <TabsList className="rounded-xl mb-4">
              <TabsTrigger value="analogy" className="rounded-lg gap-1.5">
                <Lightbulb className="h-4 w-4" /> Простая аналогия
              </TabsTrigger>
              <TabsTrigger value="code" className="rounded-lg gap-1.5">
                <Code className="h-4 w-4" /> Технический пример
              </TabsTrigger>
            </TabsList>
            <TabsContent value="analogy" className="mt-0">
              <div className="rounded-xl border bg-card p-6">
                <p className="text-muted-foreground leading-relaxed">{term.analogy}</p>
              </div>
            </TabsContent>
            <TabsContent value="code" className="mt-0">
              <CodeBlock code={term.exampleCode} language={term.exampleLanguage} />
            </TabsContent>
          </Tabs>
        </motion.section>

        {/* Related quiz */}
        {relatedQuiz && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl border bg-primary/5 border-primary/20 p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-sm">Проверь себя</p>
                  <p className="text-sm text-muted-foreground">{relatedQuiz.title} — {relatedQuiz.questions.length} вопросов</p>
                </div>
              </div>
              <Link to="/quizzes">
                <Button size="sm" variant="outline" className="rounded-xl">
                  Пройти квиз
                </Button>
              </Link>
            </div>
          </motion.section>
        )}

        {/* Knowledge path */}
        {(relatedTermObjects.length > 0 || prerequisiteTerms.length > 0) && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-accent" />
              <h2 className="font-heading font-semibold text-lg">Путь знаний</h2>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {prerequisiteTerms.map((pt) => (
                <Link key={pt.id} to={`/term/${pt.id}`}>
                  <div className="flex flex-col items-center gap-1.5 group">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{pt.title}</span>
                  </div>
                </Link>
              ))}
              {prerequisiteTerms.length > 0 && (
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-fab shrink-0">
                  <BookOpen className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium whitespace-nowrap">{term.title}</span>
              </div>
              {relatedTermObjects.length > 0 && (
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              {relatedTermObjects.map((rt) => (
                <Link key={rt.id} to={`/term/${rt.id}`}>
                  <div className="flex flex-col items-center gap-1.5 group">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <LinkIcon className="h-4 w-4" />
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{rt.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* Video */}
        {term.videoUrl && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Play className="h-5 w-5 text-destructive" />
              <h2 className="font-heading font-semibold text-lg">Видео-объяснение</h2>
            </div>
            {youtubeId ? (
              <a
                href={term.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block relative rounded-2xl overflow-hidden border aspect-video bg-muted"
              >
                <img
                  src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                  alt={`Превью видео: ${term.title}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                  <div className="h-14 w-14 rounded-full bg-destructive text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 ml-0.5" fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                  Смотреть на YouTube
                </div>
              </a>
            ) : (
              <a
                href={term.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                Смотреть на YouTube →
              </a>
            )}
          </motion.section>
        )}

        {/* Notes */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-heading font-semibold text-lg mb-3">📝 Ваши заметки</h2>
          <Textarea
            placeholder="Оставьте заметку к этому термину..."
            value={notes[term.id] || ''}
            onChange={(e) => setNotes({ ...notes, [term.id]: e.target.value })}
            rows={4}
            className="rounded-xl"
          />
        </motion.section>

        {/* Comments */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <TermComments termId={term.id} />
        </motion.div>
      </div>
    </Layout>
  );
}
