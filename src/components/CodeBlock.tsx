import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const lines = code.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-xl overflow-hidden bg-[#1e1e2e] border border-white/5 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#181825] border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-xs font-mono text-muted-foreground uppercase ml-2">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Скопировано' : 'Копировать'}
        </button>
      </div>

      {/* Code with line numbers */}
      <div className="flex overflow-x-auto">
        <div className="py-4 pl-4 pr-3 text-right select-none border-r border-white/5 bg-[#181825]/50">
          {lines.map((_, i) => (
            <div key={i} className="text-xs text-slate-500 font-mono leading-6">
              {i + 1}
            </div>
          ))}
        </div>
        <pre className="flex-1 p-4 overflow-x-auto">
          <code className="font-mono text-sm leading-6 text-slate-200">
            {lines.map((line, i) => (
              <div key={i}>
                {line || ' '}
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
