/**
 * Mobile Haptic and Touch Feedback Utility
 * Uses the Web Vibration API with safe graceful fallback
 */

export type HapticType = 'selection' | 'light' | 'medium' | 'heavy' | 'impact' | 'success' | 'warning' | 'error';

export function triggerHaptic(type: HapticType = 'light'): void {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

  try {
    if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
      switch (type) {
        case 'selection':
          navigator.vibrate(8);
          break;
        case 'light':
          navigator.vibrate(12);
          break;
        case 'medium':
          navigator.vibrate(25);
          break;
        case 'heavy':
        case 'impact':
          navigator.vibrate(40);
          break;
        case 'success':
          navigator.vibrate([15, 40, 25]);
          break;
        case 'warning':
          navigator.vibrate([30, 50, 30]);
          break;
        case 'error':
          navigator.vibrate([50, 60, 50, 60, 50]);
          break;
      }
    }
  } catch {
    // Vibration blocked or restricted by browser policies
  }
}
