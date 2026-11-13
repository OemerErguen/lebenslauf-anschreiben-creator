import type { SlotFormProps } from '../formRegistry.js';
import type { Award } from '@cv/core';
import { useTranslation } from 'react-i18next';
import { Field } from '../../../ui/Field.js';
import { ListFormHeader } from '../../../ui/ListFormHeader.js';
import { ListItemCard } from '../../../ui/ListItemCard.js';
import { RichTextField } from '../../../ui/RichTextField.js';
import { generateId } from '../../../utils/generateId.js';
import { SECTION_BY_ID } from '../sectionConfig.js';
import { useListSection } from '../useListSection.js';

function emptyAward(): Award {
  return {
    id: generateId('award'),
    title: '',
    awarder: '',
    date: '',
  };
}

const sectionDef = SECTION_BY_ID.get('awards');
const summarize = sectionDef?.summarize ?? (() => '');

export function AwardsForm(props: SlotFormProps) {
  void props;
  const { t } = useTranslation();
  const { items, add, remove, patch } = useListSection<Award>('awards', emptyAward);

  return (
    <div className="flex flex-col gap-3">
      <ListFormHeader count={items.length} onAdd={add} />

      <div className="flex flex-col">
        {items.map((a) => (
          <ListItemCard
            key={a.id}
            summary={summarize(a as unknown as Record<string, unknown>, t)}
            defaultOpen={!a.title}
            onRemove={() => {
              remove(a.id);
            }}
          >
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field
                  label={t('awards.title')}
                  value={a.title}
                  onChange={(e) => {
                    patch(a.id, { title: e.target.value });
                  }}
                />
                <Field
                  label={t('awards.awarder')}
                  value={a.awarder ?? ''}
                  onChange={(e) => {
                    patch(a.id, { awarder: e.target.value });
                  }}
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field
                  label={t('awards.date')}
                  placeholder="YYYY-MM"
                  value={a.date ?? ''}
                  onChange={(e) => {
                    patch(a.id, { date: e.target.value });
                  }}
                />
              </div>
              <RichTextField
                label={t('awards.summary')}
                value={a.summary ?? ''}
                onChange={(html) => {
                  patch(a.id, { summary: html });
                }}
              />
            </div>
          </ListItemCard>
        ))}
      </div>
    </div>
  );
}
