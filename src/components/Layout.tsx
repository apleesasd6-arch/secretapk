import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="text-center text-caption text-text-secondary py-6 border-t border-border">
        © {new Date().getFullYear()} سِرّ — سؤالك… بلا اسم.
      </footer>
    </div>
  );
}
