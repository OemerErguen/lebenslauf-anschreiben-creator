import type { SlotFormProps } from '../formRegistry.js';
import type { Interest } from '@cv/core';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../ui/Button.js';
import { Field } from '../../../ui/Field.js';
import { useListSection } from '../useListSection.js';

function emptyInterest(): Interest {
  return {
    id: `int-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: '',
    keywords: [],
  };
}

export function InterestsForm(props: SlotFormProps) {
  void props;
  const { t } = useTranslation();
  const { items, add, remove, patch } = useListSection<Interest>('interests', emptyInterest);

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
        {items.map((i) => (
          <div key={i.id} className="flex items-end gap-2">
            <div className="flex-1">
              <Field
                label={t('interests.name')}
                value={i.name}
                onChange={(e) => {
                  patch(i.id, { name: e.target.value });
                }}
              />
            </div>
            <Button
              variant="danger"
              size="sm"
              className="mb-1"
              onClick={() => {
                remove(i.id);
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
