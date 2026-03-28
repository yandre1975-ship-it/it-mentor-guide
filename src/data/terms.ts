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

  // === ИСКУССТВЕННЫЙ ИНТЕЛЛЕКТ (15) ===
  {
    id: 'neural-network',
    title: 'Нейросеть',
    definition: 'Математическая модель, вдохновлённая строением мозга. Состоит из слоёв искусственных нейронов, которые обрабатывают данные и обучаются на примерах.',
    analogy: 'Команда экспертов: каждый нейрон — специалист, который анализирует свою часть данных и передаёт вывод коллегам. Вместе они принимают коллективное решение.',
    exampleCode: `import tensorflow as tf

model = tf.keras.Sequential([
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(10, activation='softmax')
])

model.compile(optimizer='adam', loss='categorical_crossentropy')
model.summary()`,
    exampleLanguage: 'python',
    category: 'ai',
    difficulty: 'intermediate',
    relatedTerms: ['ml', 'deep-learning', 'dataset'],
  },
  {
    id: 'ml',
    title: 'Машинное обучение (ML)',
    definition: 'Подраздел ИИ, в котором алгоритмы учатся на данных и улучшают свои результаты без явного программирования каждого правила.',
    analogy: 'Ребёнок учится различать кошек и собак: никто не пишет ему инструкцию — он смотрит на примеры и со временем начинает узнавать животных сам.',
    exampleCode: `from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    features, labels, test_size=0.2
)

model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)
accuracy = model.score(X_test, y_test)
print(f"Accuracy: {accuracy:.2f}")`,
    exampleLanguage: 'python',
    category: 'ai',
    difficulty: 'beginner',
    relatedTerms: ['neural-network', 'dataset', 'supervised-learning'],
  },
  {
    id: 'dataset',
    title: 'Датасет',
    definition: 'Структурированный набор данных, используемый для обучения и оценки моделей машинного обучения. Может содержать текст, изображения, числа и т.д.',
    analogy: 'Учебник с задачами и ответами: модель «решает» задачи (данные) и сверяется с ответами (метки), чтобы научиться.',
    exampleCode: `import pandas as pd

# Load dataset
df = pd.read_csv("housing.csv")
print(df.shape)       # (20000, 8)
print(df.head())

# Split into features and target
X = df.drop("price", axis=1)
y = df["price"]`,
    exampleLanguage: 'python',
    category: 'ai',
    difficulty: 'beginner',
    relatedTerms: ['ml', 'neural-network', 'data-preprocessing'],
  },
  {
    id: 'reinforcement-learning',
    title: 'Обучение с подкреплением',
    definition: 'Метод машинного обучения, при котором агент учится принимать решения, получая награды за правильные действия и штрафы за ошибочные.',
    analogy: 'Дрессировка собаки: за правильную команду — лакомство (награда), за нежелательное поведение — игнорирование (штраф). Собака сама находит лучшую стратегию.',
    exampleCode: `# Q-learning pseudocode
import numpy as np

Q = np.zeros((num_states, num_actions))

for episode in range(1000):
    state = env.reset()
    while not done:
        action = np.argmax(Q[state])  # exploit
        next_state, reward, done = env.step(action)
        Q[state, action] += lr * (
            reward + gamma * np.max(Q[next_state]) - Q[state, action]
        )
        state = next_state`,
    exampleLanguage: 'python',
    category: 'ai',
    difficulty: 'advanced',
    relatedTerms: ['ml', 'neural-network', 'supervised-learning'],
  },
  {
    id: 'deep-learning',
    title: 'Глубокое обучение',
    definition: 'Подраздел машинного обучения, использующий нейросети с множеством скрытых слоёв. Особенно эффективен для изображений, речи и текста.',
    analogy: 'Многоэтажное сито: данные проходят через множество фильтров (слоёв), каждый из которых выделяет всё более сложные закономерности.',
    exampleCode: `import torch
import torch.nn as nn

class CNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(1, 32, 3)
        self.conv2 = nn.Conv2d(32, 64, 3)
        self.fc = nn.Linear(64 * 5 * 5, 10)

    def forward(self, x):
        x = torch.relu(self.conv1(x))
        x = torch.relu(self.conv2(x))
        return self.fc(x.view(x.size(0), -1))`,
    exampleLanguage: 'python',
    category: 'ai',
    difficulty: 'advanced',
    relatedTerms: ['neural-network', 'ml', 'computer-vision'],
  },
  {
    id: 'nlp',
    title: 'Обработка естественного языка (NLP)',
    definition: 'Область ИИ, занимающаяся анализом, пониманием и генерацией человеческого языка компьютером.',
    analogy: 'Переводчик-полиглот: компьютер учится понимать человеческую речь так же, как переводчик осваивает иностранные языки — через практику с большим количеством текстов.',
    exampleCode: `from transformers import pipeline

# Sentiment analysis
classifier = pipeline("sentiment-analysis")
result = classifier("I love this product!")
print(result)
# [{'label': 'POSITIVE', 'score': 0.9998}]

# Text generation
generator = pipeline("text-generation", model="gpt2")
text = generator("AI is", max_length=30)
print(text[0]["generated_text"])`,
    exampleLanguage: 'python',
    category: 'ai',
    difficulty: 'intermediate',
    relatedTerms: ['neural-network', 'deep-learning', 'transformer'],
  },
  {
    id: 'computer-vision',
    title: 'Компьютерное зрение',
    definition: 'Область ИИ, обучающая компьютеры «видеть» — распознавать объекты, лица и сцены на изображениях и видео.',
    analogy: 'Охранник на входе: он смотрит на лицо (изображение), сверяет с базой (обученная модель) и решает — пропустить или нет.',
    exampleCode: `import cv2

# Load image and detect faces
face_cascade = cv2.CascadeClassifier(
    "haarcascade_frontalface_default.xml"
)
img = cv2.imread("photo.jpg")
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

faces = face_cascade.detectMultiScale(gray, 1.3, 5)
print(f"Found {len(faces)} face(s)")`,
    exampleLanguage: 'python',
    category: 'ai',
    difficulty: 'intermediate',
    relatedTerms: ['deep-learning', 'neural-network', 'dataset'],
  },
  {
    id: 'transformer',
    title: 'Трансформер',
    definition: 'Архитектура нейросети, основанная на механизме внимания (attention). Лежит в основе GPT, BERT и других современных языковых моделей.',
    analogy: 'Читатель, который может мгновенно связать любое слово в тексте с любым другим, независимо от расстояния между ними — в отличие от чтения строго слева направо.',
    exampleCode: `from transformers import AutoTokenizer, AutoModel

tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
model = AutoModel.from_pretrained("bert-base-uncased")

inputs = tokenizer("Hello, world!", return_tensors="pt")
outputs = model(**inputs)

# outputs.last_hidden_state shape:
# (batch_size, sequence_length, hidden_size)
print(outputs.last_hidden_state.shape)`,
    exampleLanguage: 'python',
    category: 'ai',
    difficulty: 'advanced',
    relatedTerms: ['nlp', 'deep-learning', 'neural-network'],
  },
  {
    id: 'supervised-learning',
    title: 'Обучение с учителем',
    definition: 'Тип машинного обучения, при котором модель обучается на размеченных данных — парах «вход → правильный ответ».',
    analogy: 'Школьные контрольные с ответами: ученик (модель) решает задачи и сразу проверяет себя по ключу (метки), чтобы учиться на своих ошибках.',
    exampleCode: `from sklearn.linear_model import LinearRegression

# Supervised: X (features) -> y (labels)
X = [[1], [2], [3], [4], [5]]
y = [2, 4, 6, 8, 10]

model = LinearRegression()
model.fit(X, y)

prediction = model.predict([[6]])
print(f"Prediction for 6: {prediction[0]}")  # ~12.0`,
    exampleLanguage: 'python',
    category: 'ai',
    difficulty: 'beginner',
    relatedTerms: ['ml', 'dataset', 'unsupervised-learning'],
  },
  {
    id: 'unsupervised-learning',
    title: 'Обучение без учителя',
    definition: 'Тип машинного обучения, при котором модель ищет скрытые структуры и паттерны в неразмеченных данных без заранее известных ответов.',
    analogy: 'Сортировка монет без подписей: вы раскладываете их по кучкам (кластерам) по внешним признакам — размеру, цвету, весу — не зная названий.',
    exampleCode: `from sklearn.cluster import KMeans
import numpy as np

# Unsupervised: no labels, find clusters
data = np.random.rand(100, 2)

kmeans = KMeans(n_clusters=3)
kmeans.fit(data)

print("Cluster centers:", kmeans.cluster_centers_)
print("Labels:", kmeans.labels_[:10])`,
    exampleLanguage: 'python',
    category: 'ai',
    difficulty: 'intermediate',
    relatedTerms: ['ml', 'supervised-learning', 'dataset'],
  },
  {
    id: 'overfitting',
    title: 'Переобучение',
    definition: 'Ситуация, когда модель слишком хорошо запоминает обучающие данные и теряет способность обобщать — плохо работает на новых данных.',
    analogy: 'Студент, который зубрит ответы к тесту наизусть: на знакомых вопросах он отвечает идеально, но на новых — теряется.',
    exampleCode: `from sklearn.model_selection import cross_val_score
from sklearn.tree import DecisionTreeClassifier

# Overfitting: tree memorizes training data
tree = DecisionTreeClassifier(max_depth=None)
tree.fit(X_train, y_train)
print("Train:", tree.score(X_train, y_train))  # 1.00
print("Test:", tree.score(X_test, y_test))      # 0.72

# Fix: limit depth (regularization)
tree = DecisionTreeClassifier(max_depth=5)
tree.fit(X_train, y_train)
print("Train:", tree.score(X_train, y_train))  # 0.88
print("Test:", tree.score(X_test, y_test))      # 0.85`,
    exampleLanguage: 'python',
    category: 'ai',
    difficulty: 'intermediate',
    relatedTerms: ['ml', 'dataset', 'supervised-learning'],
  },
  {
    id: 'data-preprocessing',
    title: 'Предобработка данных',
    definition: 'Этап подготовки сырых данных перед обучением модели: очистка, нормализация, заполнение пропусков и преобразование форматов.',
    analogy: 'Подготовка ингредиентов перед готовкой: овощи нужно помыть, почистить и нарезать, прежде чем класть в кастрюлю.',
    exampleCode: `import pandas as pd
from sklearn.preprocessing import StandardScaler

df = pd.read_csv("data.csv")

# Handle missing values
df.fillna(df.mean(), inplace=True)

# Normalize features
scaler = StandardScaler()
df[["age", "salary"]] = scaler.fit_transform(
    df[["age", "salary"]]
)
print(df.describe())`,
    exampleLanguage: 'python',
    category: 'ai',
    difficulty: 'beginner',
    relatedTerms: ['dataset', 'ml', 'overfitting'],
  },
  {
    id: 'generative-ai',
    title: 'Генеративный ИИ',
    definition: 'Модели ИИ, способные создавать новый контент — текст, изображения, музыку, код — на основе обученных паттернов.',
    analogy: 'Художник, который изучил тысячи картин и теперь рисует собственные произведения в любом стиле — не копируя, а создавая нечто новое.',
    exampleCode: `import openai

response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "You are a poet."},
        {"role": "user", "content": "Write a haiku about AI"}
    ]
)

print(response.choices[0].message.content)
# Silicon minds dream
# Patterns woven from our words
# New worlds start to bloom`,
    exampleLanguage: 'python',
    category: 'ai',
    difficulty: 'beginner',
    relatedTerms: ['transformer', 'deep-learning', 'nlp'],
  },
  {
    id: 'gradient-descent',
    title: 'Градиентный спуск',
    definition: 'Оптимизационный алгоритм, который итеративно корректирует параметры модели в направлении наименьшей ошибки, «спускаясь» по поверхности функции потерь.',
    analogy: 'Спуск с горы в тумане: вы не видите подножия, но чувствуете наклон под ногами и всегда шагаете вниз, пока не окажетесь в долине.',
    exampleCode: `import numpy as np

def gradient_descent(X, y, lr=0.01, epochs=1000):
    w = np.zeros(X.shape[1])
    b = 0
    for _ in range(epochs):
        pred = X @ w + b
        error = pred - y
        w -= lr * (2/len(y)) * (X.T @ error)
        b -= lr * (2/len(y)) * error.sum()
    return w, b

w, b = gradient_descent(X_train, y_train)
print("Weights:", w)`,
    exampleLanguage: 'python',
    category: 'ai',
    difficulty: 'advanced',
    relatedTerms: ['neural-network', 'ml', 'overfitting'],
  },
  {
    id: 'ai-model',
    title: 'Модель ИИ',
    definition: 'Математическая структура, обученная на данных для выполнения конкретной задачи: классификации, предсказания, генерации и т.д.',
    analogy: 'Выпускник университета: он прошёл обучение (тренировку на данных), получил диплом (обученные веса) и теперь может применять знания на практике.',
    exampleCode: `import joblib
from sklearn.ensemble import GradientBoostingClassifier

# Train model
model = GradientBoostingClassifier()
model.fit(X_train, y_train)

# Save model
joblib.dump(model, "model.pkl")

# Load and use model later
loaded = joblib.load("model.pkl")
predictions = loaded.predict(X_new)
print("Predictions:", predictions)`,
    exampleLanguage: 'python',
    category: 'ai',
    difficulty: 'beginner',
    relatedTerms: ['ml', 'neural-network', 'dataset'],
  },

  // === IT-СПЕЦИАЛЬНОСТИ (10) ===
  {
    id: 'spec-frontend',
    title: 'Frontend-разработчик',
    definition: 'Специалист, создающий визуальную часть веб-приложений. Отвечает за вёрстку, интерактивность и пользовательский опыт в браузере.',
    analogy: 'Дизайнер интерьеров: он делает дом (сайт) красивым и удобным для жильцов (пользователей), расставляя мебель (элементы интерфейса) так, чтобы было комфортно.',
    exampleCode: `// React component
function Button({ label, onClick }) {
  return (
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded"
      onClick={onClick}
    >
      {label}
    </button>
  );
}`,
    exampleLanguage: 'javascript',
    category: 'specialties',
    difficulty: 'beginner',
    relatedTerms: ['framework', 'http', 'api'],
  },
  {
    id: 'spec-backend',
    title: 'Backend-разработчик',
    definition: 'Специалист, отвечающий за серверную логику, базы данных, API и интеграции. Обеспечивает работу «под капотом» приложения.',
    analogy: 'Повар на кухне ресторана: клиент не видит его работу, но именно от повара зависит качество блюда (данных), которое приносит официант (API).',
    exampleCode: `# Flask API endpoint
from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/api/users")
def get_users():
    users = db.query("SELECT * FROM users")
    return jsonify(users)

app.run(port=5000)`,
    exampleLanguage: 'python',
    category: 'specialties',
    difficulty: 'beginner',
    relatedTerms: ['api', 'sql', 'web-server'],
  },
  {
    id: 'spec-devops',
    title: 'DevOps-инженер',
    definition: 'Специалист на стыке разработки и эксплуатации. Автоматизирует CI/CD-пайплайны, управляет инфраструктурой и обеспечивает стабильность сервисов.',
    analogy: 'Логист на заводе: он не делает детали сам, но обеспечивает бесперебойную доставку (деплой) продукции (кода) от цеха (разработки) до магазина (продакшна).',
    exampleCode: `# GitHub Actions CI/CD
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install && npm run build
      - run: docker build -t myapp .
      - run: docker push registry.io/myapp`,
    exampleLanguage: 'yaml',
    category: 'specialties',
    difficulty: 'intermediate',
    relatedTerms: ['deploy', 'commit', 'hosting'],
  },
  {
    id: 'spec-data-scientist',
    title: 'Data Scientist',
    definition: 'Специалист по анализу данных и машинному обучению. Строит модели для прогнозирования, классификации и поиска закономерностей в данных.',
    analogy: 'Детектив: изучает улики (данные), находит паттерны (закономерности) и делает выводы (предсказания), которые помогают раскрыть дело (решить бизнес-задачу).',
    exampleCode: `import pandas as pd
from sklearn.ensemble import RandomForestClassifier

df = pd.read_csv("customers.csv")
X = df[["age", "income", "visits"]]
y = df["will_buy"]

model = RandomForestClassifier()
model.fit(X, y)
print("Accuracy:", model.score(X, y))`,
    exampleLanguage: 'python',
    category: 'specialties',
    difficulty: 'intermediate',
    relatedTerms: ['ml', 'dataset', 'neural-network'],
  },
  {
    id: 'spec-qa',
    title: 'QA-инженер',
    definition: 'Специалист по обеспечению качества ПО. Проектирует тесты, находит баги и автоматизирует проверку работоспособности продукта.',
    analogy: 'ОТК на заводе: прежде чем товар (продукт) попадёт к покупателю (пользователю), контролёр (QA) проверяет каждую деталь на дефекты (баги).',
    exampleCode: `// Playwright E2E test
import { test, expect } from "@playwright/test";

test("login flow", async ({ page }) => {
  await page.goto("/login");
  await page.fill("#email", "user@test.com");
  await page.fill("#password", "secret");
  await page.click("button[type=submit]");
  await expect(page).toHaveURL("/dashboard");
});`,
    exampleLanguage: 'typescript',
    category: 'specialties',
    difficulty: 'beginner',
    relatedTerms: ['bug', 'testing', 'unit-test'],
  },
  {
    id: 'spec-mobile',
    title: 'Мобильный разработчик',
    definition: 'Создаёт приложения для смартфонов и планшетов на iOS и/или Android. Может работать с нативными языками или кроссплатформенными фреймворками.',
    analogy: 'Архитектор мини-домов: он проектирует компактные (мобильные), но функциональные пространства с учётом всех ограничений размера экрана.',
    exampleCode: `// React Native component
import { View, Text, TouchableOpacity } from "react-native";

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Text style={{ fontSize: 24 }}>Hello, Mobile!</Text>
      <TouchableOpacity onPress={() => alert("Tapped!")}>
        <Text>Tap me</Text>
      </TouchableOpacity>
    </View>
  );
}`,
    exampleLanguage: 'javascript',
    category: 'specialties',
    difficulty: 'beginner',
    relatedTerms: ['framework', 'api', 'object'],
  },
  {
    id: 'spec-security',
    title: 'Специалист по кибербезопасности',
    definition: 'Защищает информационные системы от взломов, утечек и кибератак. Проводит аудит, пентесты и разрабатывает политики безопасности.',
    analogy: 'Охранная служба здания: проверяет замки (уязвимости), устанавливает камеры (мониторинг) и тренирует персонал (обучает команду безопасности).',
    exampleCode: `# SQL Injection check
# Vulnerable:
query = f"SELECT * FROM users WHERE name = '{input}'"

# Safe (parameterized):
cursor.execute(
    "SELECT * FROM users WHERE name = %s",
    (input,)
)`,
    exampleLanguage: 'python',
    category: 'specialties',
    difficulty: 'intermediate',
    relatedTerms: ['http', 'dns', 'web-server'],
  },
  {
    id: 'spec-ml-engineer',
    title: 'ML-инженер',
    definition: 'Специалист по внедрению моделей машинного обучения в продакшн. Строит ML-пайплайны, оптимизирует модели и следит за их качеством в работе.',
    analogy: 'Инженер, который превращает лабораторный прототип (модель) в серийный продукт (сервис): настраивает конвейер, контролирует качество и масштабирует производство.',
    exampleCode: `# MLflow model tracking
import mlflow

with mlflow.start_run():
    model.fit(X_train, y_train)
    accuracy = model.score(X_test, y_test)

    mlflow.log_param("n_estimators", 100)
    mlflow.log_metric("accuracy", accuracy)
    mlflow.sklearn.log_model(model, "model")`,
    exampleLanguage: 'python',
    category: 'specialties',
    difficulty: 'advanced',
    relatedTerms: ['neural-network', 'deep-learning', 'ml'],
  },
  {
    id: 'spec-fullstack',
    title: 'Fullstack-разработчик',
    definition: 'Универсальный разработчик, владеющий и фронтендом, и бэкендом. Может создать приложение «от и до» — от интерфейса до серверной логики и базы данных.',
    analogy: 'Мастер-универсал в автосервисе: умеет и кузов покрасить (фронтенд), и двигатель починить (бэкенд), что особенно ценно в небольших командах.',
    exampleCode: `// Next.js API route + page
// pages/api/hello.ts
export default function handler(req, res) {
  res.json({ message: "Hello from API" });
}

// pages/index.tsx
export default function Home({ data }) {
  return <h1>{data.message}</h1>;
}`,
    exampleLanguage: 'typescript',
    category: 'specialties',
    difficulty: 'intermediate',
    relatedTerms: ['framework', 'api', 'deploy', 'stack'],
  },
  {
    id: 'spec-analyst',
    title: 'Системный аналитик',
    definition: 'Связующее звено между бизнесом и разработкой. Собирает требования, проектирует решения, пишет технические задания и следит за соответствием продукта потребностям.',
    analogy: 'Переводчик между заказчиком и строителями: клиент говорит «хочу уютный дом», а аналитик превращает это в чертежи (ТЗ) с точными размерами.',
    exampleCode: `# User Story format
## US-042: Регистрация пользователя

**Как** новый пользователь
**Я хочу** зарегистрироваться по email
**Чтобы** получить доступ к личному кабинету

### Критерии приёмки:
- [ ] Валидация email
- [ ] Пароль >= 8 символов
- [ ] Письмо с подтверждением`,
    exampleLanguage: 'markdown',
    category: 'specialties',
    difficulty: 'beginner',
    relatedTerms: ['api', 'sql', 'microservice'],
  },
  {
    id: 'spec-ui-ux',
    title: 'UI/UX-дизайнер',
    definition: 'Проектирует удобные и красивые интерфейсы. UX отвечает за логику взаимодействия, UI — за визуальное оформление.',
    analogy: 'Архитектор + декоратор: UX — это планировка комнат (удобно ли ходить), а UI — обои, мебель и освещение (приятно ли находиться).',
    exampleCode: `/* Пример дизайн-токенов */
:root {
  --color-primary: #3B82F6;
  --radius: 8px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
}

.button {
  background: var(--color-primary);
  border-radius: var(--radius);
  padding: var(--spacing-sm) var(--spacing-md);
}`,
    exampleLanguage: 'css',
    category: 'specialties',
    difficulty: 'beginner',
    relatedTerms: ['framework', 'spec-frontend'],
  },
  {
    id: 'spec-product-manager',
    title: 'Продакт-менеджер',
    definition: 'Определяет стратегию продукта: что строить, зачем и в каком порядке. Работает на стыке бизнеса, технологий и пользовательского опыта.',
    analogy: 'Капитан корабля: он не гребёт (не пишет код), но выбирает курс (стратегию), следит за картой (метриками) и координирует команду.',
    exampleCode: `# Product Roadmap (Q1 2025)

| Приоритет | Фича              | Метрика        |
|-----------|-------------------|----------------|
| P0        | Онбординг         | Retention +15% |
| P1        | Уведомления       | DAU +10%       |
| P2        | Тёмная тема       | NPS +5         |

## RICE Score = (Reach * Impact * Confidence) / Effort`,
    exampleLanguage: 'markdown',
    category: 'specialties',
    difficulty: 'beginner',
    relatedTerms: ['api', 'testing', 'spec-analyst'],
  },
  {
    id: 'spec-project-manager',
    title: 'Проджект-менеджер',
    definition: 'Управляет процессом разработки: планирует спринты, контролирует сроки и бюджет, устраняет блокеры и обеспечивает доставку продукта вовремя.',
    analogy: 'Дирижёр оркестра: каждый музыкант (разработчик) играет свою партию, а дирижёр следит, чтобы все играли слаженно и вовремя.',
    exampleCode: `# Scrum Sprint Planning

Sprint Goal: "Запустить регистрацию"
Duration: 2 weeks

## Backlog:
- [ ] US-01: Форма регистрации (5 SP)
- [ ] US-02: Email-валидация (3 SP)
- [ ] US-03: OAuth Google (8 SP)

Velocity: ~16 SP/sprint`,
    exampleLanguage: 'markdown',
    category: 'specialties',
    difficulty: 'beginner',
    relatedTerms: ['bug', 'deploy', 'commit'],
  },
  {
    id: 'spec-techlead',
    title: 'Тимлид / Техлид',
    definition: 'Технический лидер команды. Принимает архитектурные решения, проводит код-ревью, менторит разработчиков и отвечает за качество кодовой базы.',
    analogy: 'Старший мастер в цехе: сам умеет работать на любом станке, но главное — обучает новичков, проверяет качество деталей и решает, какую технологию использовать.',
    exampleCode: `// Architecture Decision Record (ADR)

## ADR-003: Переход на микросервисы

### Контекст
Монолит стал узким местом: деплой 2 часа,
команда из 15 человек мешает друг другу.

### Решение
Выделить auth, payments, notifications
в отдельные сервисы.

### Последствия
+ Независимый деплой
- Сложность инфраструктуры`,
    exampleLanguage: 'markdown',
    category: 'specialties',
    difficulty: 'intermediate',
    relatedTerms: ['pattern', 'microservice', 'stack'],
  },
];
