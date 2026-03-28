import { Term } from './types';

export const terms: Term[] = [
  // === ОСНОВЫ (8) ===
  {
    id: 'algorithm',
    title: 'Алгоритм',
    definition: 'Последовательность чётко определённых шагов для решения задачи. Алгоритм принимает входные данные и выдаёт результат.',
    analogy: 'Рецепт приготовления блюда: шаг 1 — нарезать овощи, шаг 2 — разогреть сковороду, шаг 3 — обжарить. Следуя рецепту, вы всегда получаете одинаковый результат.',
    exampleCode: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

console.log(bubbleSort([5, 3, 8, 1, 2]));
// [1, 2, 3, 5, 8]`,
    exampleLanguage: 'javascript',
    category: 'basics',
    difficulty: 'beginner',
    relatedTerms: ['variable', 'function', 'loop'],
    videoUrl: 'https://www.youtube.com/watch?v=6hfOvs8pY1k',
  },
  {
    id: 'variable',
    title: 'Переменная',
    definition: 'Именованная область памяти для хранения данных. Значение переменной можно изменять в процессе выполнения программы.',
    analogy: 'Коробка с наклейкой: на наклейке написано имя (например, «возраст»), а внутри лежит значение (например, 25). Можно открыть коробку и заменить содержимое.',
    exampleCode: `let name = "Alice";
let age = 25;
const PI = 3.14159;

age = 26; // можно изменить
// PI = 3; // ошибка — const нельзя менять

console.log(\`\${name} is \${age}\`);`,
    exampleLanguage: 'javascript',
    category: 'basics',
    difficulty: 'beginner',
    relatedTerms: ['algorithm', 'function', 'object'],
  },
  {
    id: 'function',
    title: 'Функция',
    definition: 'Именованный блок кода, который выполняет определённую задачу. Функцию можно вызывать многократно с разными аргументами.',
    analogy: 'Кофемашина: вы нажимаете кнопку (вызываете функцию), выбираете напиток (передаёте аргумент), и машина выдаёт результат (возвращает кофе).',
    exampleCode: `function greet(name) {
  return \`Hello, \${name}!\`;
}

const add = (a, b) => a + b;

console.log(greet("World")); // Hello, World!
console.log(add(2, 3));      // 5`,
    exampleLanguage: 'javascript',
    category: 'basics',
    difficulty: 'beginner',
    relatedTerms: ['variable', 'algorithm', 'object'],
  },
  {
    id: 'loop',
    title: 'Цикл',
    definition: 'Конструкция, которая повторяет блок кода заданное количество раз или пока выполняется условие.',
    analogy: 'Стиральная машина: она повторяет цикл «намочить → постирать → отжать» определённое количество раз, пока бельё не станет чистым.',
    exampleCode: `// for loop
for (let i = 0; i < 5; i++) {
  console.log(\`Iteration \${i}\`);
}

// while loop
let count = 0;
while (count < 3) {
  console.log(\`Count: \${count}\`);
  count++;
}`,
    exampleLanguage: 'javascript',
    category: 'basics',
    difficulty: 'beginner',
    relatedTerms: ['algorithm', 'variable', 'function'],
  },
  {
    id: 'object',
    title: 'Объект',
    definition: 'Структура данных, объединяющая связанные свойства и методы. Объект описывает сущность с её характеристиками и поведением.',
    analogy: 'Паспорт человека: содержит свойства (имя, дата рождения, фото) и может использоваться для действий (подтверждение личности).',
    exampleCode: `const user = {
  name: "Alice",
  age: 25,
  greet() {
    return \`Hi, I'm \${this.name}\`;
  }
};

console.log(user.name);    // Alice
console.log(user.greet()); // Hi, I'm Alice`,
    exampleLanguage: 'javascript',
    category: 'basics',
    difficulty: 'beginner',
    relatedTerms: ['variable', 'function', 'pattern'],
  },
  {
    id: 'syntax',
    title: 'Синтаксис',
    definition: 'Набор правил, определяющих, как должен быть написан код на конкретном языке программирования, чтобы компьютер мог его понять.',
    analogy: 'Грамматика языка: так же как нельзя написать «я идти магазин», в программировании нужно соблюдать правила расстановки скобок, точек с запятой и ключевых слов.',
    exampleCode: `// Correct syntax
if (x > 0) {
  console.log("positive");
}

// Syntax error examples:
// if x > 0 {        — missing parentheses
// console.log("hi") — missing semicolon (optional in JS)`,
    exampleLanguage: 'javascript',
    category: 'basics',
    difficulty: 'beginner',
    relatedTerms: ['compilation', 'debugging'],
  },
  {
    id: 'compilation',
    title: 'Компиляция',
    definition: 'Процесс преобразования исходного кода, написанного программистом, в машинный код, понятный компьютеру. Выполняется до запуска программы.',
    analogy: 'Перевод книги: автор пишет на русском (исходный код), переводчик (компилятор) переводит на английский (машинный код), и затем иностранный читатель (процессор) может понять текст.',
    exampleCode: `// TypeScript (source) → JavaScript (compiled)

// Source (TypeScript):
const greet = (name: string): string => {
  return \`Hello, \${name}\`;
};

// Compiled (JavaScript):
const greet = (name) => {
  return \`Hello, \${name}\`;
};`,
    exampleLanguage: 'typescript',
    category: 'basics',
    difficulty: 'intermediate',
    relatedTerms: ['syntax', 'debugging', 'ide'],
  },
  {
    id: 'debugging',
    title: 'Дебаггинг',
    definition: 'Процесс поиска и исправления ошибок (багов) в программном коде. Включает анализ поведения программы и выявление причин некорректной работы.',
    analogy: 'Поиск протечки в трубах: вы проверяете каждый участок (строку кода), пока не найдёте место, откуда течёт вода (ошибку).',
    exampleCode: `// Using console.log for debugging
function divide(a, b) {
  console.log("a:", a, "b:", b); // debug
  if (b === 0) {
    throw new Error("Division by zero!");
  }
  return a / b;
}

// Using debugger keyword
function findBug(data) {
  debugger; // browser will pause here
  return data.filter(x => x > 0);
}`,
    exampleLanguage: 'javascript',
    category: 'basics',
    difficulty: 'beginner',
    relatedTerms: ['bug', 'ide', 'testing'],
  },

  // === ВЕБ-ТЕХНОЛОГИИ (7) ===
  {
    id: 'api',
    title: 'API',
    definition: 'Application Programming Interface — набор правил и протоколов для взаимодействия между программами. API определяет, какие запросы можно отправлять и какие ответы ожидать.',
    analogy: 'Меню в ресторане: вы (клиент) выбираете блюдо из меню (API), официант (запрос) передаёт заказ на кухню (сервер), и вам приносят готовое блюдо (ответ).',
    exampleCode: `// Fetching data from a REST API
const response = await fetch(
  "https://api.example.com/users"
);
const users = await response.json();

// POST request
await fetch("https://api.example.com/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Alice", age: 25 })
});`,
    exampleLanguage: 'javascript',
    category: 'web',
    difficulty: 'beginner',
    relatedTerms: ['http', 'web-server', 'framework'],
    videoUrl: 'https://www.youtube.com/watch?v=s7wmiS2mSXY',
  },
  {
    id: 'web-server',
    title: 'Веб-сервер',
    definition: 'Программа, которая принимает HTTP-запросы от клиентов (браузеров) и отправляет в ответ веб-страницы, файлы или данные.',
    analogy: 'Библиотекарь: вы приходите и просите книгу (запрос), библиотекарь (сервер) находит её на полке и выдаёт вам (ответ).',
    exampleCode: `// Simple Node.js web server
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/html"
  });
  res.end("<h1>Hello, World!</h1>");
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});`,
    exampleLanguage: 'javascript',
    category: 'web',
    difficulty: 'beginner',
    relatedTerms: ['api', 'http', 'hosting', 'dns'],
  },
  {
    id: 'http',
    title: 'HTTP',
    definition: 'HyperText Transfer Protocol — протокол передачи данных в вебе. Определяет формат запросов и ответов между клиентом и сервером.',
    analogy: 'Почтовая система: письмо (запрос) отправляется по определённым правилам (адрес, марка, формат), почта (сеть) доставляет его, и вы получаете ответ.',
    exampleCode: `// HTTP Request structure:
// GET /api/users HTTP/1.1
// Host: example.com
// Accept: application/json

// HTTP Response structure:
// HTTP/1.1 200 OK
// Content-Type: application/json
//
// [{"id": 1, "name": "Alice"}]

// Common HTTP methods:
// GET    — read data
// POST   — create data
// PUT    — update data
// DELETE — delete data`,
    exampleLanguage: 'http',
    category: 'web',
    difficulty: 'beginner',
    relatedTerms: ['api', 'web-server', 'dns'],
  },
  {
    id: 'dns',
    title: 'DNS',
    definition: 'Domain Name System — система, преобразующая доменные имена (google.com) в IP-адреса (142.250.74.46), по которым компьютеры находят друг друга в сети.',
    analogy: 'Телефонная книга: вы знаете имя человека (домен), а DNS находит его номер телефона (IP-адрес), чтобы вы могли позвонить (подключиться).',
    exampleCode: `// DNS lookup in Node.js
const dns = require("dns");

dns.lookup("google.com", (err, address) => {
  console.log("IP:", address);
  // IP: 142.250.74.46
});

// DNS record types:
// A     — IPv4 address
// AAAA  — IPv6 address
// CNAME — alias to another domain
// MX    — mail server`,
    exampleLanguage: 'javascript',
    category: 'web',
    difficulty: 'intermediate',
    relatedTerms: ['http', 'web-server', 'hosting'],
  },
  {
    id: 'cache',
    title: 'Кэш',
    definition: 'Временное хранилище данных для ускорения повторного доступа. Кэш хранит копии часто запрашиваемых данных ближе к потребителю.',
    analogy: 'Закладка в книге: вместо того чтобы каждый раз искать нужную страницу с начала, вы открываете книгу сразу на закладке.',
    exampleCode: `// Simple cache implementation
const cache = new Map();

function getCachedData(key, fetchFn) {
  if (cache.has(key)) {
    console.log("Cache hit!");
    return cache.get(key);
  }
  console.log("Cache miss, fetching...");
  const data = fetchFn();
  cache.set(key, data);
  return data;
}`,
    exampleLanguage: 'javascript',
    category: 'web',
    difficulty: 'intermediate',
    relatedTerms: ['http', 'web-server', 'sql'],
  },
  {
    id: 'framework',
    title: 'Фреймворк',
    definition: 'Программная платформа, предоставляющая готовую структуру и набор инструментов для разработки приложений. В отличие от библиотеки, фреймворк диктует архитектуру.',
    analogy: 'Конструктор IKEA: вам дают все детали и инструкцию (фреймворк), а вы собираете мебель (приложение) по заданной схеме.',
    exampleCode: `// React component (React framework)
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Express.js (Node.js framework)
const app = express();
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello!" });
});`,
    exampleLanguage: 'javascript',
    category: 'web',
    difficulty: 'beginner',
    relatedTerms: ['api', 'module', 'pattern'],
  },
  {
    id: 'hosting',
    title: 'Хостинг',
    definition: 'Услуга размещения веб-сайта или приложения на сервере, доступном через интернет. Хостинг обеспечивает хранение файлов и круглосуточную доступность.',
    analogy: 'Аренда офиса: ваш бизнес (сайт) нуждается в помещении (сервере), где клиенты (пользователи) смогут вас найти по адресу (доменному имени).',
    exampleCode: `// Deploying to a hosting platform
// Example: Netlify deployment config

// netlify.toml
// [build]
//   command = "npm run build"
//   publish = "dist"
//
// [[redirects]]
//   from = "/*"
//   to = "/index.html"
//   status = 200`,
    exampleLanguage: 'toml',
    category: 'web',
    difficulty: 'beginner',
    relatedTerms: ['web-server', 'dns', 'deploy'],
  },

  // === РАЗРАБОТКА (7) ===
  {
    id: 'bug',
    title: 'Баг',
    definition: 'Ошибка в программе, приводящая к неправильному или неожиданному поведению. Термин появился, когда настоящее насекомое (bug) замкнуло контакт в компьютере.',
    analogy: 'Опечатка в книге: текст напечатан, но в одном месте буква перепутана, и смысл предложения меняется.',
    exampleCode: `// Classic bug: off-by-one error
const arr = [1, 2, 3, 4, 5];

// Bug: i <= arr.length causes index out of bounds
for (let i = 0; i <= arr.length; i++) {
  console.log(arr[i]); // last: undefined!
}

// Fix: i < arr.length
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]); // correct
}`,
    exampleLanguage: 'javascript',
    category: 'development',
    difficulty: 'beginner',
    relatedTerms: ['debugging', 'testing', 'unit-test'],
  },
  {
    id: 'deploy',
    title: 'Деплой',
    definition: 'Процесс размещения приложения на сервере и обеспечение его доступности для пользователей. Включает сборку, тестирование и публикацию.',
    analogy: 'Открытие магазина: вы подготовили товар (код), оформили витрину (интерфейс), и теперь открываете двери для покупателей (пользователей).',
    exampleCode: `# Typical deployment commands

# Build the project
npm run build

# Deploy to production
git push origin main

# Docker deployment
docker build -t myapp .
docker push registry.example.com/myapp
docker-compose up -d`,
    exampleLanguage: 'bash',
    category: 'development',
    difficulty: 'intermediate',
    relatedTerms: ['commit', 'repository', 'hosting'],
  },
  {
    id: 'commit',
    title: 'Коммит',
    definition: 'Зафиксированное состояние кода в системе контроля версий (Git). Коммит содержит описание изменений и ссылку на предыдущее состояние.',
    analogy: 'Сохранение в видеоигре: вы делаете «сейв» (коммит), чтобы в случае ошибки можно было вернуться к этому моменту.',
    exampleCode: `# Git commit workflow
git add .                    # stage changes
git commit -m "Add login page"  # commit
git log --oneline            # view history

# Output:
# a1b2c3d Add login page
# e4f5g6h Initial commit`,
    exampleLanguage: 'bash',
    category: 'development',
    difficulty: 'beginner',
    relatedTerms: ['repository', 'deploy', 'bug'],
  },
  {
    id: 'repository',
    title: 'Репозиторий',
    definition: 'Хранилище кода проекта с полной историей изменений. Репозиторий отслеживает все версии файлов и позволяет работать нескольким разработчикам одновременно.',
    analogy: 'Архив документов с журналом изменений: каждый документ хранится со всеми правками, и всегда можно посмотреть, кто, когда и что изменил.',
    exampleCode: `# Create and manage a repository
git init                    # create new repo
git clone url               # copy existing repo
git remote add origin url   # link remote repo

# Repository structure:
# .git/          — version history
# src/           — source code
# README.md      — documentation
# package.json   — dependencies`,
    exampleLanguage: 'bash',
    category: 'development',
    difficulty: 'beginner',
    relatedTerms: ['commit', 'deploy'],
  },
  {
    id: 'ide',
    title: 'IDE',
    definition: 'Integrated Development Environment — программа, объединяющая редактор кода, отладчик, компилятор и другие инструменты разработки в единый интерфейс.',
    analogy: 'Швейцарский нож программиста: вместо отдельных инструментов (ножницы, нож, открывалка) вы получаете всё в одном устройстве.',
    exampleCode: `// Popular IDEs and their features:
// VS Code     — extensions, terminal, Git
// WebStorm    — JS/TS refactoring, debugging
// PyCharm     — Python analysis, testing
// IntelliJ    — Java, Spring, enterprise

// VS Code keyboard shortcuts:
// Ctrl+P      — quick file open
// Ctrl+Shift+F — search in files
// F12         — go to definition
// Ctrl+D      — select next occurrence`,
    exampleLanguage: 'javascript',
    category: 'development',
    difficulty: 'beginner',
    relatedTerms: ['debugging', 'compilation', 'syntax'],
  },
  {
    id: 'unit-test',
    title: 'Юнит-тест',
    definition: 'Автоматический тест, проверяющий работу отдельной функции или компонента в изоляции от остального кода.',
    analogy: 'Проверка одной лампочки в гирлянде: вы тестируете каждую лампочку отдельно, чтобы найти неисправную, вместо того чтобы проверять всю гирлянду целиком.',
    exampleCode: `// Jest unit test example
function sum(a, b) {
  return a + b;
}

describe("sum", () => {
  test("adds 1 + 2 = 3", () => {
    expect(sum(1, 2)).toBe(3);
  });

  test("adds negative numbers", () => {
    expect(sum(-1, -2)).toBe(-3);
  });
});`,
    exampleLanguage: 'javascript',
    category: 'development',
    difficulty: 'intermediate',
    relatedTerms: ['testing', 'bug', 'debugging'],
  },
  {
    id: 'testing',
    title: 'Тестирование',
    definition: 'Процесс проверки программы на соответствие требованиям и отсутствие ошибок. Включает ручное и автоматическое тестирование на разных уровнях.',
    analogy: 'Тест-драйв автомобиля: перед покупкой (релизом) вы проверяете все функции — тормоза, руль, двигатель — чтобы убедиться, что всё работает.',
    exampleCode: `// Testing pyramid:
// Unit tests      — fast, many
// Integration     — medium speed, some
// E2E (end-to-end) — slow, few

// Cypress E2E test example
describe("Login page", () => {
  it("should login successfully", () => {
    cy.visit("/login");
    cy.get("#email").type("user@test.com");
    cy.get("#password").type("password");
    cy.get("button[type=submit]").click();
    cy.url().should("include", "/dashboard");
  });
});`,
    exampleLanguage: 'javascript',
    category: 'development',
    difficulty: 'intermediate',
    relatedTerms: ['unit-test', 'bug', 'debugging'],
  },

  // === БАЗЫ ДАННЫХ (4) ===
  {
    id: 'sql',
    title: 'SQL',
    definition: 'Structured Query Language — язык запросов для управления реляционными базами данных. Позволяет создавать, читать, обновлять и удалять данные (CRUD).',
    analogy: 'Язык общения с кладовщиком: вы говорите «покажи все товары дороже 100 рублей» (SELECT), «добавь новый товар» (INSERT), «измени цену» (UPDATE).',
    exampleCode: `-- Create table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- CRUD operations
SELECT * FROM users WHERE age > 18;
INSERT INTO users (name, email) VALUES ('Alice', 'a@b.com');
UPDATE users SET name = 'Bob' WHERE id = 1;
DELETE FROM users WHERE id = 1;`,
    exampleLanguage: 'sql',
    category: 'databases',
    difficulty: 'beginner',
    relatedTerms: ['nosql', 'index-db', 'migration'],
  },
  {
    id: 'nosql',
    title: 'NoSQL',
    definition: 'Нереляционные базы данных, хранящие данные не в таблицах, а в документах, графах, ключ-значение парах или колонках. Подходят для гибких и масштабируемых систем.',
    analogy: 'Папка с документами вместо таблицы Excel: каждый документ может иметь свою структуру, и не нужно заранее определять колонки.',
    exampleCode: `// MongoDB (document-based NoSQL)
// Insert document
db.users.insertOne({
  name: "Alice",
  age: 25,
  hobbies: ["coding", "reading"],
  address: {
    city: "Moscow",
    country: "Russia"
  }
});

// Query
db.users.find({ age: { $gt: 18 } });`,
    exampleLanguage: 'javascript',
    category: 'databases',
    difficulty: 'intermediate',
    relatedTerms: ['sql', 'index-db', 'object'],
  },
  {
    id: 'index-db',
    title: 'Индекс',
    definition: 'Структура данных в базе, ускоряющая поиск по определённым столбцам. Индекс работает как оглавление книги — позволяет быстро найти нужные данные.',
    analogy: 'Алфавитный указатель в книге: вместо чтения каждой страницы вы смотрите в указатель и сразу переходите к нужному разделу.',
    exampleCode: `-- Create index for faster queries
CREATE INDEX idx_users_email
  ON users(email);

-- Composite index
CREATE INDEX idx_users_name_age
  ON users(name, age);

-- Check query performance
EXPLAIN ANALYZE
  SELECT * FROM users
  WHERE email = 'alice@example.com';`,
    exampleLanguage: 'sql',
    category: 'databases',
    difficulty: 'advanced',
    relatedTerms: ['sql', 'nosql', 'cache'],
  },
  {
    id: 'migration',
    title: 'Миграция',
    definition: 'Управляемое изменение структуры базы данных (добавление таблиц, столбцов, индексов). Миграции позволяют отслеживать и откатывать изменения схемы.',
    analogy: 'Ремонт в доме по плану: каждый этап (снос стены, новая проводка) записан, и при необходимости можно вернуть всё как было.',
    exampleCode: `-- Migration: add "role" column to users
-- Up (apply):
ALTER TABLE users
  ADD COLUMN role VARCHAR(50)
  DEFAULT 'user';

-- Down (rollback):
ALTER TABLE users
  DROP COLUMN role;

-- Migration file naming:
-- 001_create_users.sql
-- 002_add_role_to_users.sql`,
    exampleLanguage: 'sql',
    category: 'databases',
    difficulty: 'advanced',
    relatedTerms: ['sql', 'deploy', 'repository'],
  },

  // === АРХИТЕКТУРА (4) ===
  {
    id: 'microservice',
    title: 'Микросервис',
    definition: 'Архитектурный подход, при котором приложение разделено на маленькие независимые сервисы, каждый из которых выполняет одну задачу и общается с другими через API.',
    analogy: 'Отделы в компании: бухгалтерия, HR, разработка — каждый работает самостоятельно, но обменивается информацией через документы (API).',
    exampleCode: `// Microservice communication
// User Service (port 3001)
app.get("/api/users/:id", async (req, res) => {
  const user = await db.findUser(req.params.id);
  res.json(user);
});

// Order Service (port 3002)
app.post("/api/orders", async (req, res) => {
  // Call User Service
  const user = await fetch(
    "http://user-service:3001/api/users/1"
  );
  // Create order...
});`,
    exampleLanguage: 'javascript',
    category: 'architecture',
    difficulty: 'advanced',
    relatedTerms: ['api', 'stack', 'module', 'pattern'],
  },
  {
    id: 'stack',
    title: 'Стек',
    definition: 'Набор технологий, используемых для разработки проекта. Стек включает языки, фреймворки, базы данных и инструменты, работающие вместе.',
    analogy: 'Слоёный торт: каждый слой (база данных, сервер, фронтенд) выполняет свою роль, и вместе они создают готовый продукт.',
    exampleCode: `// Popular tech stacks:

// MERN Stack:
// MongoDB  — database
// Express  — backend framework
// React    — frontend library
// Node.js  — runtime

// LAMP Stack:
// Linux    — operating system
// Apache   — web server
// MySQL    — database
// PHP      — backend language`,
    exampleLanguage: 'javascript',
    category: 'architecture',
    difficulty: 'beginner',
    relatedTerms: ['framework', 'microservice', 'module'],
  },
  {
    id: 'pattern',
    title: 'Паттерн',
    definition: 'Типовое решение часто встречающейся проблемы в проектировании ПО. Паттерны — это проверенные шаблоны, которые можно адаптировать под свои задачи.',
    analogy: 'Типовые планировки квартир: архитекторы не изобретают каждый дом заново, а используют проверенные планировки, адаптируя их под конкретный участок.',
    exampleCode: `// Singleton pattern
class Database {
  static instance = null;

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

// Observer pattern
class EventEmitter {
  constructor() { this.listeners = {}; }
  on(event, fn) {
    (this.listeners[event] ??= []).push(fn);
  }
  emit(event, data) {
    this.listeners[event]?.forEach(fn => fn(data));
  }
}`,
    exampleLanguage: 'javascript',
    category: 'architecture',
    difficulty: 'advanced',
    relatedTerms: ['object', 'microservice', 'module'],
  },
  {
    id: 'module',
    title: 'Модуль',
    definition: 'Самостоятельная часть программы с определённым функционалом, которую можно подключать и использовать в других частях кода. Модули помогают организовать код.',
    analogy: 'Детали конструктора LEGO: каждый блок (модуль) самодостаточен и может использоваться в разных постройках (проектах).',
    exampleCode: `// ES Modules
// math.js — module
export const add = (a, b) => a + b;
export const multiply = (a, b) => a * b;

// app.js — importing module
import { add, multiply } from "./math.js";

console.log(add(2, 3));      // 5
console.log(multiply(4, 5)); // 20`,
    exampleLanguage: 'javascript',
    category: 'architecture',
    difficulty: 'beginner',
    relatedTerms: ['function', 'framework', 'pattern'],
  },
];
