'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { getSettings } from './settingsApi';
import { getSettingFallback } from '@/utils/siteSettings';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    try {
      const data = await getSettings();
      const next = data && typeof data === 'object' ? data : {};
      setValues(next);
      setError('');
      return next;
    } catch (err) {
      setError(err.message || 'Không tải được nội dung website.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getValue = useCallback(
    (key) => (values[key] !== undefined ? values[key] : getSettingFallback(key)),
    [values]
  );

  const contextValue = useMemo(
    () => ({ values, getValue, loading, error, refresh }),
    [values, getValue, loading, error, refresh]
  );

  return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used inside SettingsProvider');
  }
  return context;
}
