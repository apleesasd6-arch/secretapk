import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProfileByUsername, sendQuestion } from '../lib/api';
import { supabase } from '../lib/supabase';

export default function Ask() {
  const { username } = useParams<{ username: string }>();
  const nav = useNavigate();
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !content.trim()) return;
    setSending(true);
    setError('');
    try {
      const profile = await getProfileByUsername(username);
      const { data: { user } } = await supabase.auth.getUser();
      await sendQuestion(profile.id, content, user?.id);
      setSent(true);
      setContent('');
    } catch (e: any) {
      setError(e?.message ?? 'تعذّر الإرسال الآن. جرّب صياغة أخرى.');
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="min-h-[calc(100vh-4rem)] grid place-items-center p-6">
        <div className="card max-w-md text-center space-y-3">
          <div className="text-5xl">✉️</div>
          <h2 className="text-h2 font-semibold">سؤالك وصل بأمان.</h2>
          <p className="text-body-sm text-text-secondary">لن نكشف اسمك لأحد.</p>
          <div className="flex gap-2 justify-center pt-2">
            <button className="btn-ghost" onClick={() => nav(`/u/${username}`)}>رجوع</button>
            <button className="btn-primary" onClick={() => setSent(false)}>أرسل آخر</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] grid place-items-center p-6">
      <form onSubmit={submit} className="card w-full max-w-md space-y-4">
        <h1 className="text-h2 font-semibold text-center">اسأل @{username}</h1>
        <p className="text-caption text-text-secondary text-center">🔒 لن نكشف اسمك لأحد.</p>
        <textarea
          className="input min-h-[140px] py-3 resize-none"
          maxLength={500}
          placeholder="اكتب سؤالك هنا…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <div className="text-caption text-text-secondary text-left">{content.length}/500</div>
        {error && <div className="p-3 rounded-sm bg-danger/10 text-danger text-body-sm">{error}</div>}
        <button className="btn-primary w-full" disabled={sending || !content.trim()}>
          {sending ? '...' : 'أرسل'}
        </button>
      </form>
    </div>
  );
}
