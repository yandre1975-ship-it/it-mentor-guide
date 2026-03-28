import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { PrototypeZone } from '@/data/prototypes';
import { layerConfig } from '@/data/prototypes';
import { specialties } from '@/data/specialties';
import { ChevronRight, Package, User, Wrench } from 'lucide-react';

const zoneComplexity = {
  low: { label: 'Просто', icon: '🟢' },
  medium: { label: 'Средне', icon: '🟡' },
  high: { label: 'Сложно', icon: '🔴' },
};

export function MobileZoneList({ zones, activeZone, onSelect }: {
  zones: PrototypeZone[];
  activeZone: string | null;
  onSelect: (id: string | null) => void;
}) {
  // Group by layer
  const grouped = useMemo(() => {
    const map = new Map<string, PrototypeZone[]>();
    zones.forEach(z => {
      const layer = z.layer || 'frontend';
      if (!map.has(layer)) map.set(layer, []);
      map.get(layer)!.push(z);
    });
    return map;
  }, [zones]);

  return (
    <div className="space-y-3 md:hidden">
      {Array.from(grouped.entries()).map(([layer, layerZones]) => {
        const cfg = layerConfig[layer as keyof typeof layerConfig];
        return (
          <div key={layer}>
            <div className="flex items-center gap-1.5 mb-1.5 px-1">
              <span className="text-xs">{cfg?.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{cfg?.label}</span>
            </div>
            <Accordion type="single" collapsible value={activeZone || undefined} onValueChange={(v) => onSelect(v || null)}>
              {layerZones.map(zone => {
                const specs = specialties.filter(s => zone.specialists.includes(s.id));
                return (
                  <AccordionItem key={zone.id} value={zone.id} className="border rounded-lg mb-1.5 overflow-hidden">
                    <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-muted/30 text-sm [&[data-state=open]]:bg-primary/5">
                      <div className="flex items-center gap-2 text-left flex-1 min-w-0">
                        <span className="text-xs shrink-0">
                          {zone.complexity ? zoneComplexity[zone.complexity]?.icon : '⚪'}
                        </span>
                        <span className="font-medium truncate">{zone.label}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-3 space-y-2">
                      <p className="text-xs text-muted-foreground">{zone.description}</p>
                      
                      {zone.elements && (
                        <div className="flex flex-wrap gap-1">
                          {zone.elements.slice(0, 4).map(el => (
                            <Badge key={el} variant="secondary" className="text-[10px]">{el}</Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1">
                        {specs.map(s => (
                          <Badge key={s.id} className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                            {s.title}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {zone.tools.slice(0, 4).map(t => (
                          <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        );
      })}
    </div>
  );
}
