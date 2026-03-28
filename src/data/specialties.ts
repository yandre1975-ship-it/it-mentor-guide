export interface Specialty {
  id: string;
  title: string;
  description: string;
  skills: string[];
  tools: string[];
  salaryRange: string;
  demand: 'high' | 'medium' | 'growing';
  relatedTermIds: string[];
}

export const demandLabels: Record<Specialty['demand'], string> = {
  high: 'Высокий спрос',
  medium: 'Стабильный спрос',
  growing: 'Растущий спрос',
};

export const demandColors: Record<Specialty['demand'], string> = {
  high: 'bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]',
  medium: 'bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]',
  growing: 'bg-primary text-primary-foreground',
};

export const specialties: Specialty[] = [
  {
    id: 'frontend-developer',
    title: 'Frontend-разработчик',
    description: 'Создаёт визуальную часть веб-приложений — то, что видит и с чем взаимодействует пользователь. Верстает интерфейсы, реализует анимации и интерактивность.',
    skills: ['HTML/CSS', 'JavaScript/TypeScript', 'React/Vue/Angular', 'Адаптивная вёрстка', 'Работа с API', 'Git'],
    tools: ['VS Code', 'Chrome DevTools', 'Figma', 'Webpack/Vite', 'npm/yarn'],
    salaryRange: '80 000 – 350 000 ₽',
    demand: 'high',
    relatedTermIds: ['framework', 'http', 'api', 'cache'],
  },
  {
    id: 'backend-developer',
    title: 'Backend-разработчик',
    description: 'Разрабатывает серверную часть приложений: API, бизнес-логику, работу с базами данных и интеграции с внешними сервисами.',
    skills: ['Python/Java/Go/Node.js', 'REST API / GraphQL', 'SQL и NoSQL базы', 'Аутентификация', 'Архитектура приложений', 'Docker'],
    tools: ['IntelliJ IDEA / VS Code', 'Postman', 'Docker', 'PostgreSQL/MongoDB', 'Redis'],
    salaryRange: '100 000 – 400 000 ₽',
    demand: 'high',
    relatedTermIds: ['api', 'sql', 'web-server', 'microservice'],
  },
  {
    id: 'fullstack-developer',
    title: 'Fullstack-разработчик',
    description: 'Универсальный разработчик, владеющий как фронтендом, так и бэкендом. Может создать приложение целиком — от интерфейса до серверной логики.',
    skills: ['Frontend + Backend стек', 'Базы данных', 'DevOps основы', 'Проектирование API', 'Системное мышление'],
    tools: ['VS Code', 'Docker', 'Git', 'CI/CD', 'Облачные платформы'],
    salaryRange: '120 000 – 450 000 ₽',
    demand: 'high',
    relatedTermIds: ['framework', 'api', 'deploy', 'stack'],
  },
  {
    id: 'devops-engineer',
    title: 'DevOps-инженер',
    description: 'Обеспечивает непрерывную интеграцию и доставку кода. Автоматизирует сборку, тестирование и деплой, управляет инфраструктурой.',
    skills: ['Linux', 'CI/CD', 'Контейнеризация', 'Оркестрация (Kubernetes)', 'Мониторинг', 'IaC (Terraform)'],
    tools: ['Docker', 'Kubernetes', 'Jenkins/GitHub Actions', 'Terraform', 'Prometheus/Grafana'],
    salaryRange: '130 000 – 450 000 ₽',
    demand: 'high',
    relatedTermIds: ['deploy', 'commit', 'hosting'],
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    description: 'Анализирует данные и строит модели машинного обучения для решения бизнес-задач: прогнозирование, рекомендации, классификация.',
    skills: ['Python', 'Статистика и мат. анализ', 'Machine Learning', 'SQL', 'Визуализация данных', 'A/B тестирование'],
    tools: ['Jupyter Notebook', 'scikit-learn', 'TensorFlow/PyTorch', 'Pandas/NumPy', 'Tableau/Power BI'],
    salaryRange: '120 000 – 400 000 ₽',
    demand: 'growing',
    relatedTermIds: ['ml', 'dataset', 'neural-network', 'data-preprocessing'],
  },
  {
    id: 'ml-engineer',
    title: 'ML-инженер',
    description: 'Разрабатывает и внедряет модели машинного обучения в продакшн. Оптимизирует производительность моделей и строит ML-пайплайны.',
    skills: ['Python', 'Deep Learning', 'MLOps', 'Оптимизация моделей', 'Работа с GPU', 'Продуктовое мышление'],
    tools: ['PyTorch/TensorFlow', 'MLflow', 'Docker', 'Kubeflow', 'AWS SageMaker'],
    salaryRange: '150 000 – 500 000 ₽',
    demand: 'growing',
    relatedTermIds: ['neural-network', 'deep-learning', 'ml', 'gradient-descent'],
  },
  {
    id: 'qa-engineer',
    title: 'QA-инженер (тестировщик)',
    description: 'Обеспечивает качество ПО: находит баги, пишет тест-кейсы, автоматизирует тестирование и следит за стабильностью продукта.',
    skills: ['Тест-дизайн', 'Автоматизация тестов', 'SQL', 'API-тестирование', 'Баг-трекинг', 'CI/CD'],
    tools: ['Selenium/Playwright', 'Postman', 'Jira', 'TestRail', 'JUnit/pytest'],
    salaryRange: '60 000 – 250 000 ₽',
    demand: 'high',
    relatedTermIds: ['bug', 'testing', 'unit-test', 'debugging'],
  },
  {
    id: 'mobile-developer',
    title: 'Мобильный разработчик',
    description: 'Создаёт приложения для iOS и Android. Может специализироваться на нативной разработке или кроссплатформенных фреймворках.',
    skills: ['Swift/Kotlin', 'React Native / Flutter', 'Мобильный UI/UX', 'Работа с API', 'Push-уведомления', 'Публикация в Store'],
    tools: ['Xcode / Android Studio', 'Figma', 'Firebase', 'Charles Proxy', 'Fastlane'],
    salaryRange: '100 000 – 400 000 ₽',
    demand: 'high',
    relatedTermIds: ['framework', 'api', 'object', 'pattern'],
  },
  {
    id: 'security-engineer',
    title: 'Специалист по кибербезопасности',
    description: 'Защищает системы от взломов и утечек данных. Проводит аудит безопасности, тестирование на проникновение и разрабатывает политики защиты.',
    skills: ['Сетевая безопасность', 'Пентестинг', 'Криптография', 'Безопасность веб-приложений', 'SIEM-системы', 'Реагирование на инциденты'],
    tools: ['Burp Suite', 'Wireshark', 'Metasploit', 'Nmap', 'OWASP ZAP'],
    salaryRange: '120 000 – 400 000 ₽',
    demand: 'growing',
    relatedTermIds: ['http', 'dns', 'web-server', 'api'],
  },
  {
    id: 'system-analyst',
    title: 'Системный аналитик',
    description: 'Связующее звено между бизнесом и разработкой. Анализирует требования, проектирует архитектуру решений и пишет техническую документацию.',
    skills: ['Анализ требований', 'UML/BPMN', 'SQL', 'Проектирование API', 'Техническое письмо', 'Системное мышление'],
    tools: ['Confluence', 'Draw.io', 'Swagger', 'Jira', 'PlantUML'],
    salaryRange: '100 000 – 350 000 ₽',
    demand: 'medium',
    relatedTermIds: ['api', 'sql', 'microservice', 'pattern'],
  },
];