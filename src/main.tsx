import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initErrorRecoveryWatchdog } from './utils/errorRecovery';

// Initialize Hermetic Error Recovery Watchdog & Memory Flush
initErrorRecoveryWatchdog();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

