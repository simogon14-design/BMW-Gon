import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, ShieldCheck } from 'lucide-react';

interface CashierQRCodeProps {
  value: string;
  size?: number;
  label?: string;
}

export const CashierQRCode: React.FC<CashierQRCodeProps> = ({
  value,
  size = 180,
  label = 'Scan to Pay',
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    if (!value) return;

    QRCode.toDataURL(value, {
      width: size * 2,
      margin: 1.5,
      color: {
        dark: '#FFD700',
        light: '#070C14',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (isMounted) setDataUrl(url);
      })
      .catch(() => {
        // Handled silently
      });

    return () => {
      isMounted = false;
    };
  }, [value, size]);

  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-[#0e1626] to-[#080d16] border border-amber-400/30 shadow-[0_0_25px_rgba(212,175,55,0.15)] relative group">
      {/* Decorative corners */}
      <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-amber-400/60 rounded-tl" />
      <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-amber-400/60 rounded-tr" />
      <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-amber-400/60 rounded-bl" />
      <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-amber-400/60 rounded-br" />

      <div
        className="relative flex items-center justify-center rounded-xl overflow-hidden bg-[#070C14] p-2 border border-white/10"
        style={{ width: size, height: size }}
      >
        {dataUrl ? (
          <img
            src={dataUrl}
            alt={label}
            className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-500 gap-2">
            <QrCode className="w-8 h-8 animate-pulse text-amber-400/60" />
            <span className="text-[10px] font-mono">Generating QR...</span>
          </div>
        )}

        {/* Center Golden Crest Logo overlay */}
        {dataUrl && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-9 h-9 rounded-full bg-slate-950 border border-amber-400/80 shadow-[0_0_12px_rgba(255,215,0,0.6)] flex items-center justify-center p-1">
              <span className="text-amber-400 font-luxury font-black text-xs tracking-tighter">
                Æ
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-mono text-amber-300/80">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Verified Single-Use Address</span>
      </div>
    </div>
  );
};
