import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Signup() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
    setLoading(false);
    if (error) return setError(error.message);
    if (data.user) nav('/inbox');
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] grid place-items-center p-6">
      <form onSubmit={submit} className="card w-full max-w-md space-y-4">
        <h1 className="text-h1 font-bold text-center text-primary">سِرّ</h1>
        <p className="text-center text-text-secondary text-body-sm">سؤالك… بلا اسم.</p>

        {error && <div className="p-3 rounded-sm bg-danger/10 text-danger text-body-sm">{error}</div>}

        <div>
          <label className="block text-body-sm mb-1">اسم المستخدم</label>
          <input
            className="input"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
            required
            minLength={3}
            maxLength={20}
          />
          <p className="text-caption text-text-secondary mt-1">sirr.app/u/{username || '…'}</p>
        </div>

        <div>
          <label className="block text-body-sm mb-1">البريد الإلكتروني</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div>
          <label className="block text-body-sm mb-1">كلمة المرور (8+)</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
        </div>

        <button className="btn-primary w-full" disabled={loading}>
          {loading ? '...' : 'أنشئ رابطك'}
        </button>

        <p className="text-center text-body-sm text-text-secondary">
          لديك حساب؟ <Link to="/login" className="text-primary">دخول</Link>
        </p>
      </form>
    </div>
  );
}
