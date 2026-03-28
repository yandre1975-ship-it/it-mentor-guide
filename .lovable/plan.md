

# IT-Библиотека: справочник терминов и процессов

## Overview
An interactive IT encyclopedia in Russian for beginners, with term definitions, process diagrams, quizzes, and personal features (favorites, notes). Built frontend-first with hardcoded data; Supabase to be added later.

## Pages & Navigation

### 1. Main Layout
- **Header**: Logo, search bar, dark/light theme toggle, navigation links
- **Sidebar** (desktop) / **Bottom nav** (mobile): Categories, Processes, Quizzes, Favorites
- Russian UI throughout, English in code examples

### 2. Home Page (Каталог терминов)
- Alphabetical grid/list of IT terms (30 terms to start)
- Filter chips: by category (Языки программирования, Базы данных, Сетевые технологии, DevOps, Основы)
- Filter by difficulty: Для новичков / Средний / Продвинутый
- Real-time search by keywords

### 3. Term Detail Page
- Clear definition (1-3 sentences)
- Life analogy section with icon
- Code example with syntax highlighting (using a simple `<pre>` with styled code blocks)
- Related terms as clickable links
- YouTube video embed (if available)
- ⭐ Add to Favorites button (localStorage for now)
- 📝 Personal notes textarea (localStorage for now)

### 4. Interactive Process Diagrams Page
- List of 5 IT processes with cards
- Each process opens a detail view with:
  - Mermaid.js rendered flowchart/diagram
  - Step-by-step description below the diagram
  - Animated highlighting on hover/click

**5 processes:**
1. Как браузер загружает веб-страницу (DNS → TCP → HTTP → рендеринг)
2. Жизненный цикл баг-репорта
3. Git-workflow (fork → clone → commit → push → PR)
4. Сборка проекта (код → зависимости → компиляция → тесты → артефакт)
5. Развёртывание в облаке (CI/CD pipeline)

### 5. Quiz Page
- List of 10 quizzes grouped by topic
- Each quiz: 3-5 multiple choice questions
- Show correct/incorrect feedback after each answer
- Score counter and simple progress indicator
- Results summary at the end

### 6. Favorites Page
- List of bookmarked terms (stored in localStorage)
- Quick access to notes
- "Print-friendly view" button that opens a clean printable page of selected terms for browser Save-as-PDF

## Content (30 terms across 5 categories)

**Основы (8):** Алгоритм, Переменная, Функция, Цикл, Объект, Синтаксис, Компиляция, Дебаггинг

**Веб-технологии (7):** API, Веб-сервер, HTTP, DNS, Кэш, Фреймворк, Хостинг

**Разработка (7):** Баг, Деплой, Коммит, Репозиторий, IDE, Юнит-тест, Тестирование

**Базы данных (4):** SQL, NoSQL, Индекс, Миграция

**Архитектура (4):** Микросервис, Стек, Паттерн, Модуль

## Design
- Minimal, clean design with strong typography
- Light/dark theme toggle (CSS variables)
- Responsive: desktop sidebar → mobile bottom nav
- Code blocks with monospace font and subtle background
- Cards with hover effects for term browsing
- Color-coded difficulty badges (green/yellow/red)

## Data Structure (hardcoded TypeScript)
All data stored as typed arrays in `src/data/` files:
- `terms.ts` — 30 term objects
- `processes.ts` — 5 process objects with Mermaid diagram code
- `quizzes.ts` — 10 quiz objects with questions/answers

## Key Libraries
- `mermaid` — for rendering process diagrams
- React Router — for page navigation
- localStorage — for favorites, notes, and theme preference

