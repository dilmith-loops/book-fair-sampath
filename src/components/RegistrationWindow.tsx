import React, { useState } from 'react';
import { User, Phone, Mail, Sparkles, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { UserProfile } from '../types';

interface RegistrationWindowProps {
  isOpen: boolean;
  onClose?: () => void;
  onRegister: (profile: UserProfile) => void;
  currentProfile?: UserProfile | null;
  allowDismiss?: boolean;
}

export const RegistrationWindow: React.FC<RegistrationWindowProps> = ({
  isOpen,
  onClose,
  onRegister,
  currentProfile,
  allowDismiss = false
}) => {
  const [name, setName] = useState(currentProfile?.name || '');
  const [phone, setPhone] = useState(currentProfile?.phone || '');
  const [email, setEmail] = useState(currentProfile?.email || '');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { name?: string; phone?: string; email?: string } = {};
    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = 'Please enter your full name.';
    }

    const cleanPhone = phone.replace(/[\s\-]/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      newErrors.phone = 'Please enter a valid Sri Lankan mobile number (e.g. 077 123 4567).';
    }

    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      newErrors.email = 'Please provide a valid email address.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const handle = `@${name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15) || 'bookworm'}`;
    const profile: UserProfile = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      handle,
      isSampathCardholder: currentProfile?.isSampathCardholder ?? false,
      registeredAt: Date.now()
    };

    localStorage.setItem('sampath_bookfair_user', JSON.stringify(profile));
    onRegister(profile);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-zinc-200 shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden my-auto">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#F37021] via-[#EA580C] to-[#C2410C] p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          
          <div className="flex items-center justify-between relative z-10 mb-4">
            <div className="bg-white p-1.5 px-2.5 rounded-xl shadow-sm border border-white/20 flex items-center justify-center">
              <img
                src={`${import.meta.env.BASE_URL}logo.png`}
                alt="Sampath Bank Logo"
                className="h-7 sm:h-8 w-auto object-contain mix-blend-multiply block"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('logo-icon.png')) {
                    target.src = `${import.meta.env.BASE_URL}logo-icon.png`;
                  }
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-wider">
                <span>BMICH 2026 Registration</span>
              </div>
              {allowDismiss && onClose && (
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white relative z-10">
            Welcome to BMICH Book Spotter
          </h2>
          <p className="text-xs sm:text-sm text-orange-100/90 mt-1 font-medium relative z-10">
            Join the community helper sponsored by <strong>Sampath Bank PLC</strong> to spot books, share stalls, and unlock cardholder discounts.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-black text-zinc-900 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Full Name</span>
              <span className="text-[10px] text-zinc-400 font-bold">Required</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="reg-name-input"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="e.g. Kavindu Senanayake"
                className={`w-full pl-10 pr-4 py-3 bg-zinc-50 border text-sm font-semibold text-zinc-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:bg-white transition-all ${
                  errors.name ? 'border-red-500 bg-red-50/30' : 'border-zinc-300 hover:border-zinc-400'
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-[11px] font-bold text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Sri Lankan Phone Number */}
          <div>
            <label className="block text-xs font-black text-zinc-900 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Mobile Phone</span>
              <span className="text-[10px] text-zinc-400 font-bold">SMS notifications & verification</span>
            </label>
            <div className="relative flex">
              <div className="inline-flex items-center px-3 bg-zinc-100 border border-r-0 border-zinc-300 rounded-l-xl text-xs font-black text-zinc-700 select-none">
                <span className="mr-1">🇱🇰</span> +94
              </div>
              <input
                type="tel"
                id="reg-phone-input"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                placeholder="77 123 4567"
                className={`w-full px-3.5 py-3 bg-zinc-50 border text-sm font-semibold text-zinc-900 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:bg-white transition-all ${
                  errors.phone ? 'border-red-500 bg-red-50/30' : 'border-zinc-300 hover:border-zinc-400'
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-[11px] font-bold text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-black text-zinc-900 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Email Address</span>
              <span className="text-[10px] text-zinc-400 font-bold">For fair updates & discounts</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                id="reg-email-input"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="kavindu@gmail.com"
                className={`w-full pl-10 pr-4 py-3 bg-zinc-50 border text-sm font-semibold text-zinc-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:bg-white transition-all ${
                  errors.email ? 'border-red-500 bg-red-50/30' : 'border-zinc-300 hover:border-zinc-400'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] font-bold text-red-500 mt-1">{errors.email}</p>
            )}
          </div>



          {/* Safe community commitment */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-600 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              By continuing, you agree to keep the community respectful. AI moderation automatically enforces our zero-profanity standard.
            </span>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            id="submit-registration-btn"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#F37021] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white font-black text-sm shadow-[0_4px_20px_rgba(243,112,33,0.35)] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
          >
            <span>{currentProfile ? 'Save Profile Changes' : 'Complete Registration & Start Spotting'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
