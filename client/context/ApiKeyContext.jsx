/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ApiKeyContext = createContext(null);

/**
 * Pings /api/health to check if the server has a valid Gemini key.
 * status: 'checking' | 'ready' | 'missing' | 'invalid'
 */
export function ApiKeyProvider({ children }) {
  const [status, setStatus]   = useState('checking');
  const [message, setMessage] = useState('');
  const [checking, setChecking] = useState(false);

  const checkHealth = useCallback(async () => {
    setChecking(true);
    setStatus('checking');
    try {
      const res  = await fetch('/api/health', { signal: AbortSignal.timeout(6000) });
      const data = await res.json().catch(() => ({}));

      if (data.geminiConfigured === true) {
        setStatus('ready');
        setMessage('');
      } else {
        setStatus('missing');
        setMessage(data.message || 'API key missing.');
      }
    } catch {
      // Server not reachable — still show the app but warn
      setStatus('missing');
      setMessage('Cannot reach the backend server. Make sure npm run dev is running.');
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => { checkHealth(); }, [checkHealth]);

  return (
    <ApiKeyContext.Provider value={{ status, message, checking, recheckHealth: checkHealth }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const ctx = useContext(ApiKeyContext);
  if (!ctx) throw new Error('useApiKey must be used within ApiKeyProvider');
  return ctx;
}
