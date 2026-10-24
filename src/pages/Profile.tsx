import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProfileByUsername } from '../lib/api';
import Skeleton from '../components/Skeleton';
import type { Profile as ProfileT } from '../types';

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<ProfileT | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    getProfileByUsername(username)
      .then(setProfile)
      .catch(() => setErr('المستخدم غير موجود'))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Skeleton className="h-48 mb-4" />
      </div>
    );
  }
  if (err) return <div className="p-6 text-center text-text-secondary">{err}</div>;
  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="card text-center space-y-3">
        <div className="w-24 h-24 rounded-full bg-primary-soft mx-auto grid place-items-center text-3xl font-bold text-primary">
          {profile.display_name?.[0] ?? profile.username[0].toUpperCase()}
        </div>
        <h1 className="text-h2 font-semibold">@{profile.username}</h1>
        {profile.bio && <p className="text-text-secondary">{profile.bio}</p>}
        {profile.is_verified && <span className="badge bg-primary-soft text-primary">✓ موثّق</span>}
        {profile.is_banned && <span className="badge bg-danger/10 text-danger">محظور</span>}
      </div>

      {profile.accept_questions && !profile.is_banned && (
        <Link
          to={`/u/${profile.username}/ask`}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 btn-primary shadow-lg"
        >
          اسأل مجهولًا
        </Link>
      )}
      {!profile.accept_questions && (
        <p className="text-center text-body-sm text-text-secondary mt-6">لا يستقبل أسئلة حاليًا</p>
      )}
    </div>
  );
}
