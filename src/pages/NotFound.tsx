import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] grid place-items-center p-6 text-center">
      <div>
        <div className="text-[8rem] font-bold text-primary/10 leading-none">404</div>
        <h1 className="text-h2 font-semibold mb-2">الصفحة غير موجودة</h1>
        <p className="text-body-sm text-text-secondary mb-6">ربما الرابط قديم أو خاطئ.</p>
        <Link to="/" className="btn-primary">الرئيسية</Link>
      </div>
    </div>
  );
}
