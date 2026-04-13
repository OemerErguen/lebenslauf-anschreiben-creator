import type { SlotFormProps } from '../formRegistry.js';
import type { Education } from '@cv/core';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../ui/Button.js';
import { Field } from '../../../ui/Field.js';
import { ListItemCard } from '../../../ui/ListItemCard.js';
import { RichTextField } from '../../../ui/RichTextField.js';
import { SECTION_BY_ID } from '../sectionConfig.js';
import { useListSection } from '../useListSection.js';

function emptyEducation(): Education {
  return {
    id: `edu-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    institution: '',
    area: '',
    studyType: '',
    startDate: '',
    endDate: '',
    courses: [],
  };
}

const sectionDef = SECTION_BY_ID.get('education');
const summarize = sectionDef?.summarize ?? (() => '');

export function EducationForm(props: SlotFormProps) {
  void props;
  const { t } = useTranslation();
  const { items, add, remove, patch } = useListSection<Education>('education', emptyEducation);

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

      <div className="flex flex-col">
        {items.map((e) => (
          <ListItemCard
            key={e.id}
            summary={summarize(e as unknown as Record<string, unknown>, t)}
            defaultOpen={!e.institution && !e.studyType}
            onRemove={() => {
              remove(e.id);
            }}
          >
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label={t('education.degree')}
                  value={e.studyType ?? ''}
                  onChange={(ev) => {
                    patch(e.id, { studyType: ev.target.value });
                  }}
                />
                <Field
                  label={t('education.institution')}
                  value={e.institution}
                  onChange={(ev) => {
                    patch(e.id, { institution: ev.target.value });
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label={t('education.fieldOfStudy')}
                  value={e.area ?? ''}
                  onChange={(ev) => {
                    patch(e.id, { area: ev.target.value });
                  }}
                />
                <Field
                  label={t('education.grade')}
                  value={e.score ?? ''}
                  onChange={(ev) => {
                    patch(e.id, { score: ev.target.value });
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label={t('education.startDate')}
                  placeholder="YYYY-MM"
                  value={e.startDate ?? ''}
                  onChange={(ev) => {
                    patch(e.id, { startDate: ev.target.value });
                  }}
                />
                <Field
                  label={t('education.endDate')}
                  placeholder="YYYY-MM"
                  value={e.endDate ?? ''}
                  onChange={(ev) => {
                    patch(e.id, { endDate: ev.target.value });
                  }}
                />
              </div>
              <Field
                label={t('education.location')}
                value={e.location ?? ''}
                onChange={(ev) => {
                  patch(e.id, { location: ev.target.value });
                }}
              />
              <RichTextField
                label={t('education.description')}
                value={e.description ?? ''}
                onChange={(html) => {
                  patch(e.id, { description: html });
                }}
              />
            </div>
          </ListItemCard>
        ))}
      </div>
    </div>
  );
}
