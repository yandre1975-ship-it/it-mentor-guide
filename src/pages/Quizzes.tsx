import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { quizzes } from '@/data/quizzes';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BrainCircuit, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

export default function Quizzes() {
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  const activeQuiz = quizzes.find((q) => q.id === activeQuizId);

  const handleAnswer = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    if (activeQuiz && index === activeQuiz.questions[currentQ].correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (!activeQuiz) return;
    if (currentQ + 1 >= activeQuiz.questions.length) {
      setFinished(true);
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setAnswered(false);
  };

  const exitQuiz = () => {
    setActiveQuizId(null);
    resetQuiz();
  };

  // Quiz list
  if (!activeQuiz) {
    return (
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Мини-квизы</h1>
            <p className="text-muted-foreground mt-1">Проверьте свои знания после изучения терминов</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {quizzes.map((quiz) => (
              <Card
                key={quiz.id}
                className="cursor-pointer hover:shadow-md hover:border-primary/30 transition-all"
                onClick={() => setActiveQuizId(quiz.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <BrainCircuit className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <CardTitle className="text-base">{quiz.title}</CardTitle>
                      <CardDescription>{quiz.questions.length} вопросов</CardDescription>
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
  const progress = ((currentQ + (answered ? 1 : 0)) / activeQuiz.questions.length) * 100;

  // Finished
  if (finished) {
    const percentage = Math.round((score / activeQuiz.questions.length) * 100);
    return (
      <Layout>
        <div className="max-w-lg mx-auto text-center space-y-6 py-8">
          <BrainCircuit className="h-16 w-16 mx-auto text-primary" />
          <h2 className="text-2xl font-bold">{activeQuiz.title}</h2>
          <div className="text-5xl font-bold text-primary">{percentage}%</div>
          <p className="text-muted-foreground">
            Правильных ответов: {score} из {activeQuiz.questions.length}
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={exitQuiz}>К списку квизов</Button>
            <Button onClick={resetQuiz}><RotateCcw className="h-4 w-4 mr-1" /> Пройти заново</Button>
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
          <h2 className="font-semibold">{activeQuiz.title}</h2>
          <Button variant="ghost" size="sm" onClick={exitQuiz}>Выйти</Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Вопрос {currentQ + 1} из {activeQuiz.questions.length}</span>
            <span>Счёт: {score}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {question.options.map((option, i) => {
              let variant = 'outline' as 'outline' | 'default' | 'destructive';
              let icon = null;
              if (answered) {
                if (i === question.correctIndex) {
                  variant = 'default';
                  icon = <CheckCircle2 className="h-4 w-4 shrink-0" />;
                } else if (i === selected) {
                  variant = 'destructive';
                  icon = <XCircle className="h-4 w-4 shrink-0" />;
                }
              }
              return (
                <Button
                  key={i}
                  variant={variant}
                  className="w-full justify-start text-left h-auto py-3 px-4"
                  onClick={() => handleAnswer(i)}
                  disabled={answered && i !== selected && i !== question.correctIndex}
                >
                  {icon}
                  <span className="ml-1">{option}</span>
                </Button>
              );
            })}

            {answered && (
              <div className="mt-4 p-3 rounded-lg bg-secondary text-sm text-muted-foreground">
                {question.explanation}
              </div>
            )}

            {answered && (
              <div className="flex justify-end mt-4">
                <Button onClick={handleNext}>
                  {currentQ + 1 >= activeQuiz.questions.length ? 'Результаты' : 'Следующий вопрос'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
