import React from 'react';
import { useIncident } from '../../context/IncidentContext';

interface SensitiveDataMaskProps {
  value: string;
  type?: 'account' | 'upi' | 'phone' | 'email' | 'text';
  className?: string;
  overrideMasked?: boolean;
}

export const SensitiveDataMask: React.FC<SensitiveDataMaskProps> = ({
  value,
  type = 'text',
  className = '',
  overrideMasked
}) => {
  const { isMasked } = useIncident();
  const shouldMask = overrideMasked !== undefined ? overrideMasked : isMasked;

  if (!value) return <span className="text-text-muted font-mono">N/A</span>;
  if (!shouldMask) return <span className={`break-anywhere ${className}`}>{value}</span>;

  const maskValue = () => {
    switch (type) {
      case 'account':
        if (value.length > 4) {
          return `•••• •••• ${value.slice(-4)}`;
        }
        return '•••• 4521';
      case 'upi':
        const parts = value.split('@');
        if (parts.length === 2) {
          const user = parts[0];
          const visible = user.length > 4 ? user.slice(0, 4) : user.slice(0, 1);
          return `${visible}••••@${parts[1]}`;
        }
        return '••••••••@upi';
      case 'phone':
        const clean = value.replace(/\s+/g, '');
        if (clean.length >= 10) {
          const prefix = clean.startsWith('+91') ? '+91 ' : '';
          return `${prefix}••••• •${clean.slice(-4)}`;
        }
        return '••••• •••••';
      case 'email':
        const [name, domain] = value.split('@');
        if (name && domain) {
          return `${name.slice(0, 2)}••••@${domain}`;
        }
        return '••••@••••.com';
      case 'text':
      default:
        if (value.length > 6) {
          return `${value.slice(0, 2)}••••••••${value.slice(-2)}`;
        }
        return '••••••••';
    }
  };

  return (
    <span
      className={`font-mono text-text-secondary break-anywhere ${className}`}
      title="Masked for privacy (Toggle in header)"
    >
      {maskValue()}
    </span>
  );
};
