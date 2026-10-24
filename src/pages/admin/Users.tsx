import { useEffect, useState } from 'react';
import { getAllUsers, updateProfile } from '../../lib/api';
import Skeleton from '../../components/Skeleton';
import { useToast } from '../../hooks/useToast';
import type { Profile } from '../../types';

export default function Users() {
  const { toast } = useToast();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  async function load() {
    setLoading(true);
    try { setUsers(await getAllUsers()); } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function toggleBan(u: Profile) {
    const reason = u.is_banned ? null : prompt('سبب الحظر؟');
    if (!u.is_banned && !reason) return;
    try {
      await updateProfile(u.id, { is_banned: !u.is_banned, ban_reason: reason ?? null });
      toast(u.is_banned ? 'فُكّ الحظر' : 'تم الحظر', 'success');
      load();
    } catch (e: any) {
      toast(e?.message ?? 'فشل', 'error');
    }
  }

  const filtered = users.filter((u) =>
    u.username.includes(q.toLowerCase()) || (u.display_name ?? '').toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-h1 font-bold mb-6">المستخدمون</h1>
      <input
        className="input mb-4 max-w-md"
        placeholder="بحث بالاسم أو @username…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {loading && <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-16" />)}</div>}

      {!loading && (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-body-sm">
            <thead className="bg-bg text-text-secondary">
              <tr>
                <th className="text-start p-3">@</th>
                <th className="text-start p-3">الدور</th>
                <th className="text-start p-3">الحالة</th>
                <th className="text-start p-3">التاريخ</th>
                <th className="text-start p-3">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-t border-border">
                  <td className="p-3 font-medium">@{u.username}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3">
                    {u.is_banned ? (
                      <span className="badge bg-danger/10 text-danger">محظور</span>
                    ) : (
                      <span className="badge bg-success/10 text-success">نشط</span>
                    )}
                  </td>
                  <td className="p-3 text-text-secondary">{new Date(u.created_at).toLocaleDateString('ar')}</td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleBan(u)}
                      className={`btn-ghost h-8 text-body-sm ${u.is_banned ? 'text-success' : 'text-danger'}`}
                    >
                      {u.is_banned ? 'فك الحظر' : 'حظر'}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-text-secondary">لا نتائج.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
