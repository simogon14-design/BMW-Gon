import React, { useState, useEffect } from 'react';
import { useCasino } from '../../context/CasinoContext';
import {
  ShieldAlert,
  Lock,
  KeyRound,
  X,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Fingerprint,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const StealthAdminPinModal: React.FC = () => {
  const {
    isStealthPinModalOpen,
    closeStealthPinModal,
    verifyStealthPin,
  } = useCasino();

  const [pin, setPin] = useState<string>('');
  const [errorShake, setErrorShake] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isStealthPinModalOpen) {
      setPin('');
      setErrorMessage(null);
      setErrorShake(false);
    }
  }, [isStealthPinModalOpen]);

  if (!isStealthPinModalOpen) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      if (nextPin.length === 4) {
        attemptSubmit(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMessage(null);
  };

  const attemptSubmit = (codeToTest: string) => {
    const success = verifyStealthPin(codeToTest);
    if (!success) {
      setErrorShake(true);
      setErrorMessage('Authorization Code Rejected. Audit entry logged.');
      setTimeout(() => {
        setErrorShake(false);
        setPin('');
      }, 700);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/45 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`relative w-full max-w-md rounded-2xl bg-gradient-to-b from-[#090f1d]/45 via-[#060a14]/40 to-[#04060d]/50 backdrop-blur-2xl border-2 border-amber-500/40 shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_20px_rgba(245,158,11,0.2)] p-6 sm:p-7 overflow-hidden ${
            errorShake ? 'animate-shake' : ''
          }`}
        >
          {/* Top Gold Filigree Accent */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#FFD700]" />
          <div className="absolute -top-24 -right-24 w-52 h-52 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-inner">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded bg-amber-400/15 text-amber-300 border border-amber-400/30 uppercase">
                    DEFENSE RESTRICTED
                  </span>
                </div>
                <h3 className="font-luxury font-black text-lg text-slate-100 tracking-wider">
                  STEALTH ADMIN VAULT
                </h3>
              </div>
            </div>

            <button
              id="stealth-pin-close-btn"
              onClick={closeStealthPinModal}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Security Banner */}
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200/90 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              Covert Sovereign Command authorization required. Enter Master Security PIN to view 50% Owner Net Vault, 30% Client / Partner Yield, and Dynamic AI Retention Telemetry.
            </p>
          </div>

          {/* PIN Digits Display */}
          <div className="my-6 text-center space-y-2">
            <div className="flex justify-center items-center gap-4">
              {[0, 1, 2, 3].map((index) => {
                const isFilled = pin.length > index;
                return (
                  <div
                    key={index}
                    className={`w-12 h-14 rounded-xl flex items-center justify-center font-mono text-2xl font-bold transition-all duration-200 ${
                      isFilled
                        ? 'bg-amber-400/20 border-2 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-105'
                        : 'bg-white/5 border border-white/15 text-slate-600'
                    }`}
                  >
                    {isFilled ? '•' : ''}
                  </div>
                );
              })}
            </div>

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs font-mono flex items-center justify-center gap-1.5 pt-1"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </div>

          {/* Military Glass Keypad */}
          <div className="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                onClick={() => handleKeyPress(digit)}
                className="h-12 rounded-xl bg-white/[0.04] hover:bg-amber-400/15 active:bg-amber-400/30 border border-white/10 hover:border-amber-400/50 text-slate-100 font-mono text-lg font-bold transition cursor-pointer flex items-center justify-center shadow-md active:scale-95"
              >
                {digit}
              </button>
            ))}
            
            <button
              onClick={() => {
                setPin('');
                setErrorMessage(null);
              }}
              className="h-12 rounded-xl bg-white/[0.04] hover:bg-white/10 active:bg-white/20 border border-white/10 hover:border-slate-400 text-slate-300 font-mono text-xs font-bold transition cursor-pointer flex flex-col items-center justify-center"
              title="Clear Entry"
            >
              <KeyRound className="w-3.5 h-3.5 mb-0.5 text-slate-400" />
              <span>CLR</span>
            </button>

            <button
              onClick={() => handleKeyPress('0')}
              className="h-12 rounded-xl bg-white/[0.04] hover:bg-amber-400/15 active:bg-amber-400/30 border border-white/10 hover:border-amber-400/50 text-slate-100 font-mono text-lg font-bold transition cursor-pointer flex items-center justify-center shadow-md active:scale-95"
            >
              0
            </button>

            <button
              onClick={handleBackspace}
              className="h-12 rounded-xl bg-white/[0.04] hover:bg-red-500/15 active:bg-red-500/30 border border-white/10 hover:border-red-400/50 text-slate-300 hover:text-red-300 font-mono text-xs font-bold transition cursor-pointer flex items-center justify-center shadow-md active:scale-95"
            >
              DEL
            </button>
          </div>

          {/* Covert Security Isolation Footer */}
          <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1 text-slate-400">
              <Fingerprint className="w-3 h-3 text-amber-400" />
              Zero-Knowledge Vault
            </span>
            <span className="text-emerald-400 flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              HSM Isolated (256-Bit)
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
