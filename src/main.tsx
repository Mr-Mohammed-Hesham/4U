import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Intercept benign Firestore offline mode / backend timeout notices to avoid triggering false-alarm runtime error overlays
if (typeof window !== 'undefined') {
  const origError = console.error;
  console.error = function (...args: any[]) {
    const fullMsg = args.map(a => (typeof a === 'string' ? a : (a?.message || JSON.stringify(a) || ''))).join(' ');
    if (
      fullMsg.includes('Could not reach Cloud Firestore backend') ||
      fullMsg.includes('client will operate in offline mode') ||
      fullMsg.includes('@firebase/firestore')
    ) {
      console.info('[Firestore Offline]', ...args);
      return;
    }
    origError.apply(console, args);
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
