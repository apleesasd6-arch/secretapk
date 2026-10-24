import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const linkBase = 'px-3 py-2 rounded-sm text-body-sm transition-colors';
const linkClass = ({ isActive }: { isActive: boolean }) =>
  `${linkBase} ${isActive ? 'text-primary font-medium bg-primary-soft' : 'text-text-secondary hover:text-text'}`;

export default function Navbar() {
  const { user, profile, signOut, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-[1010] bg-surface/90 backdrop-blur border-b border-border">
      <div className="max-w-public mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-h3 text-primary">
          <span className="inline-grid place-items-center w-8 h-8 rounded-md bg-primary text-white">س</span>
          <span>سِرّ</span>
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink to="/feed" className={linkClass}>العلن</NavLink>
          {user && <NavLink to="/inbox" className={linkClass}>صندوقك</NavLink>}
          {profile && <NavLink to={`/u/${profile.username}`} className={linkClass}>ملفي</NavLink>}
          {isAdmin && <NavLink to="/admin/dashboard" className={linkClass}>الإدارة</NavLink>}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="text-body-sm text-text-secondary hidden sm:inline">
                @{profile?.username ?? '…'}
              </span>
              <button onClick={signOut} className="btn-ghost h-9 text-body-sm">خروج</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost h-9 text-body-sm">دخول</Link>
              <Link to="/signup" className="btn-primary h-9 text-body-sm">سجّل</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
