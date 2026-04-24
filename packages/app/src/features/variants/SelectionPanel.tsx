import type { CVVariant, Resume, SectionId } from '@cv/core';
import { useTranslation } from 'react-i18next';
import { useActiveCvVariant, useCvVariantsStore } from '../../state/cvVariantsStore.js';
import { useResumeStore } from '../../state/resumeStore.js';
import { Toggle } from '../../ui/Toggle.js';
import { SECTION_CONFIGS } from '../editor/sectionConfig.js';

type ResumeListKey = Extract<keyof Resume, 'work' | 'education' | 'skills' | 'languages' | 'projects' | 'certificates' | 'publications' | 'awards' | 'volunteer' | 'interests' | 'references' | 'custom'>;

const SECTION_TO_RESUME_KEY: Record<SectionId, ResumeListKey | null> = {
  personal: null,
  summary: null,
  experience: 'work',
  education: 'education',
  skills: 'skills',
  languages: 'languages',
  projects: 'projects',
  certificates: 'certificates',
  publications: 'publications',
  awards: 'awards',
  volunteer: 'volunteer',
  interests: 'interests',
  references: 'references',
  custom: 'custom',
};

/**
 * Per-variant selection + ordering UI. For each list-backed section, shows the
 * pool items with a checkbox (include in this CV) and up/down reorder arrows.
 * Also lets the user toggle section visibility and reorder sections.
 *
 * Section visibility and section order are stored on the variant; item
 * selection per section is stored sparsely — empty/missing = include all in
 * pool order.
 */
