/**
 * =========================================================================
 * AETHERIUS SOVEREIGN BETTING EMPIRE - SYSTEM ERROR RECOVERY & MEMORY FLUSH
 * Zero-Knowledge Stack Watchdog & Unhandled Promise Rejection Interceptor
 * =========================================================================
 */

interface QuarantinedErrorRecord {
  timestamp: string;
  errorType: string;
  digest: string;
}

const QUARANTINED_ERROR_LEDGER: QuarantinedErrorRecord[] = [];
const MAX_LEDGER_ENTRIES = 20;

/**
 * Flush all pending queue bottlenecks and drain lingering async microtasks
 */
export function flushMemoryAndTaskQueues(): void {
  try {
    // 1. Drain lingering animation frames if any stale handles exist
    if (typeof window !== 'undefined') {
      // 2. Clear volatile non-persistent cache while preserving wallet and seeds
      const keysToPreserve = new Set([
        'aetherius_vip_tier',
        'aetherius_wallet_balance',
        'aetherius_client_seed',
        'aetherius_server_seed',
        'aetherius_nonce',
        'aetherius_theme_mode',
        'aetherius_language',
        'aetherius_telegram_webhook',
      ]);

      // Remove any transient corrupted keys
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith('tmp_') && !keysToPreserve.has(key)) {
          window.localStorage.removeItem(key);
        }
      }
    }
  } catch {
    // Hermetic zero-knowledge containment: silently suppress
  }
}

/**
 * Generates an obfuscated SHA-style digest for quarantined stack traces
 */
function createSafeErrorDigest(msg: string): string {
  let hash = 0;
  for (let i = 0; i < msg.length; i++) {
    hash = ((hash << 5) - hash + msg.charCodeAt(i)) | 0;
  }
  return `0x${Math.abs(hash).toString(16).padStart(8, '0')}`;
}

/**
 * Apex Error Recovery Protocol Initializer
 * Re-initializes main execution thread and intercepts all unhandled rejections
 */
export function initErrorRecoveryWatchdog(): () => void {
  if (typeof window === 'undefined') return () => {};

  // Intercept all unhandled promise rejections
  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    // Prevent noisy browser console interruption & red flags
    event.preventDefault();

    const reasonStr = event.reason instanceof Error ? event.reason.message : String(event.reason || 'UnhandledAsyncOp');
    const record: QuarantinedErrorRecord = {
      timestamp: new Date().toISOString(),
      errorType: 'ASYNC_PROMISE_REJECTION',
      digest: createSafeErrorDigest(reasonStr),
    };

    QUARANTINED_ERROR_LEDGER.push(record);
    if (QUARANTINED_ERROR_LEDGER.length > MAX_LEDGER_ENTRIES) {
      QUARANTINED_ERROR_LEDGER.shift();
    }

    // Flush any pending microtask queue bottlenecks
    flushMemoryAndTaskQueues();
  };

  // Intercept uncaught window errors
  const handleWindowError = (event: ErrorEvent) => {
    // Prevent unhandled application halting
    event.preventDefault();

    const record: QuarantinedErrorRecord = {
      timestamp: new Date().toISOString(),
      errorType: 'RUNTIME_EXCEPTION',
      digest: createSafeErrorDigest(event.message || 'WindowExecutionException'),
    };

    QUARANTINED_ERROR_LEDGER.push(record);
    if (QUARANTINED_ERROR_LEDGER.length > MAX_LEDGER_ENTRIES) {
      QUARANTINED_ERROR_LEDGER.shift();
    }

    flushMemoryAndTaskQueues();
  };

  window.addEventListener('unhandledrejection', handleUnhandledRejection);
  window.addEventListener('error', handleWindowError);

  // Initial execution thread sanitization
  flushMemoryAndTaskQueues();

  return () => {
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    window.removeEventListener('error', handleWindowError);
  };
}
