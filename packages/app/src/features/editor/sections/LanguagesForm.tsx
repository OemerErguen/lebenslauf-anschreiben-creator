import type { SlotFormProps } from '../formRegistry.js';
import type { Language } from '@cv/core';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../ui/Button.js';
import { Field } from '../../../ui/Field.js';
import { Select } from '../../../ui/Select.js';
import { useListSection } from '../useListSection.js';

const FLUENCY_LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2', 'native'] as const;

function emptyLanguage(): Language {
  return {
    id: `lang-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    language: '',
    fluency: 'b1',
  };
}

export function LanguagesForm(props: SlotFormProps) {
  void props;
  const { t } = useTranslation();
  const { items, add, remove, patch } = useListSection<Language>('languages', emptyLanguage);

  const fluencyOptions = FLUENCY_LEVELS.map((f) => ({
    value: f,
    label: t(`languages.fluency_${f}`),
  }));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">
          {items.length}{' '}
          {items.length === 1
            ? t('editor.entry', { defaultValue: 'entry' })
            : t('editor.entries', { defaultValue: 'entries' })}
        </span>
        <Button variant="secondary" size="sm" onClick={add}>
          + {t('actions.add')}
        </Button>
      </div>

      {items.length === 0 && (
        <div className="py-6 text-center text-sm text-slate-400">
          {t('editor.noEntries', { defaultValue: 'No entries yet.' })}
        </div>
      )}

      <div className="flex flex-col gap-2">
        {items.map((l) => (
          <div key={l.id} className="flex items-end gap-2">
            <div className="flex-1">
              <Field
                label={t('languages.language')}
                value={l.language}
                onChange={(e) => {
                  patch(l.id, { language: e.target.value });
                }}
              />
            </div>
            <Select
              label={t('languages.fluency')}
              value={l.fluency ?? 'b1'}
              onChange={(e) => {
                patch(l.id, { fluency: e.target.value as Language['fluency'] });
              }}
              options={fluencyOptions}
            />
            <Button
              variant="danger"
              size="sm"
              className="mb-1"
              onClick={() => {
                remove(l.id);
              }}
            >
              {t('actions.remove')}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
