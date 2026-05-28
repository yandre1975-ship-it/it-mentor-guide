import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useDragControls, AnimatePresence } from 'framer-motion';
import { terms } from '@/data/terms';
import { categoryLabels } from '@/data/types';
import { Sparkles, X, Send, Bot, User, Loader2, Mic, MicOff, Trash2, HelpCircle, Lightbulb, RotateCcw, GripHorizontal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

import confetti from 'canvas-confetti';

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
    <div className="border-t p-3">
      {listening && (
        <div className="flex items-center gap-2 px-3 pb-2 text-xs text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive" />
          </span>
          Говорите...
        </div>
      )}
      <div className="relative flex items-center">
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Задайте вопрос..."
          rows={1}
          className="w-full resize-none rounded-full border bg-background pl-4 pr-24 py-3 text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground max-h-24"
          style={{ minHeight: '44px' }}
        />
        <div className="absolute right-2 flex items-center gap-1">
          {SpeechRecognition && (
            <button
              onClick={toggleVoice}
              aria-label={listening ? 'Остановить запись' : 'Голосовой ввод'}
              className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
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
            className="shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 transition-colors hover:brightness-105"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

const CHAT_STORAGE_KEY = 'ai-chat-history';

function loadMessages(): Msg[] {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveMessages(msgs: Msg[]) {
  try { localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(msgs)); } catch { /* ignore */ }
}

const sectionNames: Record<string, string> = {
  '/': 'Каталог IT-терминов',
  '/processes': 'Процессы разработки',
  '/quizzes': 'Квизы и тесты',
  '/specialties': 'IT-специальности',
  '/prototypes': 'Проекты и прототипы',
  '/features': 'Фичи',
  '/favorites': 'Избранное',
  '/review': 'Повторение',
  '/career-quiz': 'Профориентация',
};

function usePageContext(): string | undefined {
  const location = useLocation();
  return useMemo(() => {
    const termMatch = location.pathname.match(/^\/term\/(.+)$/);
    if (termMatch) {
      const term = terms.find(t => t.id === termMatch[1]);
      if (term) {
        return `Пользователь сейчас изучает термин «${term.title}» (категория: ${categoryLabels[term.category]}). Определение: ${term.definition}`;
      }
    }
    const section = sectionNames[location.pathname];
    if (section) {
      return `Пользователь находится в разделе «${section}»`;
    }
    return undefined;
  }, [location.pathname]);
}

export function AiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(loadMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const pageContext = usePageContext();
  const isNearBottomRef = useRef(true);
  const dragControls = useDragControls();
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  const sendRef = useRef<(() => void) | null>(null);

  useEffect(() => { saveMessages(messages); }, [messages]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (isNearBottomRef.current) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const threshold = 100;
    isNearBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Listen for global open-ai-chat event
  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ question?: string }>;
      setOpen(true);
      if (custom.detail?.question) {
        setInput(custom.detail.question);
        setTimeout(() => sendRef.current?.(), 300);
      }
    };
    window.addEventListener('open-ai-chat', handler);
    return () => window.removeEventListener('open-ai-chat', handler);
  }, []);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

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
        context: pageContext,
      });
    } catch (e: unknown) {
      if (e instanceof Error && e.name !== 'AbortError') {
        toast({ title: 'Ошибка', description: e.message, variant: 'destructive' });
      }
      setIsLoading(false);
    }
  }, [input, isLoading, pageContext]);

  sendRef.current = send;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const quickActions = [
    { label: 'Объясни проще', icon: Lightbulb, text: 'Объясни проще, как для ребёнка' },
    { label: 'Аналогия', icon: HelpCircle, text: 'Приведи жизненную аналогию' },
    { label: 'Разбери по частям', icon: RotateCcw, text: 'Разбери по частям' },
  ];

  return (
    <>
      {!open && (
        <motion.button
          onClick={() => setOpen(true)}
          className="fixed top-20 md:top-20 left-6 z-50 h-[72px] w-[72px] rounded-full bg-gradient-to-br from-primary to-violet-600 text-primary-foreground shadow-fab flex flex-col items-center justify-center gap-0.5 no-print border-2 border-white dark:border-slate-800"
          aria-label="Открыть AI-чат"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(99, 102, 241, 0.4)',
              '0 0 0 20px rgba(99, 102, 241, 0)',
              '0 0 0 0 rgba(99, 102, 241, 0)',
            ],
          }}
          transition={{
            boxShadow: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
          }}
        >
          <Sparkles className="h-6 w-6" />
          <span className="text-[10px] font-bold leading-none">AI</span>
          <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-background">
            1
          </span>
        </motion.button>
      )}

      {open && (
        <motion.div
          drag
          dragControls={dragControls}
          dragMomentum={false}
          dragElastic={0}
          dragListener={false}
          initial={{ x: 0, y: 0 }}
          className="fixed top-20 md:top-20 left-4 md:left-6 z-50 w-[calc(100vw-2rem)] md:w-[420px] h-[500px] md:h-[560px] rounded-2xl border bg-card shadow-2xl flex flex-col overflow-hidden no-print"
        >
          <div
            onPointerDown={(e) => dragControls.start(e)}
            className="flex items-center gap-3 px-4 py-3 border-b bg-primary/5 cursor-grab active:cursor-grabbing"
          >
            <GripHorizontal className="h-4 w-4 text-muted-foreground/50 shrink-0" />
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">AI-ассистент</p>
              <p className="text-[10px] text-muted-foreground truncate">
                {pageContext ? `📍 ${pageContext.slice(0, 60)}…` : 'Спросите о терминах, технологиях, процессах'}
              </p>
            </div>
            {messages.length > 0 && (
              <button
                onClick={() => setMessages([])}
                className="p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                aria-label="Очистить историю"
                title="Очистить историю"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-full hover:bg-secondary transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-6 w-6 text-primary opacity-60" />
                </div>
                <div>
                  <p className="font-medium text-sm">Привет! Я AI-помощник</p>
                  <p className="text-xs mt-1">Задайте вопрос по IT — объясню термин, процесс или технологию</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                  {['Что такое API?', 'Чем занимается тестировщик?', 'Объясни CI/CD'].map(q => (
                    <button
                      key={q}
                      onClick={() => setInput(q)}
                      className="text-xs px-3 py-1.5 rounded-full border bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="shrink-0 w-7 h-7 rounded-full bg-white dark:bg-slate-800 border flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-2.5 text-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-primary to-primary-600 text-primary-foreground rounded-2xl rounded-tr-sm'
                      : 'bg-white dark:bg-slate-800 border rounded-2xl rounded-tl-sm'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_code]:text-xs [&_code]:bg-muted [&_code]:px-1 [&_code]:rounded">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                  {msg.timestamp && (
                    <span className={`text-[10px] opacity-60 mt-1 block ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="shrink-0 w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="flex gap-2 items-center">
                <div className="shrink-0 w-7 h-7 rounded-full bg-white dark:bg-slate-800 border flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-white dark:bg-slate-800 border rounded-2xl rounded-tl-md px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}

            {/* Quick actions */}
            {messages.length > 0 && !isLoading && messages[messages.length - 1]?.role === 'assistant' && (
              <div className="flex flex-wrap gap-2 justify-start pl-9">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => {
                      setInput(action.text);
                      setTimeout(() => send(), 100);
                    }}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <action.icon className="h-3 w-3" />
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <ChatInput
            input={input}
            setInput={setInput}
            onSend={send}
            onKeyDown={handleKeyDown}
            isLoading={isLoading}
            inputRef={inputRef}
          />
        </motion.div>
      )}
    </>
  );
}
