import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Mic, MicOff, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

type Msg = { role: 'user' | 'assistant'; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

async function streamChat({
  messages,
  onDelta,
  onDone,
  signal,
}: {
  messages: Msg[];
  onDelta: (text: string) => void;
  onDone: () => void;
  signal?: AbortSignal;
}) {
  const resp = await fetch(CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
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
  const recRef = useRef<any>(null);

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
    rec.onresult = (e: any) => {
      const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join('');
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
        <div className="flex items-center gap-2 px-2 pb-2 text-xs text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive" />
          </span>
          Говорите...
        </div>
      )}
      <div className="flex items-end gap-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Задайте вопрос..."
          rows={1}
          className="flex-1 resize-none rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground max-h-24"
          style={{ minHeight: '40px' }}
        />
        {SpeechRecognition && (
          <button
            onClick={toggleVoice}
            aria-label={listening ? 'Остановить запись' : 'Голосовой ввод'}
            className={`shrink-0 h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${
              listening
                ? 'bg-destructive/10 text-destructive animate-pulse'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary border'
            }`}
          >
            {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
        )}
        <Button
          size="icon"
          onClick={onSend}
          disabled={!input.trim() || isLoading}
          className="shrink-0 h-10 w-10 rounded-xl"
        >
          <Send className="h-4 w-4" />
        </Button>
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
  try { localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(msgs)); } catch {}
}

export function AiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(loadMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => { saveMessages(messages); }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Msg = { role: 'user', content: text };
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
        return [...prev, { role: 'assistant', content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        onDelta: upsert,
        onDone: () => setIsLoading(false),
        signal: controller.signal,
      });
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        toast({ title: 'Ошибка', description: e.message, variant: 'destructive' });
      }
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center no-print"
          aria-label="Открыть AI-чат"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] md:w-[420px] h-[500px] md:h-[560px] rounded-2xl border bg-card shadow-2xl flex flex-col overflow-hidden no-print animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="flex items-center gap-3 px-4 py-3 border-b bg-primary/5">
            <Bot className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-semibold">AI-ассистент</p>
              <p className="text-xs text-muted-foreground">Спросите о терминах, технологиях, процессах</p>
            </div>
            {messages.length > 0 && (
              <button
                onClick={() => setMessages([])}
                className="p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                aria-label="Очистить историю"
                title="Очистить историю"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button onClick={() => setOpen(false)} className="p-1 rounded-md hover:bg-secondary transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-3">
                <Bot className="h-10 w-10 opacity-40" />
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
                  <div className="shrink-0 h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-secondary rounded-bl-md'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_code]:text-xs [&_code]:bg-muted [&_code]:px-1 [&_code]:rounded">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="shrink-0 h-7 w-7 rounded-full bg-primary flex items-center justify-center mt-0.5">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="flex gap-2 items-center">
                <div className="shrink-0 h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
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
        </div>
      )}
    </>
  );
}
