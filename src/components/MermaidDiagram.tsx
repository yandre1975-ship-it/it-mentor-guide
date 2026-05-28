import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Skeleton } from '@/components/ui/skeleton';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'loose',
  fontFamily: 'Inter, system-ui, sans-serif',
});

export function MermaidDiagram({ chart, className = '' }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const idRef = useRef(`mermaid-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let mounted = true;
    setLoading(true);

    const isDark = document.documentElement.classList.contains('dark');
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'neutral',
      securityLevel: 'loose',
      fontFamily: 'Inter, system-ui, sans-serif',
    });

    mermaid.render(idRef.current, chart).then(({ svg }) => {
      if (!mounted || !el) return;
      el.innerHTML = svg;
      setError(false);
      setLoading(false);
    }).catch(() => {
      if (!mounted) return;
      setError(true);
      setLoading(false);
    });

    return () => {
      mounted = false;
      el.innerHTML = '';
    };
  }, [chart]);

  if (error) {
    return <div className="p-4 text-destructive text-sm" role="alert">Ошибка отображения диаграммы</div>;
  }

  return (
    <div className={`overflow-x-auto ${className}`} role="img" aria-label="Диаграмма процесса">
      {loading && (
        <div className="space-y-3 p-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      )}
      <div ref={ref} className={loading ? 'hidden' : ''} />
    </div>
  );
}
