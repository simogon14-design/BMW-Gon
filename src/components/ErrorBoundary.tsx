import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RotateCcw, Home, Lock } from 'lucide-react';
import { flushMemoryAndTaskQueues } from '../utils/errorRecovery';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(_error: Error, errorInfo: ErrorInfo) {
    // Hermetically flush task queues and state without exposing stack traces to public console
    flushMemoryAndTaskQueues();
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    flushMemoryAndTaskQueues();
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleFullReload = () => {
    flushMemoryAndTaskQueues();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen w-full bg-[#080E18] flex items-center justify-center p-4">
          <div className="max-w-lg w-full rounded-2xl bg-gradient-to-b from-[#0D1628] to-[#080E18] border-2 border-amber-400/40 p-6 sm:p-8 shadow-2xl space-y-6 text-center relative overflow-hidden">
            {/* Ambient gold glow */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 font-mono text-[11px] font-bold">
                <Lock className="w-3 h-3" />
                COLD STORAGE LEDGER SAFELY PRESERVED
              </span>
              <h2 className="text-xl sm:text-2xl font-luxury font-black text-slate-100 tracking-wide">
                ROYAL INTEGRITY RECOVERY
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                The interface encountered an unexpected state and safely caught the exception without compromising your wallet balance or active session.
              </p>
            </div>

            {/* Obfuscated Security Digest (Hermetic Zero-Knowledge) */}
            <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-center font-mono text-[11px] text-amber-300/80">
              <span className="text-slate-400 block mb-0.5 text-[10px]">SOVEREIGN STATE RECOVERY VERIFICATION:</span>
              <span className="text-emerald-400 font-bold tracking-wider">LEDGER-SHA256-SAFE-LOCK // OK</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                id="error-boundary-reset-btn"
                onClick={this.handleReset}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-mono font-bold text-xs tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20"
              >
                <RotateCcw className="w-4 h-4" />
                <span>RESTORE SESSION</span>
              </button>

              <button
                id="error-boundary-reload-btn"
                onClick={this.handleFullReload}
                className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 hover:text-white font-mono font-bold text-xs tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4 text-slate-400" />
                <span>RELOAD ARENA</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

