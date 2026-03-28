export type FeatureComplexity = 'simple' | 'medium' | 'complex';
export type FeatureCategory = 'auth' | 'payments' | 'communication' | 'data' | 'ui' | 'infra' | 'ai';

export interface Feature {
  id: string;
  title: string;
  description: string;
  category: FeatureCategory;
  complexity: FeatureComplexity;
  relatedTermIds: string[];
  specialistIds: string[];
  tools: string[];
  howItWorks: string;
  diagramCode: string;
}

export const featureCategoryLabels: Record<FeatureCategory, string> = {
  auth: 'Авторизация',
  payments: 'Платежи',
  communication: 'Коммуникация',
  data: 'Данные',
  ui: 'Интерфейс',
  infra: 'Инфраструктура',
  ai: 'ИИ',
};

export const featureComplexityLabels: Record<FeatureComplexity, string> = {
  simple: 'Простая',
  medium: 'Средняя',
  complex: 'Сложная',
};

export const featureComplexityColors: Record<FeatureComplexity, string> = {
  simple: 'bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]',
  medium: 'bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]',
  complex: 'bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))]',
};

export const features: Feature[] = [
  {
    id: 'auth-email',
    title: 'Авторизация по email/паролю',
    description: 'Регистрация и вход пользователя через email и пароль с хешированием, JWT-токенами и сессиями.',
    category: 'auth',
    complexity: 'medium',
    relatedTermIds: ['api', 'rest-api', 'database'],
    specialistIds: ['backend-developer', 'frontend-developer'],
    tools: ['Firebase Auth', 'Supabase Auth', 'Passport.js', 'bcrypt', 'JWT'],
    howItWorks: 'Пользователь вводит email и пароль → сервер хеширует пароль (bcrypt) → сохраняет в БД → при входе сверяет хеши → выдаёт JWT-токен → клиент сохраняет токен и отправляет с каждым запросом.',
  },
  {
    id: 'auth-oauth',
    title: 'Вход через соцсети (OAuth)',
    description: 'Авторизация через Google, GitHub, Apple и другие провайдеры по протоколу OAuth 2.0.',
    category: 'auth',
    complexity: 'medium',
    relatedTermIds: ['api', 'rest-api'],
    specialistIds: ['backend-developer', 'frontend-developer'],
    tools: ['OAuth 2.0', 'Google Identity', 'NextAuth.js', 'Passport.js'],
    howItWorks: 'Клиент перенаправляет на страницу провайдера → пользователь даёт согласие → провайдер возвращает authorization code → сервер обменивает code на access token → получает профиль пользователя.',
  },
  {
    id: 'payments-stripe',
    title: 'Приём платежей',
    description: 'Интеграция платёжной системы для приёма оплаты картами, подписок и возвратов.',
    category: 'payments',
    complexity: 'complex',
    relatedTermIds: ['api', 'rest-api', 'database'],
    specialistIds: ['backend-developer', 'frontend-developer'],
    tools: ['Stripe', 'PayPal', 'YooKassa', 'Webhooks'],
    howItWorks: 'Клиент создаёт PaymentIntent через API → пользователь вводит данные карты → платёжная система обрабатывает транзакцию → webhook уведомляет сервер о результате → обновляется статус заказа.',
  },
  {
    id: 'push-notifications',
    title: 'Push-уведомления',
    description: 'Отправка уведомлений пользователям на мобильные устройства и в браузер даже при закрытом приложении.',
    category: 'communication',
    complexity: 'medium',
    relatedTermIds: ['api', 'rest-api'],
    specialistIds: ['backend-developer', 'mobile-developer'],
    tools: ['Firebase Cloud Messaging', 'Apple Push Notification', 'OneSignal', 'Service Workers'],
    howItWorks: 'Приложение запрашивает разрешение → получает device token → сервер сохраняет token → при событии отправляет payload через FCM/APNs → устройство показывает уведомление.',
  },
  {
    id: 'realtime-chat',
    title: 'Чат в реальном времени',
    description: 'Мгновенный обмен сообщениями между пользователями с индикаторами набора, прочтения и онлайн-статуса.',
    category: 'communication',
    complexity: 'complex',
    relatedTermIds: ['api', 'database'],
    specialistIds: ['backend-developer', 'frontend-developer'],
    tools: ['WebSocket', 'Socket.IO', 'Supabase Realtime', 'Redis Pub/Sub'],
    howItWorks: 'Клиент устанавливает WebSocket-соединение → при отправке сообщения оно транслируется через сервер всем участникам → сообщения сохраняются в БД → при переподключении загружается история.',
  },
  {
    id: 'file-upload',
    title: 'Загрузка файлов',
    description: 'Загрузка изображений, документов и других файлов с валидацией, превью и хранением в облаке.',
    category: 'data',
    complexity: 'medium',
    relatedTermIds: ['api', 'rest-api'],
    specialistIds: ['backend-developer', 'frontend-developer'],
    tools: ['AWS S3', 'Cloudinary', 'Supabase Storage', 'Multer', 'presigned URLs'],
    howItWorks: 'Клиент выбирает файл → валидация типа и размера → получение presigned URL → прямая загрузка в S3/хранилище → сохранение метаданных в БД → отображение файла по CDN-ссылке.',
  },
  {
    id: 'search-fulltext',
    title: 'Полнотекстовый поиск',
    description: 'Мгновенный поиск по контенту с учётом морфологии, опечаток и ранжированием по релевантности.',
    category: 'data',
    complexity: 'complex',
    relatedTermIds: ['database', 'algorithm'],
    specialistIds: ['backend-developer', 'data-engineer'],
    tools: ['Elasticsearch', 'Algolia', 'MeiliSearch', 'PostgreSQL tsvector'],
    howItWorks: 'Данные индексируются в поисковом движке → при запросе текст токенизируется и нормализуется → движок ищет по инвертированному индексу → результаты ранжируются по TF-IDF/BM25 → возвращается топ совпадений.',
  },
  {
    id: 'dark-mode',
    title: 'Тёмная тема',
    description: 'Переключение между светлой и тёмной цветовой схемой с сохранением предпочтений пользователя.',
    category: 'ui',
    complexity: 'simple',
    relatedTermIds: ['css', 'dom'],
    specialistIds: ['frontend-developer'],
    tools: ['CSS Variables', 'Tailwind dark:', 'next-themes', 'localStorage'],
    howItWorks: 'CSS-переменные определяют палитру → при переключении меняется data-атрибут на <html> → Tailwind/CSS перезаписывает цвета → предпочтение сохраняется в localStorage → при загрузке читается сохранённое значение.',
  },
  {
    id: 'infinite-scroll',
    title: 'Бесконечная прокрутка',
    description: 'Автоматическая подгрузка контента при скролле вниз вместо постраничной навигации.',
    category: 'ui',
    complexity: 'medium',
    relatedTermIds: ['api', 'rest-api', 'dom'],
    specialistIds: ['frontend-developer', 'backend-developer'],
    tools: ['Intersection Observer', 'React Query', 'Cursor Pagination', 'Virtual Lists'],
    howItWorks: 'Intersection Observer отслеживает видимость «сторожевого» элемента → при попадании в viewport запрашивается следующая страница → API возвращает данные с cursor → новые элементы добавляются к списку.',
  },
  {
    id: 'ci-cd',
    title: 'CI/CD пайплайн',
    description: 'Автоматизация сборки, тестирования и деплоя кода при каждом коммите или мерж-реквесте.',
    category: 'infra',
    complexity: 'complex',
    relatedTermIds: ['git', 'docker', 'testing'],
    specialistIds: ['devops-engineer', 'backend-developer'],
    tools: ['GitHub Actions', 'GitLab CI', 'Jenkins', 'Docker', 'Kubernetes'],
    howItWorks: 'Push в репозиторий → CI запускает линтеры и тесты → при успехе собирается Docker-образ → образ пушится в registry → CD деплоит на staging → после ревью деплой на production.',
  },
  {
    id: 'caching',
    title: 'Кеширование',
    description: 'Сохранение часто запрашиваемых данных в быстрой памяти для ускорения ответов и снижения нагрузки.',
    category: 'infra',
    complexity: 'medium',
    relatedTermIds: ['api', 'database'],
    specialistIds: ['backend-developer', 'devops-engineer'],
    tools: ['Redis', 'Memcached', 'CDN', 'HTTP Cache-Control', 'React Query'],
    howItWorks: 'Запрос приходит → проверяется наличие в кеше (cache hit) → если есть — возвращается мгновенно → если нет — запрос к БД → результат сохраняется в кеш с TTL → при изменении данных кеш инвалидируется.',
  },
  {
    id: 'ai-chatbot',
    title: 'AI-чатбот',
    description: 'Интеграция языковой модели (LLM) для ответов на вопросы пользователей в интерфейсе чата.',
    category: 'ai',
    complexity: 'complex',
    relatedTermIds: ['nlp', 'transformer', 'api'],
    specialistIds: ['ml-engineer', 'backend-developer', 'frontend-developer'],
    tools: ['OpenAI API', 'LangChain', 'Vercel AI SDK', 'Streaming SSE'],
    howItWorks: 'Пользователь вводит сообщение → формируется промпт с контекстом → запрос к LLM API → модель генерирует ответ токен за токеном → streaming через SSE отображает ответ в реальном времени.',
  },
  {
    id: 'image-recognition',
    title: 'Распознавание изображений',
    description: 'Классификация, детекция объектов или OCR на загруженных пользователем изображениях.',
    category: 'ai',
    complexity: 'complex',
    relatedTermIds: ['neural-network', 'machine-learning'],
    specialistIds: ['ml-engineer', 'data-scientist'],
    tools: ['TensorFlow', 'PyTorch', 'YOLO', 'Google Vision API', 'Tesseract OCR'],
    howItWorks: 'Пользователь загружает изображение → предобработка (ресайз, нормализация) → прогон через CNN-модель → модель выдаёт предсказание (класс, bounding box, текст) → результат возвращается клиенту.',
  },
  {
    id: 'email-sending',
    title: 'Отправка email',
    description: 'Транзакционные и маркетинговые письма: подтверждение регистрации, сброс пароля, рассылки.',
    category: 'communication',
    complexity: 'simple',
    relatedTermIds: ['api'],
    specialistIds: ['backend-developer'],
    tools: ['SendGrid', 'Resend', 'Postmark', 'Nodemailer', 'MJML'],
    howItWorks: 'Событие триггерит отправку (регистрация, покупка) → сервер формирует HTML из шаблона → отправляет через SMTP/API провайдера → провайдер доставляет письмо → webhook сообщает о доставке/открытии.',
  },
  {
    id: 'analytics',
    title: 'Аналитика и метрики',
    description: 'Сбор данных о поведении пользователей: просмотры, клики, воронки, конверсии.',
    category: 'data',
    complexity: 'medium',
    relatedTermIds: ['api', 'database'],
    specialistIds: ['frontend-developer', 'data-analyst'],
    tools: ['Google Analytics', 'Mixpanel', 'PostHog', 'Amplitude', 'Segment'],
    howItWorks: 'SDK встраивается в клиент → при действии пользователя отправляется событие (track) → события накапливаются в хранилище → строятся дашборды с метриками → анализируются воронки и ретеншн.',
  },
];
