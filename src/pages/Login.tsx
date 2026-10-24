import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation() as { state?: { from?: string } };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    nav(loc.state?.from ?? '/inbox', { replace: true });
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] grid place-items-center p-6">
      <form onSubmit={submit} className="card w-full max-w-md space-y-4">
        <h1 className="text-h1 font-bold text-center text-primary">سِرّ</h1>
        {error && <div className="p-3 rounded-sm bg-danger/10 text-danger text-body-sm">{error}</div>}
        <input className="input" type="email" placeholder="البريد" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn-primary w-full" disabled={loading}>{loading ? '...' : 'دخول'}</button>
        <p className="text-center text-body-sm text-text-secondary">
          جديد؟ <Link to="/signup" className="text-primary">سجّل</Link>
        </p>
      </form>
    </div>
  );
}
