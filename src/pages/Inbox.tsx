import { useEffect, useState } from 'react';
import { deleteQuestion, getMyInbox } from '../lib/api';
import QuestionCard from '../components/QuestionCard';
import EmptyState from '../components/EmptyState';
import Skeleton from '../components/Skeleton';
import { useToast } from '../hooks/useToast';
import type { Question } from '../types';

const TABS = [
  { key: 'new', label: 'جديد' },
  { key: 'answered', label: 'تمت الإجابة' },
  { key: 'deleted', label: 'محذوف' },
] as const;

export default function Inbox() {
  const { toast } = useToast();
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('new');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setQuestions(await getMyInbox(tab));
    } catch (e: any) {
      toast(e?.message ?? 'فشل التحميل', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [tab]);

  async function onDelete(id: string) {
    if (!confirm('احذف هذا السؤال؟')) return;
    try {
      await deleteQuestion(id);
      toast('تم الحذف', 'success');
      load();
    } catch (e: any) {
      toast(e?.message ?? 'فشل الحذف', 'error');
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-h1 font-bold mb-4">صندوقك</h1>

      <div className="flex gap-1 mb-4 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-body-sm transition-colors ${
              tab === t.key
                ? 'text-primary border-b-2 border-primary font-medium'
                : 'text-text-secondary hover:text-text'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28" />)}
        </div>
      )}

      {!loading && questions.length === 0 && (
        <EmptyState
          title="لا أسئلة هنا بعد."
          description="شارك رابطك لتبدأ باستقبال الأسئلة."
        />
      )}

      <ul className="space-y-3">
        {questions.map((q) => (
          <li key={q.id}>
            <QuestionCard question={q} onDelete={onDelete} />
          </li>
        ))}
      </ul>
    </div>
  );
}
