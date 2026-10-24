import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getQuestionById, publishAnswer } from '../lib/api';
import Skeleton from '../components/Skeleton';
import { useToast } from '../hooks/useToast';
import type { Question } from '../types';

export default function Answer() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const { toast } = useToast();
  const [question, setQuestion] = useState<Question | null>(null);
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getQuestionById(id)
      .then(setQuestion)
      .catch(() => toast('السؤال غير موجود', 'error'))
      .finally(() => setLoading(false));
  }, [id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !content.trim()) return;
    setSaving(true);
    try {
      await publishAnswer(id, content, isPublic);
      toast('نُشرت إجابتك.', 'success');
      nav('/inbox');
    } catch (e: any) {
      toast(e?.message ?? 'فشل النشر', 'error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="max-w-2xl mx-auto p-6"><Skeleton className="h-64" /></div>;
  if (!question) return null;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <div className="card bg-primary-soft border-primary/20">
        <div className="text-caption text-primary mb-1">سؤال</div>
        <p className="whitespace-pre-wrap">{question.content}</p>
      </div>

      <form onSubmit={submit} className="card space-y-4">
        <h2 className="text-h3 font-medium">إجابتك</h2>
        <textarea
          className="input min-h-[180px] py-3 resize-none"
          maxLength={2000}
          placeholder="اكتب إجابتك…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <div className="text-caption text-text-secondary text-left">{content.length}/2000</div>

        <label className="flex items-center gap-2 text-body-sm">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
          انشر في العلن
        </label>

        <div className="flex gap-2">
          <button className="btn-primary" disabled={saving || !content.trim()}>
            {saving ? '...' : 'انشر الإجابة'}
          </button>
          <button type="button" className="btn-ghost" onClick={() => nav('/inbox')}>إلغاء</button>
        </div>
      </form>
    </div>
  );
}
