import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { careerQuestions, calculateCareer } from '@/data/careerQuiz';
import { specialties } from '@/data/specialties';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, RotateCcw, ArrowRight, TrendingUp } from 'lucide-react';

export default function CareerQuiz() {
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);

  const question = careerQuestions[current];
  const progress = ((current) / careerQuestions.length) * 100;

  const handleAnswer = (optionScores: Record<string, number>) => {
    const newScores = { ...scores };
    Object.entries(optionScores).forEach(([key, val]) => {
      newScores[key] = (newScores[key] || 0) + val;
    });
    setScores(newScores);

    if (current + 1 >= careerQuestions.length) {
      setFinished(true);
    } else {
      setCurrent(current + 1);
    }
  };

  const reset = () => {
    setCurrent(0);
    setScores({});
    setFinished(false);
  };

  const topResults = finished ? calculateCareer(scores) : [];

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Какая специальность вам подходит?</h1>
          <p className="text-muted-foreground mt-1">Пройдите короткий тест из {careerQuestions.length} вопросов</p>
        </div>

        {!finished ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Вопрос {current + 1} из {careerQuestions.length}</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg leading-relaxed">{question.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {question.options.map((opt, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 px-4 whitespace-normal"
                    onClick={() => handleAnswer(opt.scores)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Briefcase className="h-12 w-12 mx-auto text-primary" />
              <h2 className="text-2xl font-bold">Ваши топ-3 специальности</h2>
              <p className="text-muted-foreground">На основе ваших ответов мы подобрали наиболее подходящие направления</p>
            </div>

            <div className="space-y-4">
              {topResults.map((result, idx) => {
                const spec = specialties.find((s) => s.id === result.id);
                if (!spec) return null;
                return (
                  <Card key={result.id} className={idx === 0 ? 'border-primary/40 bg-primary/5' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
                            <CardTitle>{spec.title}</CardTitle>
                          </div>
                          <CardDescription>{spec.description}</CardDescription>
                        </div>
                        <Badge variant="outline" className="shrink-0">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {spec.salaryRange}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-1.5">
                        {spec.skills.slice(0, 5).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                        ))}
                      </div>
                      <Link to="/specialties">
                        <Button size="sm" variant="outline" className="gap-1">
                          Подробнее о профессии <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={reset}>
                <RotateCcw className="h-4 w-4 mr-1" /> Пройти снова
              </Button>
              <Link to="/">
                <Button>К терминам</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
