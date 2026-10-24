type Props = { icon?: string; title: string; description?: string; action?: React.ReactNode };

export default function EmptyState({ icon = '📭', title, description, action }: Props) {
  return (
    <div className="text-center py-16 px-6">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-h3 font-medium mb-1">{title}</h3>
      {description && <p className="text-body-sm text-text-secondary mb-4">{description}</p>}
      {action}
    </div>
  );
}
