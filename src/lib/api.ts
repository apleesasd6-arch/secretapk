import { supabase } from './supabase';
import type { Answer, Profile, Question, Report } from '../types';

// ---------- Profiles ----------
export async function getProfileByUsername(username: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();
  if (error) throw error;
  return data as Profile;
}

export async function updateProfile(id: string, patch: Partial<Profile>) {
  const { error } = await supabase.from('profiles').update(patch).eq('id', id);
  if (error) throw error;
}

// ---------- Questions ----------
export async function sendQuestion(recipientId: string, content: string, senderId?: string) {
  const { error } = await supabase.from('questions').insert({
    recipient_id: recipientId,
    content: content.trim(),
    sender_id: senderId ?? null,
  });
  if (error) throw error;
}

export async function getMyInbox(status: 'new' | 'answered' | 'deleted' = 'new'): Promise<Question[]> {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Question[];
}

export async function getQuestionById(id: string): Promise<Question> {
  const { data, error } = await supabase.from('questions').select('*').eq('id', id).single();
  if (error) throw error;
  return data as Question;
}

export async function deleteQuestion(id: string) {
  const { error } = await supabase
    .from('questions')
    .update({ status: 'deleted', deleted_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

// ---------- Answers ----------
export async function publishAnswer(questionId: string, content: string, isPublic = true) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { error: aErr } = await supabase.from('answers').insert({
    question_id: questionId,
    author_id: userData.user.id,
    content: content.trim(),
    is_public: isPublic,
  });
  if (aErr) throw aErr;

  const { error: qErr } = await supabase
    .from('questions')
    .update({ status: 'answered', answered_at: new Date().toISOString() })
    .eq('id', questionId);
  if (qErr) throw qErr;
}

export async function getPublicFeed(limit = 20) {
  const { data, error } = await supabase
    .from('answers')
    .select('*, question:questions(content), author:profiles(username, display_name, avatar_url)')
    .eq('is_public', true)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as (Answer & {
    question: { content: string };
    author: Pick<Profile, 'username' | 'display_name' | 'avatar_url'>;
  })[];
}

export async function toggleLike(answerId: string) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data: existing } = await supabase
    .from('answer_likes')
    .select()
    .eq('answer_id', answerId)
    .eq('user_id', userData.user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from('answer_likes').delete().eq('answer_id', answerId).eq('user_id', userData.user.id);
  } else {
    await supabase.from('answer_likes').insert({ answer_id: answerId, user_id: userData.user.id });
  }
}

// ---------- Reports ----------
export async function createReport(payload: {
  target_type: Report['target_type'];
  target_id: string;
  reason: Report['reason'];
  details?: string;
}) {
  const { data: userData } = await supabase.auth.getUser();
  const priority =
    payload.reason === 'sexual' || payload.reason === 'violence' ? 'high' : 'normal';

  const { error } = await supabase.from('reports').insert({
    reporter_id: userData.user?.id ?? null,
    target_type: payload.target_type,
    target_id: payload.target_id,
    reason: payload.reason,
    details: payload.details ?? null,
    priority,
  });
  if (error) throw error;
}

export async function getReports(): Promise<Report[]> {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Report[];
}

// ---------- Admin ----------
export async function getAllUsers(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Profile[];
}

export async function updateReportStatus(id: string, status: Report['status'], action_taken?: string) {
  const { error } = await supabase
    .from('reports')
    .update({
      status,
      action_taken: action_taken ?? null,
      resolved_at: status === 'resolved' || status === 'rejected' ? new Date().toISOString() : null,
    })
    .eq('id', id);
  if (error) throw error;
}
