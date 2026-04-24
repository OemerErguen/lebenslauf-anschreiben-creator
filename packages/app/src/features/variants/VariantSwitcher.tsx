import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useActiveCoverLetterVariant, useCoverLetterVariantsStore } from '../../state/coverLetterVariantsStore.js';
import { useActiveCvVariant, useCvVariantsStore } from '../../state/cvVariantsStore.js';
import { useDesignStore } from '../../state/designStore.js';
import { VariantManagerModal } from './VariantManagerModal.js';

/**
 * Active-variant selector shown above the editor. Switches the active CV
 * variant or cover-letter variant depending on the current document type.
 * Also exposes a "Manage variants…" entry that opens the full manager modal.
 */
export function VariantSwitcher() {
  const activeDocumentType = useDesignStore((s) => s.activeDocumentType);
  const [managerOpen, setManagerOpen] = useState(false);

  const isCoverLetter = activeDocumentType === 'anschreiben';

  return (
    <>
      {isCoverLetter ? (
        <CoverLetterVariantPicker onManage={() => { setManagerOpen(true); }} />
      ) : (
        <CvVariantPicker onManage={() => { setManagerOpen(true); }} />
      )}

      {managerOpen && (
        <VariantManagerModal
          documentType={activeDocumentType}
          onClose={() => {
            setManagerOpen(false);
          }}
        />
      )}
    </>
  );
}

function CvVariantPicker({ onManage }: { onManage: () => void }) {
  const { t } = useTranslation();
  const variants = useCvVariantsStore((s) => s.variants);
  const active = useActiveCvVariant();
  const setActiveVariantId = useCvVariantsStore((s) => s.setActiveVariantId);

  return (
    <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5">
      <span className="shrink-0 text-xs font-medium text-slate-500">
        {t('variants.activeCv', { defaultValue: 'Aktive CV-Variante' })}
      </span>
      <select
        className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        value={active?.id ?? ''}
        onChange={(e) => {
          setActiveVariantId(e.target.value || undefined);
        }}
      >
        {variants.length === 0 && (
          <option value="">{t('variants.none', { defaultValue: '— keine Variante —' })}</option>
        )}
        {variants.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={onManage}
        className="shrink-0 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        title={t('variants.manage', { defaultValue: 'Varianten verwalten' })}
      >
        {t('variants.manageShort', { defaultValue: 'Verwalten' })}
      </button>
    </div>
  );
}

function CoverLetterVariantPicker({ onManage }: { onManage: () => void }) {
  const { t } = useTranslation();
  const variants = useCoverLetterVariantsStore((s) => s.variants);
  const active = useActiveCoverLetterVariant();
  const setActiveVariantId = useCoverLetterVariantsStore((s) => s.setActiveVariantId);

  return (
    <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5">
      <span className="shrink-0 text-xs font-medium text-slate-500">
        {t('variants.activeLetter', { defaultValue: 'Aktives Anschreiben' })}
      </span>
      <select
        className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        value={active?.id ?? ''}
        onChange={(e) => {
          setActiveVariantId(e.target.value || undefined);
        }}
      >
        {variants.length === 0 && (
          <option value="">{t('variants.none', { defaultValue: '— keine Variante —' })}</option>
        )}
        {variants.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={onManage}
        className="shrink-0 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        title={t('variants.manage', { defaultValue: 'Varianten verwalten' })}
      >
        {t('variants.manageShort', { defaultValue: 'Verwalten' })}
      </button>
    </div>
  );
}
