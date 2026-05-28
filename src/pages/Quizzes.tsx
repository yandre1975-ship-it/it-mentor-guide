import { useState, useEffect, useCallback } from 'react';
import { Layout } from '@/components/Layout';
import { quizzes } from '@/data/quizzes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrainCircuit, CheckCircle2, XCircle, RotateCcw, BookOpen, ArrowLeft, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function Quizzes() {
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [search, setSearch] = useState('');
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showReview, setShowReview] = useState(false);

  const activeQuiz = quizzes.find((q) => q.id === activeQuizId);

  const handleAnswer = useCallback((index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    setUserAnswers((prev) => [...prev, index]);
    if (activeQuiz && index === activeQuiz.questions[currentQ].correctIndex) {
      setScore((s) => s + 1);
    }
  }, [answered, activeQuiz, currentQ]);

  const handleNext = useCallback(() => {
    if (!activeQuiz) return;
    if (currentQ + 1 >= activeQuiz.questions.length) {
      setFinished(true);
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  }, [activeQuiz, currentQ]);

  // Trigger confetti after finish when score is computed
  useEffect(() => {
    if (!finished || !activeQuiz) return;
    const finalScore = userAnswers.reduce((acc, answer, idx) => {
      return acc + (answer === activeQuiz.questions[idx].correctIndex ? 1 : 0);
    }, 0);
    const percentage = Math.round((finalScore / activeQuiz.questions.length) * 100);
    if (percentage === 100) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#fcd34d', '#fff'],
      });
    }
  }, [finished, activeQuiz, userAnswers]);

  const resetQuiz = () => {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setAnswered(false);
    setUserAnswers([]);
    setShowReview(false);
  };

  const exitQuiz = () => {
    setActiveQuizId(null);
    resetQuiz();
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (!activeQuiz || finished) return;
    const question = activeQuiz.questions[currentQ];
    const handler = (e: KeyboardEvent) => {
      if (!answered) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= question.options.length) {
          handleAnswer(num - 1);
        }
      } else if (e.key === 'Enter') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeQuiz, currentQ, answered, finished, handleAnswer, handleNext]);

  // Quiz list
  if (!activeQuiz) {
    const filteredQuizzes = quizzes.filter((q) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return q.title.toLowerCase().includes(s) || q.questions.some(qq => qq.question.toLowerCase().includes(s));
    });

    return (
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="font-heading text-4xl font-bold tracking-tight">Мини-квизы</h1>
            <p className="text-muted-foreground mt-1">Проверьте свои знания после изучения терминов</p>
          </div>
          <p className="text-sm text-muted-foreground">Найдено: {filteredQuizzes.length}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredQuizzes.map((quiz) => (
              <Card
                key={quiz.id}
                className="cursor-pointer hover:shadow-hover hover:-translate-y-1 transition-all"
                onClick={() => setActiveQuizId(quiz.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <BrainCircuit className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-heading">{quiz.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{quiz.questions.length} вопросов</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  const question = activeQuiz.questions[currentQ];

  // Finished screen
  if (finished) {
    const percentage = Math.round((score / activeQuiz.questions.length) * 100);
    const wrongAnswers = activeQuiz.questions
      .map((q, i) => ({ q, i, userAnswer: userAnswers[i] }))
      .filter(({ q, userAnswer }) => userAnswer !== q.correctIndex);

    const resultColor =
      percentage === 100 ? 'text-amber-400' :
      percentage >= 80 ? 'text-emerald-500' :
      percentage >= 50 ? 'text-amber-500' : 'text-red-500';

    const resultBg =
      percentage === 100 ? 'bg-amber-50 dark:bg-amber-950/20' :
      percentage >= 80 ? 'bg-emerald-50 dark:bg-emerald-950/20' :
      percentage >= 50 ? 'bg-amber-50 dark:bg-amber-950/20' : 'bg-red-50 dark:bg-red-950/20';

    if (showReview) {
      return (
        <Layout>
          <div className="max-w-2xl mx-auto space-y-6 py-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowReview(false)} className="rounded-xl">
                <ArrowLeft className="h-4 w-4 mr-1" /> Назад к результатам
              </Button>
            </div>
            <h2 className="font-heading text-2xl font-bold">Разбор ошибок</h2>
            <div className="space-y-4">
              {wrongAnswers.map(({ q, i, userAnswer }) => (
                <Card key={i} className="border-destructive/20 rounded-2xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium font-heading">{q.question}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span className="text-sm font-medium">{q.options[q.correctIndex]}</span>
                    </div>
                    {userAnswer !== undefined && userAnswer !== q.correctIndex && (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400">
                        <XCircle className="h-4 w-4 shrink-0" />
                        <span className="text-sm">{q.options[userAnswer]}</span>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">{q.explanation}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setShowReview(false)} className="rounded-xl">
                <ArrowLeft className="h-4 w-4 mr-1" /> К результатам
              </Button>
              <Button onClick={resetQuiz} className="rounded-xl">
                <RotateCcw className="h-4 w-4 mr-1" /> Пройти заново
              </Button>
            </div>
          </div>
        </Layout>
      );
    }

    return (
      <Layout>
        <div className="max-w-lg mx-auto text-center space-y-6 py-8">
          <div className={`w-24 h-24 mx-auto rounded-full ${resultBg} flex items-center justify-center`}>
            <BrainCircuit className={`h-10 w-10 ${resultColor}`} />
          </div>
          <h2 className="font-heading text-2xl font-bold">{activeQuiz.title}</h2>

          {/* Circular progress */}
          <div className="relative w-40 h-40 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
              <motion.circle
                cx="50" cy="50" r="42" fill="none"
                className={resultColor.replace('text-', 'stroke-')}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 42}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - percentage / 100) }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${resultColor}`}>{percentage}%</span>
            </div>
          </div>

          <p className="text-muted-foreground">
            Правильных ответов: {score} из {activeQuiz.questions.length}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="outline" onClick={exitQuiz} className="rounded-xl">К списку квизов</Button>
            {wrongAnswers.length > 0 && (
              <Button variant="secondary" onClick={() => setShowReview(true)} className="rounded-xl">
                <BookOpen className="h-4 w-4 mr-1" /> Разбор ошибок
              </Button>
            )}
            <Button onClick={resetQuiz} className="rounded-xl">
              <RotateCcw className="h-4 w-4 mr-1" /> Пройти заново
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Active question
  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-semibold">{activeQuiz.title}</h2>
          <Button variant="ghost" size="sm" onClick={exitQuiz} className="rounded-xl">Выйти</Button>
        </div>

        {/* Segmented progress */}
        <div className="flex gap-1">
          {activeQuiz.questions.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                i < currentQ ? 'bg-primary' :
                i === currentQ ? 'bg-primary/60' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="rounded-2xl shadow-card p-8">
              <div className="space-y-6">
                <h3 className="font-heading text-xl font-semibold leading-relaxed">
                  {question.question}
                </h3>
                <div className="space-y-3">
                  {question.options.map((option, i) => {
                    const isCorrect = i === question.correctIndex;
                    const isSelected = i === selected;
                    let containerClass = 'rounded-xl border-2 p-4 cursor-pointer transition-all hover:border-primary/30 hover:translate-x-1';
                    if (answered) {
                      if (isCorrect) {
                        containerClass = 'rounded-xl border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 p-4';
                      } else if (isSelected) {
                        containerClass = 'rounded-xl border-2 border-red-500 bg-red-50 dark:bg-red-950/20 p-4';
                      } else {
                        containerClass = 'rounded-xl border-2 border-muted bg-muted/30 p-4 opacity-60';
                      }
                    } else {
                      containerClass += ' border-border bg-card';
                    }

                    return (
                      <div
                        key={i}
                        className={containerClass}
                        onClick={() => handleAnswer(i)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleAnswer(i)}
                      >
                        <div className="flex items-center gap-3">
                          {answered && isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
                          {answered && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-500 shrink-0" />}
                          <span className="flex-1 text-sm font-medium">{option}</span>
                          {!answered && (
                            <kbd className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-md font-mono">
                              {i + 1}
                            </kbd>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {answered && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50 border">
                        <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground leading-relaxed">{question.explanation}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {answered && (
                  <div className="flex justify-end">
                    <Button onClick={handleNext} className="rounded-xl">
                      {currentQ + 1 >= activeQuiz.questions.length ? 'Результаты' : 'Следующий вопрос'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </Layout>
  );
}
