import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Workflow, BrainCircuit, Briefcase, Layers, Zap, Mic, MicOff, Search } from 'lucide-react';
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
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  const queryLower = query.toLowerCase();
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === queryLower ? (
          <mark key={i} className="bg-primary/25 text-foreground rounded-sm px-0.5">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

// Check if browser supports Speech Recognition
interface WindowWithSpeech extends Window {
  SpeechRecognition?: new () => SpeechRecognition;
  webkitSpeechRecognition?: new () => SpeechRecognition;
}

const SpeechRecognition = ((window as WindowWithSpeech).SpeechRecognition || (window as WindowWithSpeech).webkitSpeechRecognition);

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
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

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      setQuery(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
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

  const queryLower = query.trim().toLowerCase();

  const filteredTerms = queryLower
    ? terms.filter((t) => t.title.toLowerCase().includes(queryLower))
    : terms;
  const filteredSpecialties = queryLower
    ? specialties.filter((s) => s.title.toLowerCase().includes(queryLower))
    : specialties;
  const filteredPrototypes = queryLower
    ? prototypes.filter((p) => p.title.toLowerCase().includes(queryLower))
    : prototypes;
  const filteredFeatures = queryLower
    ? features.filter((f) => f.title.toLowerCase().includes(queryLower))
    : features;
  const filteredProcesses = queryLower
    ? processes.filter((p) => p.title.toLowerCase().includes(queryLower))
    : processes;
  const filteredQuizzes = queryLower
    ? quizzes.filter((q) => q.title.toLowerCase().includes(queryLower))
    : quizzes;

  const hasAnyResults =
    filteredTerms.length > 0 ||
    filteredSpecialties.length > 0 ||
    filteredPrototypes.length > 0 ||
    filteredFeatures.length > 0 ||
    filteredProcesses.length > 0 ||
    filteredQuizzes.length > 0;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full border border-border bg-secondary/50 transition-colors max-w-xs focus:max-w-sm"
        aria-label="Открыть поиск"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Поиск...</span>
        <kbd className="hidden sm:inline pointer-events-none text-xs bg-muted px-1.5 py-0.5 rounded-md font-mono">⌘K</kbd>
      </button>

      <CommandDialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setQuery(''); }}>
        <div className="relative">
          <CommandInput
            placeholder="Искать термины, процессы, квизы..."
            onValueChange={setQuery}
            value={query}
          />
          {SpeechRecognition && (
            <button
              onClick={toggleVoice}
              aria-label={isListening ? 'Остановить голосовой поиск' : 'Голосовой поиск'}
              className={`absolute right-3 top-1/2 -translate-y-1/2 shrink-0 p-1.5 rounded-md transition-colors ${
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
          {!hasAnyResults && <CommandEmpty>Ничего не найдено</CommandEmpty>}

          {filteredTerms.length > 0 && (
            <CommandGroup heading="Термины">
              {filteredTerms.map((t) => (
                <CommandItem key={t.id} onSelect={() => go(`/term/${t.id}`)} value={t.title}>
                  <Book className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span><Highlight text={t.title} query={query} /></span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {filteredSpecialties.length > 0 && (
            <CommandGroup heading="Специальности">
              {filteredSpecialties.map((s) => (
                <CommandItem key={s.id} onSelect={() => go('/specialties')} value={s.title} keywords={[s.title, s.description]}>
                  <Briefcase className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span><Highlight text={s.title} query={query} /></span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {filteredPrototypes.length > 0 && (
            <CommandGroup heading="Проекты">
              {filteredPrototypes.map((p) => (
                <CommandItem key={p.id} onSelect={() => go('/prototypes')} value={p.title} keywords={[p.title, p.description]}>
                  <Layers className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span><Highlight text={p.title} query={query} /></span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {filteredFeatures.length > 0 && (
            <CommandGroup heading="Фичи">
              {filteredFeatures.map((f) => (
                <CommandItem key={f.id} onSelect={() => go('/features')} value={f.title} keywords={[f.title, f.description]}>
                  <Zap className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span><Highlight text={f.title} query={query} /></span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {filteredProcesses.length > 0 && (
            <CommandGroup heading="Процессы">
              {filteredProcesses.map((p) => (
                <CommandItem key={p.id} onSelect={() => go('/processes')} value={p.title} keywords={[p.title, p.description]}>
                  <Workflow className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span><Highlight text={p.title} query={query} /></span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {filteredQuizzes.length > 0 && (
            <CommandGroup heading="Квизы">
              {filteredQuizzes.map((q) => (
                <CommandItem key={q.id} onSelect={() => go('/quizzes')} value={q.title} keywords={[q.title]}>
                  <BrainCircuit className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span><Highlight text={q.title} query={query} /></span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
