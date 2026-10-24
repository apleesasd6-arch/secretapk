import { useEffect, useState } from 'react';
import { getAllUsers, getReports } from '../../lib/api';
import Skeleton from '../../components/Skeleton';
import type { Profile, Report } from '../../types';

export default function Dashboard() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllUsers(), getReports()])
      .then(([u, r]) => { setUsers(u); setReports(r); })
      .finally(() => setLoading(false));
  }, []);

  const openReports = reports.filter((r) => r.status === 'open').length;

  const stats = [
    { label: 'إجمالي المستخدمين', value: users.length },
    { label: 'بلاغات مفتوحة', value: openReports },
    { label: 'بلاغات مغلقة', value: reports.length - openReports },
    { label: 'حسابات محظورة', value: users.filter((u) => u.is_banned).length },
  ];

  if (loading) return <div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-28" />)}</div>;

  return (
    <div>
      <h1 className="text-h1 font-bold mb-6">لوحة القيادة</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card">
            <div className="text-caption text-text-secondary mb-1">{s.label}</div>
            <div className="text-4xl font-bold text-primary">{s.value}</div>
          </div>
        ))}
      </div>

      <h2 className="text-h3 font-medium mt-10 mb-3">آخر البلاغات</h2>
      <div className="card p-0 overflow-hidden">
        <table className="w-full text-body-sm">
          <thead className="bg-bg text-text-secondary">
            <tr>
              <th className="text-start p-3">النوع</th>
              <th className="text-start p-3">السبب</th>
              <th className="text-start p-3">الحالة</th>
              <th className="text-start p-3">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {reports.slice(0, 5).map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="p-3">{r.target_type}</td>
                <td className="p-3">{r.reason}</td>
                <td className="p-3">
                  <span className={`badge ${r.status === 'open' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}`}>
                    {r.status}
                  </span>
                </td>
                <td className="p-3 text-text-secondary">{new Date(r.created_at).toLocaleString('ar')}</td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr><td colSpan={4} className="p-6 text-center text-text-secondary">لا بلاغات.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
