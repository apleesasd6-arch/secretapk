export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  role: 'user' | 'moderator' | 'admin' | 'super_admin';
  is_verified: boolean;
  accept_questions: boolean;
  show_in_feed: boolean;
  allow_dm_from_strangers: boolean;
  is_banned: boolean;
  ban_reason: string | null;
  created_at: string;
};

export type QuestionStatus = 'new' | 'answered' | 'deleted' | 'reported';
export type Question = {
  id: string;
  recipient_id: string;
  sender_id: string | null;
  content: string;
  status: QuestionStatus;
  is_anonymous: boolean;
  created_at: string;
  answered_at: string | null;
  deleted_at: string | null;
};

export type Answer = {
  id: string;
  question_id: string;
  author_id: string;
  content: string;
  is_public: boolean;
  status: 'published' | 'hidden' | 'deleted';
  likes_count: number;
  comments_count: number;
  created_at: string;
};

export type ReportReason = 'harassment' | 'sexual' | 'impersonation' | 'violence' | 'spam' | 'other';
export type Report = {
  id: string;
  reporter_id: string | null;
  target_type: 'question' | 'answer' | 'profile' | 'dm';
  target_id: string;
  reason: ReportReason;
  details: string | null;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'open' | 'in_review' | 'resolved' | 'rejected';
  assigned_to: string | null;
  action_taken: string | null;
  created_at: string;
  resolved_at: string | null;
};
