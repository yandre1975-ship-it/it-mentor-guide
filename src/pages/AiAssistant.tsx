import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { terms } from '@/data/terms';
import { roadmapStages, projectTypes } from '@/data/roadmap';
import {
  Sparkles, Send, Bot, User, Loader2, Mic, MicOff, Trash2,
  Lightbulb, HelpCircle, RotateCcw, ArrowRight, BookOpen,
  Briefcase, BrainCircuit, Layers, Code2, Terminal, Shield,
  Smartphone, Palette, LineChart, Lightbulb as IdeaIcon,
  Pencil, Code, TestTube, Rocket, ChevronRight, Map,
  PlayCircle, ExternalLink, MessageSquare, X
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

type Msg = { role: 'user' | 'assistant'; content: string; timestamp?: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

interface WindowWithSpeech extends Window {
  SpeechRecognition?: new () => SpeechRecognition;
  webkitSpeechRecognition?: new () => SpeechRecognition;
}

const SpeechRecognition = ((window as WindowWithSpeech).SpeechRecognition || (window as WindowWithSpeech).webkitSpeechRecognition);

async function streamChat({
  messages,
  onDelta,
  onDone,
  signal,
  context,
}: {
  messages: Msg[];
  onDelta: (text: string) => void;
  onDone: () => void;
  signal?: AbortSignal;
  context?: string;
}) {
  const resp = await fetch(CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, context }),
    signal,
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `Error ${resp.status}`);
  }

  if (!resp.body) throw new Error('No response body');

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let done = false;

  while (!done) {
    const { done: readerDone, value } = await reader.read();
    if (readerDone) break;
    buffer += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buffer.indexOf('\n')) !== -1) {
      let line = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 1);
      if (line.endsWith('\r')) line = line.slice(0, -1);
      if (line.startsWith(':') || !line.trim()) continue;
      if (!line.startsWith('data: ')) continue;

      const json = line.slice(6).trim();
      if (json === '[DONE]') { done = true; break; }

      try {
        const parsed = JSON.parse(json);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch {
        buffer = line + '\n' + buffer;
        break;
      }
    }
  }

  onDone();
}

const CHAT_STORAGE_KEY = 'ai-chat-history-main';

function loadMessages(): Msg[] {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveMessages(msgs: Msg[]) {
  try { localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(msgs)); } catch { /* ignore */ }
}

const quickQuestions = [
  'Что такое API простыми словами?',
  'Как стать frontend-разработчиком?',
  'Объясни, что такое Docker',
  'Чем backend отличается от frontend?',
  'Что такое CI/CD и зачем он нужен?',
  'Как работает интернет изнутри?',
];

const quickActions = [
  { label: 'Объясни проще', icon: Lightbulb, text: 'Объясни проще, как для ребёнка' },
  { label: 'Аналогия', icon: HelpCircle, text: 'Приведи жизненную аналогию' },
  { label: 'Разбери по частям', icon: RotateCcw, text: 'Разбери по частям' },
];

