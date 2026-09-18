// Safeguard against scripts trying to set window.fetch on a getter-only property
if (typeof window !== 'undefined') {
  try {
    const rawFetch = window.fetch ? window.fetch.bind(window) : undefined;
    let activeFetch = rawFetch;
    Object.defineProperty(window, 'fetch', {
      configurable: true,
      enumerable: true,
      get: () => activeFetch,
      set: (fn) => {
        activeFetch = fn;
      },
    });
  } catch {
    // ignore
  }
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
