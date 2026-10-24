import { useEffect, useState } from 'react';
import { getReports, updateReportStatus } from '../../lib/api';
import Skeleton from '../../components/Skeleton';
import { useToast } from '../../hooks/useToast';
import type { Report } from '../../types';

export default function Reports() {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try { setReports(await getReports()); } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function resolve(r: Report, status: Report['status']) {
    const action = status === 'resolved' ? prompt('الإجراء المتخذ (مطلوب):') : null;
    if (status === 'resolved' && !action) return;
    try {
      await updateReportStatus(r.id, status, action ?? undefined);
      toast('تم التحديث', 'success');
      load();
    } catch (e: any) {
      toast(e?.message ?? 'فشل', 'error');
    }
  }

  return (
    <div>
      <h1 className="text-h1 font-bold mb-6">البلاغات</h1>

      {loading && <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-16" />)}</div>}

      {!loading && (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-body-sm">
            <thead className="bg-bg text-text-secondary">
              <tr>
                <th className="text-start p-3">الهدف</th>
                <th className="text-start p-3">السبب</th>
                <th className="text-start p-3">الأولوية</th>
                <th className="text-start p-3">الحالة</th>
                <th className="text-start p-3">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-3">{r.target_type}</td>
                  <td className="p-3">{r.reason}</td>
                  <td className="p-3">
                    <span className={`badge ${
                      r.priority === 'high' || r.priority === 'urgent'
                        ? 'bg-danger/10 text-danger'
                        : 'bg-info/10 text-info'
                    }`}>{r.priority}</span>
                  </td>
                  <td className="p-3">
                    <span className={`badge ${
                      r.status === 'open' ? 'bg-warning/10 text-warning'
                      : r.status === 'resolved' ? 'bg-success/10 text-success'
                      : 'bg-border/40 text-text-secondary'
                    }`}>{r.status}</span>
                  </td>
                  <td className="p-3 flex gap-1">
                    {r.status === 'open' && (
                      <>
                        <button onClick={() => resolve(r, 'resolved')} className="btn-ghost h-8 text-body-sm text-success">حل</button>
                        <button onClick={() => resolve(r, 'rejected')} className="btn-ghost h-8 text-body-sm text-danger">رفض</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-text-secondary">لا بلاغات.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
