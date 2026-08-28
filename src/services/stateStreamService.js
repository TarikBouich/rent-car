function resolveApiBaseUrl() {
  const configuredDevBase = import.meta.env.VITE_API_URL;
  const configuredProdBase = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;

  // In development, avoid forcing production domain from .env (CORS on LAN).
  if (import.meta.env.DEV) {
    if (configuredDevBase) {
      return configuredDevBase.endsWith('/api')
        ? configuredDevBase
        : `${configuredDevBase.replace(/\/+$/, '')}/api`;
    }

    if (typeof window !== 'undefined') {
      const protocol = window.location.protocol || 'http:';
      const host = window.location.hostname || 'localhost';
      return `${protocol}//${host}:3000/api`;
    }

    return 'http://localhost:3000/api';
  }

  const configuredBase = configuredProdBase;
  if (configuredBase) {
    return configuredBase.endsWith('/api') ? configuredBase : `${configuredBase.replace(/\/+$/, '')}/api`;
  }

  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol || 'http:';
    const host = window.location.hostname || 'localhost';
    return `${protocol}//${host}:3000/api`;
  }

  return 'http://localhost:3000/api';
}

const API_BASE = resolveApiBaseUrl();

export function subscribeStateEvents({ onMessage, onError } = {}) {
  const token = localStorage.getItem('token');
  if (!token || typeof EventSource === 'undefined') {
    return () => {};
  }

  const url = `${API_BASE}/state/stream?token=${encodeURIComponent(token)}`;
  const source = new EventSource(url);

  source.onmessage = (event) => {
    if (!event?.data) return;
    try {
      const payload = JSON.parse(event.data);
      if (onMessage) onMessage(payload);
    } catch (error) {
      if (onError) onError(error);
    }
  };

  source.onerror = (error) => {
    if (onError) onError(error);
  };

  return () => {
    source.close();
  };
}
