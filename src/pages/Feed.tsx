import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPublicFeed, toggleLike } from '../lib/api';
import EmptyState from '../components/EmptyState';
import Skeleton from '../components/Skeleton';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import type { Answer, Profile } from '../types';

type FeedItem = Answer & {
  question: { content: string };
  author: Pick<Profile, 'username' | 'display_name' | 'avatar_url'>;
};

export default function Feed() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicFeed()
      .then(setItems)
      .catch((e) => toast(e?.message ?? 'فشل التحميل', 'error'))
      .finally(() => setLoading(false));
  }, []);

  async function onLike(id: string) {
    if (!user) {
      toast('سجّل الدخول أولًا', 'info');
      return;
    }
    try {
      await toggleLike(id);
      setItems((prev) =>
        prev.map((a) => (a.id === id ? { ...a, likes_count: a.likes_count + 1 } : a))
      );
    } catch (e: any) {
      toast(e?.message ?? 'فشل الإعجاب', 'error');
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-h1 font-bold mb-4">العلن</h1>

      {loading && <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-40" />)}</div>}

      {!loading && items.length === 0 && (
        <EmptyState icon="🌱" title="لا إجابات علنية بعد." description="كن أول من ينشر." />
      )}

      <ul className="space-y-4">
        {items.map((a) => (
          <li key={a.id} className="card animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-full bg-primary-soft text-primary grid place-items-center font-bold text-sm">
                {a.author.display_name?.[0] ?? a.author.username[0].toUpperCase()}
              </div>
              <Link to={`/u/${a.author.username}`} className="font-medium text-body-sm hover:text-primary">
                @{a.author.username}
              </Link>
              <span className="text-caption text-text-secondary ms-auto">
                {new Date(a.created_at).toLocaleString('ar')}
              </span>
            </div>

            <p className="text-body-sm text-text-secondary italic border-s-2 border-primary/30 ps-3 mb-3">
              {a.question.content}
            </p>

            <p className="whitespace-pre-wrap mb-3">{a.content}</p>

            <div className="flex gap-3 text-body-sm text-text-secondary">
              <button onClick={() => onLike(a.id)} className="hover:text-primary">
                ♡ {a.likes_count}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
