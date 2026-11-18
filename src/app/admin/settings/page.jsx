'use client';

import { useEffect, useMemo, useState } from 'react';
import { FaUndo } from 'react-icons/fa';

import PageHeader from '@/components/admin/PageHeader';
import Panel, { PanelHeader } from '@/components/admin/Panel';
import Field, { controlClass } from '@/components/admin/Field';
import Button from '@/components/admin/Button';
import { notify } from '@/components/admin/notify';
import { getSettings, saveSettings } from '@/lib/settingsApi';
import { useSettings } from '@/lib/SettingsContext';
import { SETTING_DEFINITIONS, SETTING_GROUPS, SETTINGS_SEED } from '@/utils/siteSettings';

const buildDraft = (source) =>
  Object.fromEntries(
    SETTING_DEFINITIONS.map((definition) => [
      definition.key,
      source[definition.key] !== undefined
        ? source[definition.key]
        : SETTINGS_SEED[definition.key] ?? '',
    ])
  );

const buildBaseline = (source) =>
  Object.fromEntries(
    SETTING_DEFINITIONS.map((definition) => [
      definition.key,
      typeof source[definition.key] === 'string' ? source[definition.key] : '',
    ])
  );

export default function AdminSettingsPage() {
  const { refresh } = useSettings();
  const [draft, setDraft] = useState(() => buildDraft({}));
  const [initial, setInitial] = useState(() => buildDraft({}));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getSettings();
      const source = data && typeof data === 'object' ? data : {};
      setDraft(buildDraft(source));
      setInitial(buildBaseline(source));
    } catch (err) {
      setError(err.message || 'Không tải được nội dung website.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changedCount = useMemo(
    () =>
      SETTING_DEFINITIONS.filter((definition) => draft[definition.key] !== initial[definition.key])
        .length,
    [draft, initial]
  );

  const handleChange = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const handleReset = () => setDraft(initial);

  const handleSave = async () => {
    try {
      setSaving(true);
      const data = await saveSettings(draft);
      const next = buildDraft(data && typeof data === 'object' ? data : draft);
      setDraft(next);
      setInitial(buildBaseline(next));
      notify.success('Đã lưu nội dung website.');
      await refresh();
      fetch('/api/revalidate-settings', { method: 'POST' }).catch(() => {});
    } catch (err) {
      notify.error(err.message || 'Không lưu được nội dung.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nội dung website"
        description="Chữ khách nhìn thấy: tên shop, hotline, địa chỉ, kênh liên hệ. Sửa ở đây, lưu là trang cập nhật ngay. Ô để trống thì khu vực đó bị ẩn."
        meta={changedCount ? `${changedCount} thay đổi chưa lưu` : 'Đã đồng bộ'}
        actions={
          <>
            <Button icon={FaUndo} onClick={handleReset} disabled={!changedCount || saving}>
              Hoàn tác
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              loading={saving}
              disabled={!changedCount || loading || Boolean(error)}
            >
              Lưu thay đổi
            </Button>
          </>
        }
      />

      {error ? (
        <Panel className="border-[rgba(156,59,54,0.25)]">
          <div className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--a-danger)]">{error}</p>
            <Button size="sm" onClick={load}>
              Thử lại
            </Button>
          </div>
        </Panel>
      ) : (
        SETTING_GROUPS.map((group) => {
          const definitions = SETTING_DEFINITIONS.filter(
            (definition) => definition.group === group.id
          );
          return (
            <Panel key={group.id}>
              <PanelHeader title={group.label} description={group.description} />
              <div className="grid gap-5 p-5 sm:grid-cols-2">
                {definitions.map((definition) => {
                  const isWide = definition.type === 'textarea';
                  return (
                    <Field
                      key={definition.key}
                      label={definition.label}
                      htmlFor={definition.key}
                      hint={loading ? 'Đang tải…' : definition.hint}
                      className={isWide ? 'sm:col-span-2' : ''}
                    >
                      {isWide ? (
                        <textarea
                          id={definition.key}
                          rows={3}
                          className={controlClass}
                          value={draft[definition.key] ?? ''}
                          disabled={loading}
                          onChange={(event) =>
                            handleChange(definition.key, event.target.value)
                          }
                        />
                      ) : (
                        <input
                          id={definition.key}
                          type={definition.type === 'url' ? 'url' : 'text'}
                          inputMode={definition.type === 'tel' ? 'tel' : undefined}
                          className={controlClass}
                          value={draft[definition.key] ?? ''}
                          disabled={loading}
                          onChange={(event) =>
                            handleChange(definition.key, event.target.value)
                          }
                        />
                      )}
                    </Field>
                  );
                })}
              </div>
            </Panel>
          );
        })
      )}
    </div>
  );
}
