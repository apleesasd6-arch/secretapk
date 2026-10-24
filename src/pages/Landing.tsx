import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Landing() {
  const { user, profile } = useAuth();
  return (
    <div className="max-w-public mx-auto px-6 py-16">
      <section className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-5xl font-bold text-primary mb-4">سِرّ</h1>
        <p className="text-h2 mb-2">سؤالك… بلا اسم.</p>
        <p className="text-text-secondary mb-8">Ask freely. Answer safely.</p>
        {user ? (
          <div className="flex gap-3 justify-center">
            <Link to="/inbox" className="btn-primary">صندوقك</Link>
            {profile && (
              <Link to={`/u/${profile.username}`} className="btn-secondary">
                sirr.app/u/{profile.username}
              </Link>
            )}
          </div>
        ) : (
          <div className="flex gap-3 justify-center">
            <Link to="/signup" className="btn-primary">أنشئ رابطك</Link>
            <Link to="/feed" className="btn-ghost">تصفّح العلن</Link>
          </div>
        )}
      </section>

      <section className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {[
          { n: '1', t: 'شارك رابطك', d: 'ضع رابطك في البايو أو الستوري.' },
          { n: '2', t: 'استقبل أسئلة', d: 'بدون أسماء. بدون حسابات.' },
          { n: '3', t: 'أجب بأمان', d: 'انشر أو احتفظ. أنت تختار.' },
        ].map((s) => (
          <div key={s.n} className="card">
            <div className="text-primary font-bold text-h2 mb-2">{s.n}</div>
            <h3 className="font-medium mb-1">{s.t}</h3>
            <p className="text-body-sm text-text-secondary">{s.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
