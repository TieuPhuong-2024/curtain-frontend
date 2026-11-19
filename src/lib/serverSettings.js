import { getSettingFallback } from '@/utils/siteSettings';

const API_URL = process.env.API_URL_INTERNAL
  ? `${process.env.API_URL_INTERNAL}/api`
  : 'http://localhost:5000/api';

export async function getServerSettings() {
  try {
    const response = await fetch(`${API_URL}/settings`, {
      next: { tags: ['site-settings'], revalidate: 300 },
    });
    if (!response.ok) return {};
    const data = await response.json();
    return data && typeof data === 'object' ? data : {};
  } catch (error) {
    console.error('Failed to load site settings:', error?.message);
    return {};
  }
}

export function createSettingReader(settings) {
  return (key) =>
    settings[key] !== undefined ? settings[key] : getSettingFallback(key);
}
