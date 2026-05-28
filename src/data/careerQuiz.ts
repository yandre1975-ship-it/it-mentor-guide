export interface CareerQuestion {
  id: string;
  question: string;
  options: { label: string; scores: Record<string, number> }[];
}

export const careerQuestions: CareerQuestion[] = [
  {
    id: 'q1',
    question: 'Что вам ближе: видеть результат своей работы на экране или разбираться в логике «под капотом»?',
    options: [
      { label: 'Видеть красивый интерфейс на экране', scores: { 'frontend-developer': 3, 'ui-ux-designer': 2, 'graphic-designer': 1 } },
      { label: 'Разбираться в логике и алгоритмах', scores: { 'backend-developer': 3, 'devops-engineer': 2, 'ml-engineer': 1 } },
      { label: 'И то, и другое', scores: { 'fullstack-developer': 3, 'product-manager': 1 } },
    ],
  },
  {
    id: 'q2',
    question: 'Какую задачу вы бы выбрали?',
    options: [
      { label: 'Найти и описать, почему программа падает', scores: { 'qa-engineer': 3, 'backend-developer': 2 } },
      { label: 'Нарисовать удобный интерфейс для приложения', scores: { 'ui-ux-designer': 3, 'frontend-developer': 2 } },
      { label: 'Настроить сервера так, чтобы всё работало быстро', scores: { 'devops-engineer': 3, 'backend-developer': 1 } },
      { label: 'Научить компьютер распознавать картинки', scores: { 'data-scientist': 3, 'ml-engineer': 2 } },
    ],
  },
  {
    id: 'q3',
    question: 'Вам важнее:',
    options: [
      { label: 'Общаться с людьми и организовывать процессы', scores: { 'product-manager': 3, 'project-manager': 3, 'scrum-master': 2 } },
      { label: 'Писать код и решать технические задачи', scores: { 'backend-developer': 3, 'frontend-developer': 3, 'mobile-developer': 2 } },
      { label: 'Анализировать данные и находить закономерности', scores: { 'data-scientist': 3, 'system-analyst': 2, 'product-designer': 1 } },
      { label: 'Защищать системы от взломов', scores: { 'security-engineer': 3, 'devops-engineer': 1 } },
    ],
  },
  {
    id: 'q4',
    question: 'Что из этого вам интереснее всего?',
    options: [
      { label: 'Создавать мобильные приложения', scores: { 'mobile-developer': 3, 'frontend-developer': 1 } },
      { label: 'Рисовать иллюстрации и баннеры', scores: { 'graphic-designer': 3, 'ui-ux-designer': 2 } },
      { label: 'Руководить командой и принимать архитектурные решения', scores: { 'tech-lead': 3, 'product-manager': 1 } },
      { label: 'Автоматизировать рутину и настраивать CI/CD', scores: { 'devops-engineer': 3, 'qa-engineer': 1 } },
    ],
  },
  {
    id: 'q5',
    question: 'Какой ваш текущий уровень в программировании?',
    options: [
      { label: 'Никогда не программировал', scores: { 'ui-ux-designer': 2, 'product-manager': 2, 'project-manager': 2, 'graphic-designer': 2 } },
      { label: 'Пробовал немного, но пока сложно', scores: { 'qa-engineer': 2, 'frontend-developer': 1, 'system-analyst': 2 } },
      { label: 'Уверенно пишу код на одном языке', scores: { 'backend-developer': 2, 'frontend-developer': 2, 'mobile-developer': 2 } },
      { label: 'Знаю несколько языков и технологий', scores: { 'fullstack-developer': 3, 'devops-engineer': 2, 'tech-lead': 2 } },
    ],
  },
];

export function calculateCareer(scores: Record<string, number>) {
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id, score]) => ({ id, score }));
}
