import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface CaptchaWidgetProps {
  onValidated: (isValid: boolean) => void;
  required?: boolean;
}

export const CaptchaWidget: React.FC<CaptchaWidgetProps> = ({ onValidated, required = true }) => {
  const [captchaCode, setCaptchaCode] = useState('');
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

  const generateCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setUserInput('');
    setStatus('idle');
    onValidated(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleInputChange = (val: string) => {
    setUserInput(val);
    if (val.trim().toUpperCase() === captchaCode) {
      setStatus('valid');
      onValidated(true);
    } else if (val.trim().length >= 5) {
      setStatus('invalid');
      onValidated(false);
    } else {
      setStatus('idle');
      onValidated(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor="captcha-input" className="block text-xs font-semibold text-text-primary">
          Security Verification (CAPTCHA)
        </label>
        <button
          type="button"
          onClick={generateCaptcha}
          className="text-xs text-brand-primary hover:text-brand-hover flex items-center gap-1 font-mono transition-colors"
          title="Refresh CAPTCHA code"
          aria-label="Refresh security verification code"
        >
          <RefreshCw size={12} />
          <span>New Code</span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Visual CAPTCHA display box */}
        <div
          className="px-4 py-2.5 bg-surface-subtle border border-surface-border rounded-lg select-none font-mono text-base font-bold tracking-widest text-text-primary flex items-center justify-center min-w-[110px]"
          aria-label={`Security verification code is ${captchaCode.split('').join(' ')}`}
        >
          <span className="line-through decoration-brand-primary/40 decoration-2">
            {captchaCode}
          </span>
        </div>

        {/* Input box */}
        <div className="relative flex-1">
          <input
            id="captcha-input"
            type="text"
            maxLength={6}
            value={userInput}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Type code"
            required={required}
            className={`w-full bg-surface border rounded-lg px-3.5 py-2 text-sm font-mono uppercase tracking-wider text-text-primary outline-none transition-all ${
              status === 'valid'
                ? 'border-brand-green ring-1 ring-brand-green/20'
                : status === 'invalid'
                ? 'border-brand-red ring-1 ring-brand-red/20'
                : 'border-surface-border focus:border-brand-primary'
            }`}
          />
          {status === 'valid' && (
            <CheckCircle size={16} className="absolute right-3 top-2.5 text-brand-green" />
          )}
          {status === 'invalid' && (
            <AlertCircle size={16} className="absolute right-3 top-2.5 text-brand-red" />
          )}
        </div>
      </div>
      <p className="text-[11px] text-text-muted">
        Enter the 5 characters shown above to verify you are a human citizen.
      </p>
    </div>
  );
};
