export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type Category =
  | 'basics'
  | 'web'
  | 'development'
  | 'databases'
  | 'architecture'
  | 'ai'
  | 'specialties';

export const categoryLabels: Record<Category, string> = {
  basics: 'Основы',
  web: 'Веб-технологии',
  development: 'Разработка',
  databases: 'Базы данных',
  architecture: 'Архитектура',
  ai: 'Искусственный интеллект',
  specialties: 'IT-специальности',
};

export const difficultyLabels: Record<Difficulty, string> = {
  beginner: 'Junior',
  intermediate: 'Middle',
  advanced: 'Senior',
};

export const difficultyColors: Record<Difficulty, string> = {
  beginner: 'bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]',
  intermediate: 'bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]',
  advanced: 'bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))]',
};

export interface Term {
  id: string;
  title: string;
  definition: string;
  analogy: string;
  exampleCode: string;
  exampleLanguage: string;
  category: Category;
  difficulty: Difficulty;
  relatedTerms: string[];
  videoUrl?: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface Process {
  id: string;
  title: string;
  description: string;
  diagramCode: string;
  steps: ProcessStep[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  relatedTermId?: string;
  relatedProcessId?: string;
  questions: QuizQuestion[];
}
