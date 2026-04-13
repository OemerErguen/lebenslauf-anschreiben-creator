import type { SlotFormProps } from '../formRegistry.js';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../ui/Button.js';
import { Field } from '../../../ui/Field.js';
import { Select } from '../../../ui/Select.js';
import { useZoneComponentOptions } from '../useZoneComponentOptions.js';

const NETWORK_SUGGESTIONS = [
  'GitHub',
  'LinkedIn',
  'Xing',
  'Twitter',
  'Instagram',
  'GitLab',
  'StackOverflow',
  'Dribbble',
  'Behance',
  'YouTube',
] as const;

interface LetterProfile {
  network: string;
  username?: string;
  url?: string;
}

/**
 * Editor form for the LetterContact component.
 * Stores contact data in component options — independent of resume and sender.
 */
export function LetterContactForm({ slotName, componentId }: SlotFormProps) {
  const { t } = useTranslation();
  const [options, patchOptions] = useZoneComponentOptions(slotName, componentId);

  const email = (options.email as string) ?? '';
  const phone = (options.phone as string) ?? '';
  const url = (options.url as string) ?? '';
  const city = (options.city as string) ?? '';
  const profiles = (options.profiles as LetterProfile[] | undefined) ?? [];

  const addProfile = () => {
    patchOptions({ profiles: [...profiles, { network: '', username: '' }] });
  };
  const removeProfile = (idx: number) => {
    patchOptions({ profiles: profiles.filter((_, i) => i !== idx) });
  };
  const patchProfile = (idx: number, patch: Partial<LetterProfile>) => {
    patchOptions({
      profiles: profiles.map((p, i) => (i === idx ? { ...p, ...patch } : p)),
    });
  };

  const networkOptions = [
    { value: '', label: t('contact.selectNetwork') },
    ...NETWORK_SUGGESTIONS.map((n) => ({ value: n, label: n })),
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <Field
            label={t('basics.email')}
            type="email"
            value={email}
            onChange={(e) => {
              patchOptions({ email: e.target.value });
            }}
          />
          <Field
            label={t('basics.phone')}
            value={phone}
            onChange={(e) => {
              patchOptions({ phone: e.target.value });
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field
            label={t('basics.url')}
            type="url"
            value={url}
            onChange={(e) => {
              patchOptions({ url: e.target.value });
            }}
          />
          <Field
            label={t('basics.city')}
            value={city}
            onChange={(e) => {
              patchOptions({ city: e.target.value });
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {t('contact.profiles')}
          </span>
          <Button variant="ghost" size="sm" onClick={addProfile}>
            + {t('actions.add')}
          </Button>
        </div>
        {profiles.map((p, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-2 rounded-md border border-slate-200 bg-slate-50/50 p-2"
          >
            <div className="flex items-end gap-2">
              <Select
                label={t('contact.network')}
                value={p.network}
                onChange={(e) => {
                  patchProfile(idx, { network: e.target.value });
                }}
                options={networkOptions}
              />
              <div className="flex-1">
                <Field
                  label={t('contact.username')}
                  value={p.username ?? ''}
                  placeholder="@username"
                  onChange={(e) => {
                    patchProfile(idx, { username: e.target.value });
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  removeProfile(idx);
                }}
                className="mb-1 shrink-0 rounded p-0.5 text-slate-400 transition-colors hover:text-red-500"
              >
                &times;
              </button>
            </div>
            <Field
              label={t('contact.profileUrl')}
              type="url"
              value={p.url ?? ''}
              placeholder="https://github.com/username"
              onChange={(e) => {
                patchProfile(idx, { url: e.target.value });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
