import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle } from 'lucide-react';

interface Comment {
  id: string;
  text: string;
  votes: number;
  createdAt: string;
}

function getInitials(text: string): string {
  const words = text.trim().split(/\s+/);
  if (words.length === 0) return 'А';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function getAvatarColor(text: string): string {
  const colors = [
    'bg-red-500/10 text-red-600',
    'bg-amber-500/10 text-amber-600',
    'bg-emerald-500/10 text-emerald-600',
    'bg-blue-500/10 text-blue-600',
    'bg-violet-500/10 text-violet-600',
    'bg-pink-500/10 text-pink-600',
  ];
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = text.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export function TermComments({ termId }: { termId: string }) {
  const [comments, setComments] = useLocalStorage<Record<string, Comment[]>>(
    'it-library-comments',
    {}
  );
  const [newComment, setNewComment] = useState('');

  const termComments = comments[termId] || [];

  const addComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now().toString(),
      text: newComment.trim(),
      votes: 0,
      createdAt: new Date().toISOString(),
    };
    setComments({ ...comments, [termId]: [...termComments, comment] });
    setNewComment('');
  };

  const vote = (commentId: string) => {
    setComments({
      ...comments,
      [termId]: termComments.map((c) =>
        c.id === commentId ? { ...c, votes: c.votes + 1 } : c
      ),
    });
  };

  return (
    <section className="space-y-5">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-primary" />
        <h2 className="font-heading font-semibold text-lg">Аналогии от сообщества</h2>
        <Badge variant="secondary" className="text-xs">{termComments.length}</Badge>
      </div>

      <div className="space-y-3">
        <Textarea
          placeholder="Поделитесь своей аналогией или примером из жизни..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          className="rounded-xl"
        />
        <div className="flex justify-end">
          <Button size="sm" onClick={addComment} disabled={!newComment.trim()}>
            Добавить
          </Button>
        </div>
      </div>

      {termComments.length > 0 && (
        <div className="space-y-3">
          {termComments
            .sort((a, b) => b.votes - a.votes)
            .map((comment) => (
              <div
                key={comment.id}
                className="rounded-xl bg-secondary/30 p-4 flex items-start gap-3"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${getAvatarColor(comment.text)}`}>
                  {getInitials(comment.text)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed">{comment.text}</p>
                  <p className="text-[10px] text-muted-foreground mt-1.5">
                    {new Date(comment.createdAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                <button
                  onClick={() => vote(comment.id)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition-colors shrink-0"
                >
                  <Heart className="h-3.5 w-3.5" />
                  {comment.votes}
                </button>
              </div>
            ))}
        </div>
      )}
    </section>
  );
}
