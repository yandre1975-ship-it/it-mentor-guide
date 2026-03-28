import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Workflow, BrainCircuit, Briefcase, Layers } from 'lucide-react';
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

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
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

  const go = (path: string) => {
    setOpen(false);
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

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Искать термины, процессы, квизы..." />
        <CommandList>
          <CommandEmpty>Ничего не найдено</CommandEmpty>

          <CommandGroup heading="Термины">
            {terms.map((t) => (
              <CommandItem key={t.id} onSelect={() => go(`/term/${t.id}`)}>
                <Book className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{t.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Специальности">
            {specialties.map((s) => (
              <CommandItem key={s.id} onSelect={() => go('/specialties')} keywords={[s.title, s.description]}>
                <Briefcase className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{s.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Проекты">
            {prototypes.map((p) => (
              <CommandItem key={p.id} onSelect={() => go('/prototypes')} keywords={[p.title, p.description]}>
                <Layers className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{p.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Процессы">
            {processes.map((p) => (
              <CommandItem key={p.id} onSelect={() => go('/processes')} keywords={[p.title, p.description]}>
                <Workflow className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{p.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Квизы">
            {quizzes.map((q) => (
              <CommandItem key={q.id} onSelect={() => go('/quizzes')} keywords={[q.title]}>
                <BrainCircuit className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{q.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
