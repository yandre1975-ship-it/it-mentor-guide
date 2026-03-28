import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { prototypes } from '@/data/prototypes';
import { terms } from '@/data/terms';
import { specialties } from '@/data/specialties';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Layers, User, Wrench, BookOpen, X } from 'lucide-react';
import type { PrototypeZone } from '@/data/prototypes';

function ZoneDetail({ zone, onClose }: { zone: PrototypeZone; onClose: () => void }) {
  const relatedTerms = terms.filter((t) => zone.terms.includes(t.id));
  const relatedSpecs = specialties.filter((s) => zone.specialists.includes(s.id));

  return (
    <div className="rounded-lg border bg-card p-4 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-bold text-base">{zone.label}</h4>
          <p className="text-sm text-muted-foreground mt-1">{zone.description}</p>
        </div>
        <button onClick={onClose} className="shrink-0 p-1 rounded hover:bg-secondary">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Specialists */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <User className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Кто делает</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {relatedSpecs.map((s) => (
            <Badge key={s.id} className="bg-primary/10 text-primary border-primary/20 text-xs">
              {s.title}
            </Badge>
          ))}
        </div>
      </div>

      {/* Terms */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Какие термины нужны</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {relatedTerms.map((t) => (
            <Link key={t.id} to={`/term/${t.id}`}>
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs">
                {t.title}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Tools */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Wrench className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Инструменты</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {zone.tools.map((tool) => (
            <Badge key={tool} variant="outline" className="text-xs">
              {tool}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

function PrototypeVisual({ zones, activeZone, onSelect }: {
  zones: PrototypeZone[];
  activeZone: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <div className="relative w-full rounded-lg border bg-muted/30 overflow-hidden" style={{ paddingBottom: '60%' }}>
      {zones.map((zone) => {
        const isActive = activeZone === zone.id;
        return (
          <button
            key={zone.id}
            onClick={() => onSelect(isActive ? null : zone.id)}
            className={`absolute border-2 rounded-md transition-all duration-200 flex items-center justify-center text-xs sm:text-sm font-medium px-1 hover:scale-[1.02] ${zone.color} ${
              isActive
                ? 'bg-primary/15 shadow-md ring-2 ring-primary/30 z-10'
                : 'bg-background/80 hover:bg-background/95'
            }`}
            style={{
              left: `${zone.x + 1}%`,
              top: `${zone.y + 1}%`,
              width: `${zone.width - 2}%`,
              height: `${zone.height - 2}%`,
            }}
          >
            <span className="truncate px-1">{zone.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function Prototypes() {
  const [selectedPrototype, setSelectedPrototype] = useState(prototypes[0].id);
  const [activeZone, setActiveZone] = useState<string | null>(null);

  const current = prototypes.find((p) => p.id === selectedPrototype)!;
  const currentZone = current.zones.find((z) => z.id === activeZone);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Схемы проектов</h1>
          <p className="text-muted-foreground mt-1">
            Нажимайте на блоки, чтобы узнать: кто за что отвечает, какие термины нужны и какие инструменты используются
          </p>
        </div>

        {/* Project selector */}
        <div className="flex flex-wrap gap-2">
          {prototypes.map((p) => (
            <button
              key={p.id}
              onClick={() => { setSelectedPrototype(p.id); setActiveZone(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                selectedPrototype === p.id
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-secondary text-secondary-foreground border-border hover:bg-secondary/80'
              }`}
            >
              <span className="mr-1.5">{p.icon}</span>
              {p.title}
            </button>
          ))}
        </div>

        {/* Description */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Layers className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>{current.icon} {current.title}</CardTitle>
                <CardDescription className="mt-1">{current.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Visual + Detail */}
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <PrototypeVisual
              zones={current.zones}
              activeZone={activeZone}
              onSelect={setActiveZone}
            />
          </div>
          <div className="lg:col-span-2">
            {currentZone ? (
              <ZoneDetail zone={currentZone} onClose={() => setActiveZone(null)} />
            ) : (
              <div className="rounded-lg border bg-card p-6 text-center text-muted-foreground h-full flex flex-col items-center justify-center gap-2">
                <Layers className="h-8 w-8 opacity-40" />
                <p className="text-sm">Нажмите на любой блок схемы,<br />чтобы увидеть детали</p>
              </div>
            )}
          </div>
        </div>

        {/* All specialists summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Команда проекта «{current.title}»</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(() => {
                const allSpecIds = [...new Set(current.zones.flatMap((z) => z.specialists))];
                const specs = specialties.filter((s) => allSpecIds.includes(s.id));
                return specs.map((s) => {
                  const zonesCount = current.zones.filter((z) => z.specialists.includes(s.id)).length;
                  return (
                    <Link key={s.id} to="/specialties">
                      <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors py-1.5 px-3">
                        {s.title}
                        <span className="ml-1.5 text-xs opacity-60">({zonesCount} {zonesCount === 1 ? 'зона' : zonesCount < 5 ? 'зоны' : 'зон'})</span>
                      </Badge>
                    </Link>
                  );
                });
              })()}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}