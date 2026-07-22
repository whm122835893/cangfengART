interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function EmptyState({
  icon,
  title = '暂无数据',
  subtitle = '敬请期待更多精彩内容',
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
      {icon ? (
        icon
      ) : (
        <div className="w-[120px] h-[120px] rounded-3xl neu-inset flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl neu-raised flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="4"
                y="12"
                width="24"
                height="16"
                rx="4"
                fill="#a0aec0"
                fillOpacity="0.4"
              />
              <path
                d="M12 12V8C12 5.79086 13.7909 4 16 4C18.2091 4 20 5.79086 20 8V12"
                stroke="#718096"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="16" cy="20" r="2" fill="#718096" />
            </svg>
          </div>
        </div>
      )}
      {title && (
        <p className="text-base font-bold text-neu-text-primary mb-2">{title}</p>
      )}
      {subtitle && (
        <p className="text-sm text-neu-text-muted">{subtitle}</p>
      )}
    </div>
  );
}