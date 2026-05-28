import type { LucideIcon } from 'lucide-react';
import {
  Lightbulb, Pencil, Code, TestTube, Rocket,
  FileText, Smartphone, ShoppingCart, Cloud, BrainCircuit, BarChart3
} from 'lucide-react';

export interface RoadmapStage {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  steps: string[];
  questions: string[];
  prototypeIds: string[];
}

export const roadmapStages: RoadmapStage[] = [
  {
    id: 'idea',
    title: 'Идея и планирование',
    subtitle: 'От концепции до ТЗ',
    icon: Lightbulb,
    color: 'text-amber-600',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    steps: [
      'Определить проблему, которую решает продукт',
      'Изучить целевую аудиторию',
      'Проанализировать конкурентов',
      'Сформулировать ценностное предложение (UVP)',
      'Составить User Stories',
      'Определить MVP — минимальный viable продукт',
      'Выбрать бизнес-модель',
    ],
    questions: [
      'Как проверить идею перед разработкой?',
      'Что такое MVP и как его определить?',
      'Как составить техническое задание?',
      'Какие методы анализа конкурентов существуют?',
    ],
    prototypeIds: [],
  },
  {
    id: 'design',
    title: 'Дизайн и прототип',
    subtitle: 'UX/UI, макеты, схемы',
    icon: Pencil,
    color: 'text-violet-600',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
    steps: [
      'Создать User Flow — путь пользователя',
      'Нарисовать wireframes (низкая детализация)',
      'Разработать UI-kit (цвета, шрифты, компоненты)',
      'Сделать интерактивный прототип в Figma',
      'Провести юзабилити-тестирование',
      'Подготовить адаптивные макеты',
      'Согласовать дизайн с заказчиком',
    ],
    questions: [
      'Чем отличается UX от UI?',
      'Какие инструменты для прототипирования лучше?',
      'Что такое User Flow и зачем он нужен?',
      'Как провести юзабилити-тест?',
    ],
    prototypeIds: ['landing'],
  },
  {
    id: 'development',
    title: 'Разработка',
    subtitle: 'Frontend, Backend, API',
    icon: Code,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    steps: [
      'Настроить репозиторий и CI/CD',
      'Выбрать архитектуру (монолит / микросервисы)',
      'Разработать базу данных и API',
      'Сверстать frontend по макетам',
      'Интегрировать frontend с backend',
      'Настроить аутентификацию и авторизацию',
      'Реализовать основной функционал',
    ],
    questions: [
      'Как выбрать стек технологий?',
      'Что лучше: монолит или микросервисы?',
      'Как спроектировать REST API?',
      'Как настроить CI/CD для новичка?',
    ],
    prototypeIds: ['mobile-app', 'ecommerce', 'saas'],
  },
  {
    id: 'testing',
    title: 'Тестирование',
    subtitle: 'QA, баги, правки',
    icon: TestTube,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    steps: [
      'Написать unit-тесты для критичных модулей',
      'Провести интеграционное тестирование',
      'Проверить кроссбраузерность',
      'Тестировать на реальных устройствах',
      'Провести нагрузочное тестирование',
      'Проверить безопасность (OWASP Top 10)',
      'Собрать фидбек от бета-тестеров',
    ],
    questions: [
      'Какие виды тестирования существуют?',
      'Что такое unit-тесты и зачем они?',
      'Как провести нагрузочное тестирование?',
      'Что такое OWASP Top 10?',
    ],
    prototypeIds: [],
  },
  {
    id: 'deploy',
    title: 'Деплой и запуск',
    subtitle: 'Сервер, домен, мониторинг',
    icon: Rocket,
    color: 'text-red-600',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    steps: [
      'Выбрать хостинг / облачный провайдер',
      'Настроить домен и SSL-сертификат',
      'Развернуть приложение (Docker / Kubernetes)',
      'Настроить мониторинг и алерты',
      'Настроить бэкапы БД',
      'Подключить аналитику (Google Analytics / Amplitude)',
      'Подготовить план отката (rollback)',
    ],
    questions: [
      'Где лучше деплоить первый проект?',
      'Что такое Docker и зачем он нужен?',
      'Как настроить SSL и HTTPS?',
      'Какие метрики нужно отслеживать?',
    ],
    prototypeIds: ['ml-platform', 'ai-assistant'],
  },
];

export interface ProjectType {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prototypeId: string;
}

export const projectTypes: ProjectType[] = [
  {
    id: 'landing',
    title: 'Лендинг',
    description: 'Одностраничный сайт для продукта или услуги',
    icon: FileText,
    difficulty: 'beginner',
    prototypeId: 'landing',
  },
  {
    id: 'mobile',
    title: 'Мобильное приложение',
    description: 'iOS/Android приложение с авторизацией и лентой',
    icon: Smartphone,
    difficulty: 'intermediate',
    prototypeId: 'mobile-app',
  },
  {
    id: 'ecommerce',
    title: 'Интернет-магазин',
    description: 'Каталог, корзина, оплата, админка',
    icon: ShoppingCart,
    difficulty: 'advanced',
    prototypeId: 'ecommerce',
  },
  {
    id: 'saas',
    title: 'SaaS-платформа',
    description: 'B2B-сервис с подпиской и мультитенантностью',
    icon: Cloud,
    difficulty: 'advanced',
    prototypeId: 'saas',
  },
  {
    id: 'ai',
    title: 'AI-ассистент',
    description: 'Чат-бот на базе LLM с RAG и памятью',
    icon: BrainCircuit,
    difficulty: 'advanced',
    prototypeId: 'ai-assistant',
  },
  {
    id: 'ml',
    title: 'ML-платформа',
    description: 'Сервис с моделями машинного обучения',
    icon: BarChart3,
    difficulty: 'advanced',
    prototypeId: 'ml-platform',
  },
];
