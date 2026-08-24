import React from 'react';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  subValue?: string;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  highlight?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  badge,
  icon,
  highlight = false
}) => {
  return (
    <div
      className={`p-5 rounded-card border transition-all ${
        highlight
          ? 'bg-surface border-brand-primary/40 shadow-card ring-1 ring-brand-primary/20'
          : 'bg-surface border-surface-border shadow-subtle hover:border-surface-border-active'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted font-medium">
          {label}
        </span>
        {icon && <span className="text-text-muted">{icon}</span>}
      </div>

      <div className="mt-2.5 flex items-baseline justify-between gap-2">
        <div className="text-2xl font-bold font-mono text-text-primary tracking-tight break-anywhere">
          {value}
        </div>
        {badge}
      </div>

      {subValue && (
        <div className="mt-1.5 text-xs text-text-secondary truncate">
          {subValue}
        </div>
      )}
    </div>
  );
};