export default function AiAssistant() {
  const [messages, setMessages] = useState<Msg[]>(loadMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [activeSection, setActiveSection] = useState<'chat' | 'roadmap' | 'projects'>('chat');
  const [expandedStage, setExpandedStage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  const sendRef = useRef<(() => void) | null>(null);

  useEffect(() => { saveMessages(messages); }, [messages]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (hasStarted) inputRef.current?.focus();
  }, [hasStarted]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    if (!hasStarted) setHasStarted(true);

    const userMsg: Msg = { role: 'user', content: text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    let assistantSoFar = '';
    const controller = new AbortController();
    abortRef.current = controller;

    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
        }
        return [...prev, { role: 'assistant', content: assistantSoFar, timestamp: new Date().toISOString() }];
      });
    };

    try {
      await streamChat({
        messages: [...messagesRef.current, userMsg],
        onDelta: upsert,
        onDone: () => setIsLoading(false),
        signal: controller.signal,
        context: 'Пользователь на главной странице AI-ассистента IT-Библиотеки. У тебя есть доступ к базе знаний по IT-терминам, специальностям, процессам разработки и технологиям. Можешь помочь с пошаговым созданием проектов от идеи до деплоя.',
      });
    } catch (e: unknown) {
      if (e instanceof Error && e.name !== 'AbortError') {
        toast({ title: 'Ошибка', description: e.message, variant: 'destructive' });
      }
      setIsLoading(false);
    }
  }, [input, isLoading, hasStarted]);

  sendRef.current = send;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleQuickQuestion = (q: string) => {
    setInput(q);
    setActiveSection('chat');
    setTimeout(() => sendRef.current?.(), 100);
  };

  const handleSendFromRoadmap = (q: string) => {
    setInput(q);
    setActiveSection('chat');
    if (!hasStarted) setHasStarted(true);
    setTimeout(() => sendRef.current?.(), 150);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="container flex h-14 items-center gap-3">
          <Link to="/" className="flex items-center gap-2 font-bold shrink-0 mr-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="hidden sm:inline font-heading text-lg tracking-tight">AI IT-Помощник</span>
          </Link>

          <div className="flex-1" />

          {/* Section tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-muted/50 rounded-xl p-1">
            {[
              { id: 'chat' as const, label: 'AI Чат', icon: MessageSquare },
              { id: 'roadmap' as const, label: 'Roadmap', icon: Map },
              { id: 'projects' as const, label: 'Проекты + Схемы', icon: Layers },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  activeSection === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex-1" />

          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/terms" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary">
              <BookOpen className="h-4 w-4" />
              Термины
            </Link>
            <Link to="/specialties" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary">
              <Briefcase className="h-4 w-4" />
              Специальности
            </Link>
            <Link to="/quizzes" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary">
              <BrainCircuit className="h-4 w-4" />
              Квизы
            </Link>
            <Link to="/prototypes" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary">
              <Layers className="h-4 w-4" />
              Схемы
            </Link>
          </nav>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden border-t">
          <div className="container flex items-center gap-1 py-1 overflow-x-auto">
            {[
              { id: 'chat' as const, label: 'AI Чат', icon: MessageSquare },
              { id: 'roadmap' as const, label: 'Roadmap', icon: Map },
              { id: 'projects' as const, label: 'Проекты', icon: Layers },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                  activeSection === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container max-w-5xl py-6 flex flex-col">
        <AnimatePresence mode="wait">
          {activeSection === 'chat' && (
            <motion.div
              key="chat-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col min-h-0"
            >
              {!hasStarted ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-8 py-8">
                  {/* Hero */}
                  <div className="text-center space-y-4 max-w-2xl">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-violet-600 shadow-lg mb-2">
                      <Bot className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight">
                      AI IT-Помощник
                    </h1>
                    <p className="text-muted-foreground text-lg sm:text-xl max-w-lg mx-auto">
                      Задай вопрос про IT — объясню термин, технологию или помогу создать проект от идеи до деплоя
                    </p>
                  </div>

                  {/* Quick questions */}
                  <div className="w-full max-w-2xl space-y-3">
                    <p className="text-sm text-muted-foreground text-center">Попробуйте спросить:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {quickQuestions.map((q) => (
                        <button
                          key={q}
                          onClick={() => handleQuickQuestion(q)}
                          className="text-sm px-4 py-2 rounded-full border bg-card hover:border-primary/40 hover:shadow-sm transition-all"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick nav to other sections */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl">
                    <button
                      onClick={() => setActiveSection('roadmap')}
                      className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:border-primary/40 hover:shadow-sm transition-all text-left"
                    >
                      <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                        <Map className="h-5 w-5 text-violet-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Roadmap</p>
                        <p className="text-xs text-muted-foreground">От идеи до деплоя</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveSection('projects')}
                      className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:border-primary/40 hover:shadow-sm transition-all text-left"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Layers className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Проекты</p>
                        <p className="text-xs text-muted-foreground">Схемы архитектур</p>
                      </div>
                    </button>
                    <Link
                      to="/prototypes"
                      className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:border-primary/40 hover:shadow-sm transition-all text-left"
                    >
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <ExternalLink className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Схемы</p>
                        <p className="text-xs text-muted-foreground">Визуальные архитектуры</p>
                      </div>
                    </Link>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4" />
                      <span>{terms.length} терминов</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4" />
                      <span>IT-специальности</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BrainCircuit className="h-4 w-4" />
                      <span>Квизы и тесты</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col min-h-0">
                  {/* Messages */}
                  <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                    {messages.map((msg, i) => (
                      <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'assistant' && (
                          <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-primary-foreground" />
                          </div>
                        )}
                        <div
                          className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 text-sm ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-br from-primary to-primary-600 text-primary-foreground rounded-2xl rounded-tr-sm'
                              : 'bg-card border rounded-2xl rounded-tl-sm shadow-sm'
                          }`}
                        >
                          {msg.role === 'assistant' ? (
                            <div className="prose prose-sm dark:prose-invert max-w-none [&_p]:my-1.5 [&_ul]:my-1.5 [&_ol]:my-1.5 [&_li]:my-0.5 [&_code]:text-xs [&_code]:bg-muted [&_code]:px-1 [&_code]:rounded">
                              <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          )}
                          {msg.timestamp && (
                            <span className={`text-[10px] opacity-60 mt-1.5 block ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                              {new Date(msg.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                        {msg.role === 'user' && (
                          <div className="shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                            <User className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    ))}

                    {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                      <div className="flex gap-3 items-center">
                        <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div className="bg-card border rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                      </div>
                    )}

                    {messages.length > 0 && !isLoading && messages[messages.length - 1]?.role === 'assistant' && (
                      <div className="flex flex-wrap gap-2 justify-start pl-11">
                        {quickActions.map((action) => (
                          <button
                            key={action.label}
                            onClick={() => handleQuickQuestion(action.text)}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border bg-secondary/50 hover:bg-secondary transition-colors"
                          >
                            <action.icon className="h-3 w-3" />
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Input area */}
              <div className="border-t bg-background/80 backdrop-blur py-4 px-4">
                <div className="max-w-3xl mx-auto">
                  {messages.length > 0 && (
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs text-muted-foreground">AI-ассистент онлайн</span>
                      </div>
                      <button
                        onClick={() => { setMessages([]); setHasStarted(false); }}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                        Очистить чат
                      </button>
                    </div>
                  )}
                  <ChatInput
                    input={input}
                    setInput={setInput}
                    onSend={send}
                    onKeyDown={handleKeyDown}
                    isLoading={isLoading}
                    inputRef={inputRef}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'roadmap' && (
            <motion.div
              key="roadmap-section"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2 py-4">
                <h2 className="font-heading text-3xl font-bold tracking-tight">Roadmap разработки</h2>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  Пошаговый путь создания IT-проекта от идеи до деплоя. Кликайте на этапы, чтобы узнать больше или задать вопрос AI.
                </p>
              </div>

              {/* Roadmap stages */}
              <div className="space-y-4">
                {roadmapStages.map((stage, index) => {
                  const isExpanded = expandedStage === stage.id;
                  const StageIcon = stage.icon;
                  return (
                    <motion.div
                      key={stage.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`rounded-2xl border ${stage.borderColor} bg-card overflow-hidden transition-all`}
                    >
                      <button
                        onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
                        className="w-full flex items-center gap-4 p-5 text-left hover:bg-muted/20 transition-colors"
                      >
                        <div className={`w-12 h-12 rounded-xl ${stage.bgColor} flex items-center justify-center shrink-0`}>
                          <StageIcon className={`h-6 w-6 ${stage.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{stage.title}</h3>
                            <Badge variant="secondary" className="text-xs">Шаг {index + 1}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{stage.subtitle}</p>
                        </div>
                        <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 space-y-4">
                              {/* Steps */}
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Что нужно сделать:</p>
                                <ul className="space-y-1.5">
                                  {stage.steps.map((step, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                                      </div>
                                      {step}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Questions for AI */}
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Спроси AI:</p>
                                <div className="flex flex-wrap gap-2">
                                  {stage.questions.map((q) => (
                                    <button
                                      key={q}
                                      onClick={() => handleSendFromRoadmap(q)}
                                      className="text-xs px-3 py-1.5 rounded-full border bg-secondary/50 hover:bg-secondary hover:border-primary/30 transition-all flex items-center gap-1"
                                    >
                                      <MessageSquare className="h-3 w-3" />
                                      {q}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Related prototypes */}
                              {stage.prototypeIds.length > 0 && (
                                <div className="space-y-2">
                                  <p className="text-sm font-medium">Связанные схемы:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {stage.prototypeIds.map((pid) => (
                                      <Link
                                        key={pid}
                                        to={`/prototypes?project=${pid}`}
                                        className="text-xs px-3 py-1.5 rounded-full border bg-primary/5 hover:bg-primary/10 text-primary transition-colors flex items-center gap-1"
                                      >
                                        <Layers className="h-3 w-3" />
                                        Смотреть схему
                                        <ExternalLink className="h-3 w-3" />
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA */}
              <div className="text-center">
                <button
                  onClick={() => handleSendFromRoadmap('Расскажи подробно, как создать IT-проект от идеи до деплоя')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:brightness-105 transition-all shadow-sm"
                >
                  <PlayCircle className="h-5 w-5" />
                  Задать вопрос про весь процесс
                </button>
              </div>
            </motion.div>
          )}

          {activeSection === 'projects' && (
            <motion.div
              key="projects-section"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2 py-4">
                <h2 className="font-heading text-3xl font-bold tracking-tight">Типы проектов + Схемы</h2>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  Выберите тип проекта, чтобы посмотреть его архитектурную схему, изучить роли команды и технологический стек.
                </p>
              </div>

              {/* Project cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {projectTypes.map((project, i) => {
                  const ProjectIcon = project.icon;
                  const diffConfig = {
                    beginner: { label: 'Начинающий', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' },
                    intermediate: { label: 'Средний', color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' },
                    advanced: { label: 'Продвинутый', color: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' },
                  };
                  const diff = diffConfig[project.difficulty];
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group rounded-2xl border bg-card hover:shadow-hover hover:-translate-y-1 transition-all overflow-hidden"
                    >
                      <div className="p-5 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <ProjectIcon className="h-6 w-6 text-primary" />
                          </div>
                          <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${diff.color}`}>
                            {diff.label}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{project.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                          <Link
                            to={`/prototypes?project=${project.prototypeId}`}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-105 transition-colors"
                          >
                            <Layers className="h-4 w-4" />
                            Схема
                          </Link>
                          <button
                            onClick={() => handleSendFromRoadmap(`Как создать ${project.title.toLowerCase()}? Расскажи пошагово`)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border bg-secondary/50 hover:bg-secondary text-sm font-medium transition-colors"
                          >
                            <MessageSquare className="h-4 w-4" />
                            Спроcить AI
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Link to all schemas */}
              <div className="text-center">
                <Link
                  to="/prototypes"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border bg-card hover:bg-secondary transition-all font-medium"
                >
                  <Layers className="h-5 w-5" />
                  Открыть раздел «Схемы»
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function ChatInput({
  input,
  setInput,
  onSend,
  onKeyDown,
  isLoading,
  inputRef,
}: {
  input: string;
  setInput: (v: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}) {
  const [listening, setListening] = useState(false);
  const recRef = useRef<SpeechRecognition | null>(null);

  const stopListening = useCallback(() => {
    recRef.current?.stop();
    recRef.current = null;
    setListening(false);
  }, []);

  const toggleVoice = useCallback(() => {
    if (listening) { stopListening(); return; }
    if (!SpeechRecognition) {
      toast({ title: 'Голосовой ввод недоступен', description: 'Попробуйте Chrome или Edge.', variant: 'destructive' });
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = 'ru-RU';
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = Array.from(e.results).map((r) => r[0].transcript).join('');
      setInput(transcript);
    };
    rec.onerror = () => stopListening();
    rec.onend = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  }, [listening, stopListening, setInput]);

  return (
    <div className="relative flex items-center">
      <textarea
        ref={inputRef}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Задайте вопрос про IT..."
        rows={1}
        className="w-full resize-none rounded-2xl border bg-card pl-4 pr-28 py-3.5 text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground max-h-32 shadow-sm"
        style={{ minHeight: '52px' }}
      />
      <div className="absolute right-2 flex items-center gap-1">
        {SpeechRecognition && (
          <button
            onClick={toggleVoice}
            aria-label={listening ? 'Остановить запись' : 'Голосовой ввод'}
            className={`shrink-0 h-9 w-9 rounded-xl flex items-center justify-center transition-colors ${
              listening
                ? 'bg-destructive/10 text-destructive animate-pulse'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
        )}
        <button
          onClick={onSend}
          disabled={!input.trim() || isLoading}
          className="shrink-0 h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 transition-colors hover:brightness-105 shadow-sm"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
