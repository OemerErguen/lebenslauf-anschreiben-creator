import type { Locale } from '@cv/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllDesigns } from '@cv/layout-engine';
import { useActiveCvVariant, useCvVariantsStore } from '../../state/cvVariantsStore.js';
import { useActiveDesign, useDesignStore } from '../../state/designStore.js';
import { useSettingsStore } from '../../state/settingsStore.js';
import { ToggleGroup } from '../../ui/ToggleGroup.js';
import { TokenEditor } from '../designer/TokenEditor.js';

/**
 * Top-level toolbar displayed above both editor and preview panes.
 * Contains design selector, document language, design customization button, and document type toggle.
 */
export function DocumentToolbar() {
  const { t } = useTranslation();
  const design = useActiveDesign();
  const activeDesignId = useDesignStore((s) => s.activeDesignId);
  const applyDesign = useDesignStore((s) => s.applyDesign);
  const activeDocumentType = useDesignStore((s) => s.activeDocumentType);
  const setActiveDocumentType = useDesignStore((s) => s.setActiveDocumentType);
  const uiLocale = useSettingsStore((s) => s.settings.uiLocale);
  const activeVariant = useActiveCvVariant();
  const setDocumentLocale = useCvVariantsStore((s) => s.setDocumentLocale);
  const documentLocale: Locale = activeVariant?.documentLocale ?? 'de';
  const [designEditorOpen, setDesignEditorOpen] = useState(false);

  const designs = getAllDesigns();

  if (!design) return null;

  const localeOptions = design.supportedLocales.map((loc) => ({
    value: loc,
    label: loc === 'de' ? 'Deutsch' : 'English',
  }));

  return (
    <>
      <div className="flex shrink-0 flex-wrap items-center gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-2 sm:gap-3 sm:px-6">
        {/* Design selector with label */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">{t('toolbar.design')}</span>
          <div className="relative">
            <select
              value={activeDesignId}
              onChange={(e) => {
                applyDesign(e.target.value);
              }}
              className="appearance-none rounded-md border border-slate-300 bg-white py-1.5 pl-3 pr-8 text-sm font-medium shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            >
              {designs.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name[uiLocale]}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </div>
        </div>

        {/* Document language with label */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">{t('toolbar.language')}</span>
          <div className="relative">
            <select
              value={documentLocale}
              onChange={(e) => {
                if (activeVariant) setDocumentLocale(activeVariant.id, e.target.value as Locale);
              }}
              className="appearance-none rounded-md border border-slate-300 bg-white py-1.5 pl-3 pr-8 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            >
              {localeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </div>
        </div>

        {/* Design customization button */}
        <button
          type="button"
          onClick={() => {
            setDesignEditorOpen(true);
          }}
          className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          >
            <circle cx="8" cy="8" r="2.5" />
            <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.1 3.1l1.4 1.4M11.5 11.5l1.4 1.4M3.1 12.9l1.4-1.4M11.5 4.5l1.4-1.4" />
          </svg>
          {t('toolbar.customize')}
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Document type toggle */}
        {design.documentTypes.length > 1 && (
          <ToggleGroup
            options={design.documentTypes.map((dt) => ({
              value: dt,
              label: t(`documentTypes.${dt}`),
            }))}
            value={activeDocumentType}
            onChange={(v) => {
              setActiveDocumentType(v);
            }}
          />
        )}
      </div>

      {/* Design customization dialog */}
      {designEditorOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-20"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDesignEditorOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setDesignEditorOpen(false);
          }}
        >
          <div className="max-h-[70vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                {t('toolbar.customizeTitle')}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setDesignEditorOpen(false);
                }}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </div>
            <TokenEditor />
          </div>
        </div>
      )}
    </>
  );
}