export function SelectionPanel() {
  const { t } = useTranslation();
  const variant = useActiveCvVariant();
  const resume = useResumeStore((s) => s.resume);

  if (!variant) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
        {t('selectionPanel.noVariant', {
          defaultValue:
            'Keine CV-Variante aktiv. Leg zuerst eine Variante im Variantenmanager an.',
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <VariantMeta variant={variant} />
      <SectionOrderList variant={variant} resume={resume} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Variant metadata (name, locale, paper size)
// ---------------------------------------------------------------------------

function VariantMeta({ variant }: { variant: CVVariant }) {
  const { t } = useTranslation();
  const setName = useCvVariantsStore((s) => s.setVariantName);
  const setDocumentLocale = useCvVariantsStore((s) => s.setDocumentLocale);
  const setPaperSize = useCvVariantsStore((s) => s.setPaperSize);
  const patchVariant = useCvVariantsStore((s) => s.patchVariant);

  return (
    <section className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {t('selectionPanel.metaTitle', { defaultValue: 'Variante' })}
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-xs font-medium text-slate-500">
            {t('variants.name', { defaultValue: 'Name' })}
          </span>
          <input
            value={variant.name}
            onChange={(e) => {
              setName(variant.id, e.target.value);
            }}
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-xs font-medium text-slate-500">
            {t('variants.targetCompany', { defaultValue: 'Zielunternehmen' })}
          </span>
          <input
            value={variant.targetCompany ?? ''}
            onChange={(e) => {
              patchVariant(variant.id, { targetCompany: e.target.value });
            }}
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-xs font-medium text-slate-500">
            {t('variants.targetRole', { defaultValue: 'Zielrolle' })}
          </span>
          <input
            value={variant.targetRole ?? ''}
            onChange={(e) => {
              patchVariant(variant.id, { targetRole: e.target.value });
            }}
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-xs font-medium text-slate-500">
            {t('variants.notes', { defaultValue: 'Notizen' })}
          </span>
          <input
            value={variant.notes ?? ''}
            onChange={(e) => {
              patchVariant(variant.id, { notes: e.target.value });
            }}
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-xs font-medium text-slate-500">
            {t('toolbar.language', { defaultValue: 'Sprache' })}
          </span>
          <select
            value={variant.documentLocale}
            onChange={(e) => {
              setDocumentLocale(variant.id, e.target.value as 'de' | 'en');
            }}
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm shadow-sm"
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-xs font-medium text-slate-500">
            {t('variants.paperSize', { defaultValue: 'Papier' })}
          </span>
          <select
            value={variant.paperSize}
            onChange={(e) => {
              setPaperSize(variant.id, e.target.value as 'A4' | 'Letter');
            }}
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm shadow-sm"
          >
            <option value="A4">A4</option>
            <option value="Letter">Letter</option>
          </select>
        </label>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Sections list — reorder + visibility + per-section item selection
// ---------------------------------------------------------------------------

function SectionOrderList({ variant, resume }: { variant: CVVariant; resume: Resume }) {
  const { t } = useTranslation();
  const setSectionOrder = useCvVariantsStore((s) => s.setSectionOrder);
  const toggleVisibility = useCvVariantsStore((s) => s.toggleSectionVisibility);

  const move = (from: number, to: number) => {
    const order = [...variant.sectionOrder];
    const [item] = order.splice(from, 1);
    if (!item) return;
    order.splice(to, 0, item);
    setSectionOrder(variant.id, order);
  };

  return (
    <section className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {t('selectionPanel.sectionsTitle', { defaultValue: 'Abschnitte & Auswahl' })}
      </h3>
      <p className="text-xs text-slate-500">
        {t('selectionPanel.hint', {
          defaultValue:
            'Reihenfolge per Pfeil. Sichtbarkeit per Schalter. Einträge pro Abschnitt aktivieren und ordnen.',
        })}
      </p>
      <div className="flex flex-col gap-1.5">
        {variant.sectionOrder.map((sectionId, idx) => (
          <SectionRow
            key={sectionId}
            sectionId={sectionId}
            isFirst={idx === 0}
            isLast={idx === variant.sectionOrder.length - 1}
            visible={variant.sectionVisibility[sectionId] !== false}
            onToggleVisible={() => {
              toggleVisibility(variant.id, sectionId);
            }}
            onMoveUp={() => {
              move(idx, idx - 1);
            }}
            onMoveDown={() => {
              move(idx, idx + 1);
            }}
            variant={variant}
            resume={resume}
          />
        ))}
      </div>
    </section>
  );
}

interface SectionRowProps {
  sectionId: SectionId;
  isFirst: boolean;
  isLast: boolean;
  visible: boolean;
  onToggleVisible: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  variant: CVVariant;
  resume: Resume;
}

function SectionRow({
  sectionId,
  isFirst,
  isLast,
  visible,
  onToggleVisible,
  onMoveUp,
  onMoveDown,
  variant,
  resume,
}: SectionRowProps) {
  const { t } = useTranslation();
  const cfg = SECTION_CONFIGS.find((s) => s.id === sectionId);
  const title = t(cfg?.titleKey ?? `sections.${sectionId}`, { defaultValue: sectionId });
  const resumeKey = SECTION_TO_RESUME_KEY[sectionId];

  return (
    <div className="rounded-md border border-slate-200 bg-white">
      <div className={`flex items-center gap-2 px-3 py-2 ${!visible ? 'opacity-50' : ''}`}>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            disabled={isFirst}
            onClick={onMoveUp}
            className="rounded p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
            title={t('designer.moveUp', { defaultValue: 'Nach oben' })}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 8.5l4-4 4 4" />
            </svg>
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={onMoveDown}
            className="rounded p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
            title={t('designer.moveDown', { defaultValue: 'Nach unten' })}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 5.5l4 4 4-4" />
            </svg>
          </button>
        </div>
        <span className="flex-1 text-sm font-medium text-slate-700">{title}</span>
        <Toggle checked={visible} onChange={onToggleVisible} />
      </div>
      {visible && resumeKey && cfg?.isList && (
        <ItemSelectionList
          sectionId={sectionId}
          items={resume[resumeKey] as { id: string; name?: string; position?: string; title?: string; institution?: string; language?: string }[]}
          variant={variant}
          summarize={cfg.summarize}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Per-section item list with checkboxes + reorder
// ---------------------------------------------------------------------------

type SummarizeFn = NonNullable<(typeof SECTION_CONFIGS)[number]['summarize']>;

interface ItemSelectionListProps {
  sectionId: SectionId;
  items: { id: string; name?: string }[];
  variant: CVVariant;
  summarize: SummarizeFn | undefined;
}

function ItemSelectionList({ sectionId, items, variant, summarize }: ItemSelectionListProps) {
  const { t } = useTranslation();
  const toggleItemSelection = useCvVariantsStore((s) => s.toggleItemSelection);
  const moveSelectedItem = useCvVariantsStore((s) => s.moveSelectedItem);
  const setSectionSelection = useCvVariantsStore((s) => s.setSectionSelection);

  if (items.length === 0) {
    return (
      <div className="border-t border-slate-100 px-3 py-2 text-xs text-slate-400">
        {t('selectionPanel.noPoolItems', {
          defaultValue:
            'Noch keine Einträge im Profil. Leg sie zuerst unter "Profil" an, dann erscheinen sie hier.',
        })}
      </div>
    );
  }

  const poolOrder = items.map((i) => i.id);
  const explicit = variant.selections[sectionId];
  const usingCustomOrder = Boolean(explicit && explicit.length > 0);

  // Display order: if a custom selection exists, use it (and then pool items not in it, unchecked).
  // Else, show pool order.
  const displayOrder: { id: string; included: boolean; indexInSelection: number }[] = (() => {
    if (!usingCustomOrder) {
      return items.map((item, i) => ({ id: item.id, included: true, indexInSelection: i }));
    }
    const included = explicit ?? [];
    const rest = poolOrder.filter((id) => !included.includes(id));
    return [
      ...included.map((id, i) => ({ id, included: true, indexInSelection: i })),
      ...rest.map((id) => ({ id, included: false, indexInSelection: -1 })),
    ];
  })();

  const itemById = new Map(items.map((i) => [i.id, i]));

  return (
    <div className="flex flex-col border-t border-slate-100">
      <div className="flex items-center justify-between px-3 py-1.5 text-xs">
        <span className="text-slate-500">
          {usingCustomOrder
            ? t('selectionPanel.custom', { defaultValue: 'Eigene Auswahl & Reihenfolge' })
            : t('selectionPanel.poolDefault', {
                defaultValue: 'Alle Einträge · Reihenfolge aus Profil',
              })}
        </span>
        {usingCustomOrder && (
          <button
            type="button"
            onClick={() => {
              setSectionSelection(variant.id, sectionId, []);
            }}
            className="text-xs text-slate-500 underline hover:text-slate-700"
          >
            {t('selectionPanel.reset', { defaultValue: 'Auf Profil-Reihenfolge zurücksetzen' })}
          </button>
        )}
      </div>
      <ul className="flex flex-col">
        {displayOrder.map((entry, visualIdx) => {
          const item = itemById.get(entry.id);
          if (!item) return null;
          const summary = summarize?.(item as unknown as Record<string, unknown>, t) ?? item.name ?? entry.id;
          const canMoveUp = entry.included && entry.indexInSelection > 0;
          const selectionLength = explicit?.length ?? items.length;
          const canMoveDown = entry.included && entry.indexInSelection < selectionLength - 1;

          return (
            <li
              key={entry.id}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm ${
                visualIdx > 0 ? 'border-t border-slate-50' : ''
              } ${!entry.included ? 'text-slate-400' : 'text-slate-700'}`}
            >
              <input
                type="checkbox"
                checked={entry.included}
                onChange={() => {
                  toggleItemSelection(variant.id, sectionId, entry.id, poolOrder);
                }}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
              />
              <span className="min-w-0 flex-1 truncate">{summary || entry.id}</span>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  disabled={!canMoveUp}
                  onClick={() => {
                    moveSelectedItem(
                      variant.id,
                      sectionId,
                      entry.indexInSelection,
                      entry.indexInSelection - 1,
                      poolOrder,
                    );
                  }}
                  className="rounded p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                  title={t('designer.moveUp', { defaultValue: 'Nach oben' })}
                >
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 8.5l4-4 4 4" />
                  </svg>
                </button>
                <button
                  type="button"
                  disabled={!canMoveDown}
                  onClick={() => {
                    moveSelectedItem(
                      variant.id,
                      sectionId,
                      entry.indexInSelection,
                      entry.indexInSelection + 1,
                      poolOrder,
                    );
                  }}
                  className="rounded p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                  title={t('designer.moveDown', { defaultValue: 'Nach unten' })}
                >
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 5.5l4 4 4-4" />
                  </svg>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
