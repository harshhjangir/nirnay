import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { CaptchaWidget } from './CaptchaWidget';
import { useIncident } from '../../context/IncidentContext';
import { AlertCircle, CheckCircle, Lock, Phone, Mail, User, ShieldCheck } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, loginUser, loginAsDemo } = useIncident();

  const [authMode, setAuthMode] = useState<'password' | 'otp' | 'register'>('password');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isLoginModalOpen) return null;

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMessage('Please enter your email address or mobile number.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }
    if (!isCaptchaValid) {
      setErrorMessage('Please complete the security CAPTCHA verification correctly.');
      return;
    }

    setErrorMessage(null);
    loginUser(identifier.trim(), fullName.trim() || undefined);
  };

  const handleSendOtp = () => {
    if (!identifier.trim()) {
      setErrorMessage('Please enter your mobile number or email.');
      return;
    }
    setErrorMessage(null);
    setOtpSent(true);
    setOtpCode('4829'); // Mock demo OTP
  };

  const handleOtpLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 4) {
      setErrorMessage('Please enter the 4-digit verification code.');
      return;
    }
    setErrorMessage(null);
    loginUser(identifier.trim());
  };

  return (
    <Modal
      isOpen={isLoginModalOpen}
      onClose={closeLoginModal}
      title={authMode === 'register' ? 'Create Citizen Account' : 'Sign In to NIRNAY'}
      subtitle={authMode === 'register' ? 'Register to manage and track reported financial incidents' : 'Access your active fraud cases and track official inquiry progression'}
      maxWidth="sm"
    >
      <div className="space-y-5">
        {/* Auth Mode Toggle Tabs */}
        <div className="flex rounded-lg bg-surface-subtle p-1 border border-surface-border text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setAuthMode('password'); setErrorMessage(null); }}
            className={`flex-1 py-1.5 rounded-md transition-all ${
              authMode === 'password'
                ? 'bg-surface text-text-primary shadow-subtle border border-surface-border'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Password Login
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('otp'); setErrorMessage(null); }}
            className={`flex-1 py-1.5 rounded-md transition-all ${
              authMode === 'otp'
                ? 'bg-surface text-text-primary shadow-subtle border border-surface-border'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            OTP Login
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('register'); setErrorMessage(null); }}
            className={`flex-1 py-1.5 rounded-md transition-all ${
              authMode === 'register'
                ? 'bg-surface text-text-primary shadow-subtle border border-surface-border'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-lg bg-brand-red-soft border border-brand-red/30 text-xs text-brand-red flex items-start gap-2">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Mode 1: Password Login & Registration */}
        {(authMode === 'password' || authMode === 'register') && (
          <form onSubmit={handlePasswordLogin} className="space-y-4 text-xs">
            {authMode === 'register' && (
              <div>
                <label className="block font-semibold text-text-primary mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-2.5 text-text-muted" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Rajesh Sharma"
                    className="w-full bg-surface border border-surface-border rounded-lg pl-9 pr-3.5 py-2 text-sm text-text-primary outline-none focus:border-brand-primary"
                    required={authMode === 'register'}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold text-text-primary mb-1">
                Email Address or Registered Mobile Number
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-2.5 text-text-muted" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. rajesh@example.com or 9845192837"
                  className="w-full bg-surface border border-surface-border rounded-lg pl-9 pr-3.5 py-2 text-sm text-text-primary outline-none focus:border-brand-primary"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-text-primary">
                  Password
                </label>
                {authMode === 'password' && (
                  <button
                    type="button"
                    onClick={() => setAuthMode('otp')}
                    className="text-[11px] text-brand-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-2.5 text-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-surface border border-surface-border rounded-lg pl-9 pr-3.5 py-2 text-sm text-text-primary outline-none focus:border-brand-primary font-mono"
                  required
                />
              </div>
            </div>

            {/* CAPTCHA Component */}
            <CaptchaWidget onValidated={setIsCaptchaValid} />

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-sm transition-colors shadow-subtle"
            >
              {authMode === 'register' ? 'Create Account & Continue' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Mode 2: OTP Login */}
        {authMode === 'otp' && (
          <form onSubmit={handleOtpLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-text-primary mb-1">
                Mobile Number or Email
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Phone size={15} className="absolute left-3 top-2.5 text-text-muted" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="+91 98451 92837"
                    className="w-full bg-surface border border-surface-border rounded-lg pl-9 pr-3.5 py-2 text-sm text-text-primary outline-none focus:border-brand-primary font-mono"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="px-3.5 py-2 rounded-lg bg-surface-subtle hover:bg-surface-elevated text-brand-primary border border-surface-border font-semibold text-xs transition-colors shrink-0"
                >
                  {otpSent ? 'Resend OTP' : 'Send OTP'}
                </button>
              </div>
            </div>

            {otpSent && (
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-brand-green-soft border border-brand-green/20 text-xs text-brand-green flex items-center justify-between">
                  <span>Demo OTP sent: <strong>4829</strong></span>
                  <span className="font-mono text-[11px]">Valid 5 mins</span>
                </div>

                <label className="block font-semibold text-text-primary">
                  Enter 4-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="4829"
                  className="w-full bg-surface border border-surface-border rounded-lg px-3.5 py-2 text-base text-center font-mono tracking-widest text-text-primary outline-none focus:border-brand-primary"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={!otpSent}
              className="w-full py-2.5 rounded-lg bg-brand-primary hover:bg-brand-hover disabled:opacity-50 text-white font-semibold text-sm transition-colors shadow-subtle"
            >
              Verify Code & Sign In
            </button>
          </form>
        )}

        {/* Demo Fast-Login Strip */}
        <div className="pt-3 border-t border-surface-border space-y-2">
          <div className="text-center text-[11px] text-text-muted">
            For evaluation & review testing:
          </div>
          <button
            type="button"
            onClick={loginAsDemo}
            className="w-full py-2 px-3 rounded-lg bg-surface-elevated hover:bg-surface text-text-primary border border-surface-border font-medium text-xs transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck size={14} className="text-brand-primary" />
            <span>Sign In with Demo Citizen (Rajesh Sharma)</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
