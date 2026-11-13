import type { SlotFormProps } from '../formRegistry.js';
import type { Publication } from '@cv/core';
import { useTranslation } from 'react-i18next';
import { Field } from '../../../ui/Field.js';
import { ListFormHeader } from '../../../ui/ListFormHeader.js';
import { ListItemCard } from '../../../ui/ListItemCard.js';
import { RichTextField } from '../../../ui/RichTextField.js';
import { generateId } from '../../../utils/generateId.js';
import { SECTION_BY_ID } from '../sectionConfig.js';
import { useListSection } from '../useListSection.js';

function emptyPublication(): Publication {
  return {
    id: generateId('pub'),
    name: '',
    publisher: '',
    releaseDate: '',
  };
}

const sectionDef = SECTION_BY_ID.get('publications');
const summarize = sectionDef?.summarize ?? (() => '');

export function PublicationsForm(props: SlotFormProps) {
  void props;
  const { t } = useTranslation();
  const { items, add, remove, patch } = useListSection<Publication>(
    'publications',
    emptyPublication,
  );

  return (
    <div className="flex flex-col gap-3">
      <ListFormHeader count={items.length} onAdd={add} />

      <div className="flex flex-col">
        {items.map((p) => (
          <ListItemCard
            key={p.id}
            summary={summarize(p as unknown as Record<string, unknown>, t)}
            defaultOpen={!p.name}
            onRemove={() => {
              remove(p.id);
            }}
          >
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field
                  label={t('publications.name')}
                  value={p.name}
                  onChange={(e) => {
                    patch(p.id, { name: e.target.value });
                  }}
                />
                <Field
                  label={t('publications.publisher')}
                  value={p.publisher ?? ''}
                  onChange={(e) => {
                    patch(p.id, { publisher: e.target.value });
                  }}
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field
                  label={t('publications.releaseDate')}
                  placeholder="YYYY-MM"
                  value={p.releaseDate ?? ''}
                  onChange={(e) => {
                    patch(p.id, { releaseDate: e.target.value });
                  }}
                />
                <Field
                  label={t('publications.url')}
                  type="url"
                  value={p.url ?? ''}
                  onChange={(e) => {
                    patch(p.id, { url: e.target.value });
                  }}
                />
              </div>
              <RichTextField
                label={t('publications.summary')}
                value={p.summary ?? ''}
                onChange={(html) => {
                  patch(p.id, { summary: html });
                }}
              />
            </div>
          </ListItemCard>
        ))}
      </div>
    </div>
  );
}
