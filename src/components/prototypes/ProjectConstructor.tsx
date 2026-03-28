import { useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Save, X } from 'lucide-react';
import type { PrototypeZone, ProjectPrototype, ZoneLayer } from '@/data/prototypes';
import { layerConfig } from '@/data/prototypes';

const CONSTRUCTOR_KEY = 'prototype-constructor';

interface CustomProject {
  title: string;
  description: string;
  zones: Array<{
    id: string;
    label: string;
    description: string;
    layer: ZoneLayer;
    tools: string[];
    complexity: 'low' | 'medium' | 'high';
  }>;
}

function loadCustomProjects(): CustomProject[] {
  try {
    const raw = localStorage.getItem(CONSTRUCTOR_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCustomProjects(projects: CustomProject[]) {
  localStorage.setItem(CONSTRUCTOR_KEY, JSON.stringify(projects));
}

export function ProjectConstructor({ onClose }: { onClose: () => void }) {
  const [projects, setProjects] = useState(loadCustomProjects);
  const [editing, setEditing] = useState<CustomProject>({
    title: '',
    description: '',
    zones: [],
  });
  const [toolInput, setToolInput] = useState<Record<string, string>>({});

  const addZone = () => {
    setEditing(prev => ({
      ...prev,
      zones: [...prev.zones, {
        id: `zone-${Date.now()}`,
        label: '',
        description: '',
        layer: 'frontend',
        tools: [],
        complexity: 'medium',
      }],
    }));
  };

  const updateZone = (index: number, field: string, value: string) => {
    setEditing(prev => ({
      ...prev,
      zones: prev.zones.map((z, i) => i === index ? { ...z, [field]: value } : z),
    }));
  };

  const removeZone = (index: number) => {
    setEditing(prev => ({
      ...prev,
      zones: prev.zones.filter((_, i) => i !== index),
    }));
  };

  const addTool = (index: number) => {
    const tool = toolInput[index]?.trim();
    if (!tool) return;
    setEditing(prev => ({
      ...prev,
      zones: prev.zones.map((z, i) => i === index ? { ...z, tools: [...z.tools, tool] } : z),
    }));
    setToolInput(prev => ({ ...prev, [index]: '' }));
  };

  const removeTool = (zoneIndex: number, toolIndex: number) => {
    setEditing(prev => ({
      ...prev,
      zones: prev.zones.map((z, i) => i === zoneIndex ? { ...z, tools: z.tools.filter((_, ti) => ti !== toolIndex) } : z),
    }));
  };

  const save = () => {
    if (!editing.title.trim() || editing.zones.length === 0) return;
    const updated = [...projects, editing];
    setProjects(updated);
    saveCustomProjects(updated);
    setEditing({ title: '', description: '', zones: [] });
  };

  const deleteProject = (index: number) => {
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
    saveCustomProjects(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Конструктор проектов</h2>
        <button onClick={onClose} className="p-1 rounded-md hover:bg-secondary"><X className="h-4 w-4" /></button>
      </div>

      {/* Saved projects */}
      {projects.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-semibold text-muted-foreground">Сохранённые проекты:</span>
          {projects.map((p, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border px-3 py-2">
              <div>
                <span className="text-sm font-medium">{p.title}</span>
                <span className="text-xs text-muted-foreground ml-2">({p.zones.length} блоков)</span>
              </div>
              <button onClick={() => deleteProject(i)} className="p-1 hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
            </div>
          ))}
        </div>
      )}

      {/* Editor */}
      <Card className="p-4 space-y-3">
        <div className="space-y-2">
          <Input
            placeholder="Название проекта"
            value={editing.title}
            onChange={e => setEditing(p => ({ ...p, title: e.target.value }))}
            className="h-9"
          />
          <Input
            placeholder="Описание"
            value={editing.description}
            onChange={e => setEditing(p => ({ ...p, description: e.target.value }))}
            className="h-9"
          />
        </div>

        {/* Zones */}
        <div className="space-y-2">
          {editing.zones.map((zone, i) => (
            <div key={zone.id} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Название блока"
                  value={zone.label}
                  onChange={e => updateZone(i, 'label', e.target.value)}
                  className="h-8 text-xs flex-1"
                />
                <select
                  value={zone.layer}
                  onChange={e => updateZone(i, 'layer', e.target.value)}
                  className="h-8 text-xs rounded-md border bg-background px-2"
                >
                  {Object.entries(layerConfig).map(([key, cfg]) => (
                    <option key={key} value={key}>{cfg.icon} {cfg.label}</option>
                  ))}
                </select>
                <select
                  value={zone.complexity}
                  onChange={e => updateZone(i, 'complexity', e.target.value)}
                  className="h-8 text-xs rounded-md border bg-background px-2"
                >
                  <option value="low">🟢 Просто</option>
                  <option value="medium">🟡 Средне</option>
                  <option value="high">🔴 Сложно</option>
                </select>
                <button onClick={() => removeZone(i)} className="p-1 hover:text-destructive shrink-0">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
              <Input
                placeholder="Описание блока"
                value={zone.description}
                onChange={e => updateZone(i, 'description', e.target.value)}
                className="h-8 text-xs"
              />
              <div className="flex items-center gap-1 flex-wrap">
                {zone.tools.map((t, ti) => (
                  <Badge key={ti} variant="outline" className="text-[10px] gap-0.5 pr-1">
                    {t}
                    <button onClick={() => removeTool(i, ti)} className="ml-0.5 hover:text-destructive">×</button>
                  </Badge>
                ))}
                <div className="flex items-center gap-1">
                  <Input
                    placeholder="Инструмент"
                    value={toolInput[i] || ''}
                    onChange={e => setToolInput(p => ({ ...p, [i]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && addTool(i)}
                    className="h-6 text-[10px] w-24"
                  />
                  <button onClick={() => addTool(i)} className="text-[10px] text-primary hover:underline">+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={addZone} className="text-xs gap-1">
            <Plus className="h-3 w-3" /> Добавить блок
          </Button>
          <Button size="sm" onClick={save} disabled={!editing.title.trim() || editing.zones.length === 0} className="text-xs gap-1">
            <Save className="h-3 w-3" /> Сохранить
          </Button>
        </div>
      </Card>
    </div>
  );
}
