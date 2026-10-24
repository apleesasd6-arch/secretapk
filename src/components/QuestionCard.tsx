import { Link } from 'react-router-dom';
import type { Question } from '../types';

type Props = {
  question: Question;
  onDelete?: (id: string) => void;
  onReport?: (id: string) => void;
};

export default function QuestionCard({ question, onDelete, onReport }: Props) {
  return (
    <article className="card animate-fade-in">
      <p className="mb-4 whitespace-pre-wrap leading-relaxed">{question.content}</p>
      <div className="flex flex-wrap gap-2">
        {question.status === 'new' && (
          <Link to={`/inbox/${question.id}/answer`} className="btn-primary h-9 text-body-sm">
            أجب
          </Link>
        )}
        {question.status !== 'deleted' && onDelete && (
          <button onClick={() => onDelete(question.id)} className="btn-ghost h-9 text-body-sm text-danger">
            احذف
          </button>
        )}
        {onReport && (
          <button onClick={() => onReport(question.id)} className="btn-ghost h-9 text-body-sm">
            أبلغ
          </button>
        )}
        <span className="ms-auto text-caption text-text-secondary self-center">
          {new Date(question.created_at).toLocaleString('ar')}
        </span>
      </div>
    </article>
  );
}
