import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Clock, Info, ShieldAlert } from 'lucide-react';
import { ActionUrgency, CaseStatusProgress, RiskLevel } from '../../types';

interface BadgeProps {
  variant?: 'safe' | 'info' | 'warning' | 'critical' | 'neutral';
  children: React.ReactNode;
  icon?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  icon = false,
  size = 'md',
  className = ''
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'safe':
        return 'bg-brand-green-soft text-brand-green border-brand-green/25 font-semibold';
      case 'info':
        return 'bg-brand-blue-soft text-brand-blue border-brand-blue/25 font-semibold';
      case 'warning':
        return 'bg-brand-amber-soft text-brand-amber border-brand-amber/30 font-semibold';
      case 'critical':
        return 'bg-brand-red-soft text-brand-red border-brand-red/30 font-semibold';
      case 'neutral':
      default:
        return 'bg-surface-subtle text-text-secondary border-surface-border font-medium';
    }
  };

  const getIcon = () => {
    if (!icon) return null;
    const iconSize = size === 'sm' ? 12 : 14;
    switch (variant) {
      case 'safe':
        return <CheckCircle2 size={iconSize} className="mr-1.5 shrink-0" aria-hidden="true" />;
      case 'info':
        return <Info size={iconSize} className="mr-1.5 shrink-0" aria-hidden="true" />;
      case 'warning':
        return <AlertTriangle size={iconSize} className="mr-1.5 shrink-0" aria-hidden="true" />;
      case 'critical':
        return <AlertCircle size={iconSize} className="mr-1.5 shrink-0" aria-hidden="true" />;
      default:
        return null;
    }
  };

  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-mono rounded-md border tracking-wide uppercase ${sizeStyles} ${getStyles()} ${className}`}
    >
      {getIcon()}
      {children}
    </span>
  );
};

export const RiskBadge: React.FC<{ level: RiskLevel; size?: 'sm' | 'md' }> = ({ level, size = 'md' }) => {
  switch (level) {
    case 'critical':
      return <Badge variant="critical" icon size={size}>CRITICAL RISK</Badge>;
    case 'high':
      return <Badge variant="warning" icon size={size}>HIGH RISK</Badge>;
    case 'medium':
      return <Badge variant="info" icon size={size}>MEDIUM RISK</Badge>;
    case 'low':
      return <Badge variant="safe" icon size={size}>LOW RISK</Badge>;
    default:
      return <Badge variant="neutral" size={size}>UNASSESSED</Badge>;
  }
};

export const UrgencyBadge: React.FC<{ urgency: ActionUrgency }> = ({ urgency }) => {
  switch (urgency) {
    case 'critical_now':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-brand-red-soft text-brand-red border border-brand-red/30">
          <ShieldAlert size={12} className="mr-1 shrink-0" />
          CRITICAL — NOW
        </span>
      );
    case 'high_now':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-brand-amber-soft text-brand-amber border border-brand-amber/30">
          <Clock size={12} className="mr-1 shrink-0" />
          HIGH — IMMEDIATE
        </span>
      );
    case 'high_1hr':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-brand-amber-soft text-brand-amber border border-brand-amber/25">
          <Clock size={12} className="mr-1 shrink-0" />
          HIGH — WITHIN 1 HR
        </span>
      );
    case 'medium_today':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-brand-blue-soft text-brand-blue border border-brand-blue/25">
          <Clock size={12} className="mr-1 shrink-0" />
          MEDIUM — TODAY
        </span>
      );
    case 'routine':
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-surface-subtle text-text-secondary border border-surface-border">
          ROUTINE
        </span>
      );
  }
};

export const StatusProgressBadge: React.FC<{ status: CaseStatusProgress }> = ({ status }) => {
  switch (status) {
    case 'incident_reported':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-brand-blue-soft text-brand-blue border border-brand-blue/25">
          REPORTED
        </span>
      );
    case 'information_verified':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-brand-green-soft text-brand-green border border-brand-green/25">
          VERIFIED
        </span>
      );
    case 'complaint_forwarded':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-brand-amber-soft text-brand-amber border border-brand-amber/30">
          FORWARDED
        </span>
      );
    case 'under_investigation':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-brand-soft text-brand-primary border border-brand-primary/30">
          ● UNDER INVESTIGATION
        </span>
      );
    case 'action_resolution':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-brand-green-soft text-brand-green border border-brand-green/25">
          RESOLUTION
        </span>
      );
    case 'closed':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-surface-subtle text-text-muted border border-surface-border">
          CLOSED
        </span>
      );
    default:
      return null;
  }
};
