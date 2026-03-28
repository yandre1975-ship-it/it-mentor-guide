import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Workflow, BrainCircuit, Briefcase, Layers, Zap, Mic, MicOff } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { terms } from '@/data/terms';
import { processes } from '@/data/processes';
import { quizzes } from '@/data/quizzes';
import { specialties } from '@/data/specialties';
import { prototypes } from '@/data/prototypes';
import { features } from '@/data/features';
import { toast } from '@/hooks/use-toast';

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-primary/25 text-foreground rounded-sm px-0.5">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

// Check if browser supports Speech Recognition
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    if (!SpeechRecognition) {
      toast({
        title: 'Голосовой поиск недоступен',
        description: 'Ваш браузер не поддерживает распознавание речи. Попробуйте Chrome или Edge.',
        variant: 'destructive',
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setQuery(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        toast({
          title: 'Доступ к микрофону запрещён',
          description: 'Разрешите доступ к микрофону в настройках браузера.',
          variant: 'destructive',
        });
      }
      stopListening();
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [stopListening]);

  const toggleVoice = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Stop listening when dialog closes
  useEffect(() => {
    if (!open) {
      stopListening();
    }
  }, [open, stopListening]);

  const go = (path: string) => {
    setOpen(false);
    setQuery('');
    stopListening();
    navigate(path);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md border border-border bg-secondary/50 transition-colors"
      >
        <span>Поиск...</span>
        <kbd className="pointer-events-none text-xs bg-muted px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
      </button>

      <CommandDialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setQuery(''); }}>
        <div className="flex items-center border-b px-3">
          <CommandInput
            placeholder="Искать термины, процессы, квизы..."
            onValueChange={setQuery}
            value={query}
            className="border-0 border-none ring-0 focus:ring-0 focus-visible:ring-0"
          />
          {SpeechRecognition && (
            <button
              onClick={toggleVoice}
              aria-label={isListening ? 'Остановить голосовой поиск' : 'Голосовой поиск'}
              className={`shrink-0 p-2 rounded-md transition-colors ${
                isListening
                  ? 'text-destructive bg-destructive/10 animate-pulse'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          )}
        </div>
        {isListening && (
          <div className="px-4 py-2 text-xs text-muted-foreground bg-muted/50 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
            </span>
            Говорите...
          </div>
        )}
        <CommandList>
          <CommandEmpty>Ничего не найдено</CommandEmpty>

          <CommandGroup heading="Термины">
            {terms.map((t) => (
              <CommandItem key={t.id} onSelect={() => go(`/term/${t.id}`)}>
                <Book className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                <span><Highlight text={t.title} query={query} /></span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Специальности">
            {specialties.map((s) => (
              <CommandItem key={s.id} onSelect={() => go('/specialties')} keywords={[s.title, s.description]}>
                <Briefcase className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                <span><Highlight text={s.title} query={query} /></span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Проекты">
            {prototypes.map((p) => (
              <CommandItem key={p.id} onSelect={() => go('/prototypes')} keywords={[p.title, p.description]}>
                <Layers className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                <span><Highlight text={p.title} query={query} /></span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Фичи">
            {features.map((f) => (
              <CommandItem key={f.id} onSelect={() => go('/features')} keywords={[f.title, f.description]}>
                <Zap className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                <span><Highlight text={f.title} query={query} /></span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Процессы">
            {processes.map((p) => (
              <CommandItem key={p.id} onSelect={() => go('/processes')} keywords={[p.title, p.description]}>
                <Workflow className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                <span><Highlight text={p.title} query={query} /></span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Квизы">
            {quizzes.map((q) => (
              <CommandItem key={q.id} onSelect={() => go('/quizzes')} keywords={[q.title]}>
                <BrainCircuit className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                <span><Highlight text={q.title} query={query} /></span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
