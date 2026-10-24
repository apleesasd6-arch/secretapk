import { NavLink, Outlet } from 'react-router-dom';

const link = ({ isActive }: { isActive: boolean }) =>
  `block px-4 py-2 rounded-sm text-body-sm transition-colors ${
    isActive ? 'bg-primary-soft text-primary font-medium' : 'text-text-secondary hover:bg-border/40'
  }`;

export default function AdminLayout() {
  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr] bg-bg">
      <aside className="border-e border-border bg-surface p-4 sticky top-0 h-screen">
        <div className="font-bold text-primary text-h3 mb-6 px-2">سِرّ · الإدارة</div>
        <nav className="space-y-1">
          <NavLink to="/admin/dashboard" className={link}>لوحة القيادة</NavLink>
          <NavLink to="/admin/users" className={link}>المستخدمون</NavLink>
          <NavLink to="/admin/reports" className={link}>البلاغات</NavLink>
          <NavLink to="/" end className={link}>← العودة للموقع</NavLink>
        </nav>
      </aside>
      <main className="p-8 max-w-admin mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}
