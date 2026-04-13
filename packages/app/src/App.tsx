import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DocumentToolbar } from './features/editor/DocumentToolbar.js';
import { ResumeEditor } from './features/editor/ResumeEditor.js';
import { IoButtons } from './features/io/IoButtons.js';
import { triggerPreviewPrint } from './features/preview/previewController.js';
import { PreviewPane } from './features/preview/PreviewPane.js';
import { useCoverLetterStore } from './state/coverLetterStore.js';
import { useDesignStore } from './state/designStore.js';
import { useResumeStore } from './state/resumeStore.js';
import { useSettingsStore } from './state/settingsStore.js';

export function App() {
  const { t, i18n } = useTranslation();
  const uiLocale = useSettingsStore((s) => s.settings.uiLocale);
  const setUiLocale = useSettingsStore((s) => s.setUiLocale);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  useEffect(() => {
    void i18n.changeLanguage(uiLocale);
  }, [i18n, uiLocale]);

  const toggleLocale = () => {
    setUiLocale(uiLocale === 'de' ? 'en' : 'de');
  };

  const handleClearAll = () => {
    // Set all stores to truly empty state
    useResumeStore.getState().setResume({
      basics: { name: '', profiles: [] },
      work: [],
      education: [],
      skills: [],
      languages: [],
      projects: [],
      certificates: [],
      publications: [],
      awards: [],
      volunteer: [],
      interests: [],
      references: [],
      custom: [],
    });

    useCoverLetterStore.getState().setCoverLetter({
      sender: { name: '' },
      recipient: { name: '' },
      subject: '',
      reference: '',
      salutation: '',
      paragraphs: [],
      closing: '',
      din5008Form: 'B',
      showFoldMarks: true,
      showSenderInfo: true,
    });

    useDesignStore.getState().applyDesign('sidebar-left');

    useSettingsStore.getState().setSettings({
      uiLocale: useSettingsStore.getState().settings.uiLocale,
      documentLocale: 'de',
      selectedTemplateId: 'classic-de',
      templateOptions: {},
      sectionOrder: [
        'personal',
        'summary',
        'experience',
        'education',
        'skills',
        'languages',
        'projects',
        'certificates',
        'interests',
      ],
      sectionVisibility: {
        personal: false,
        summary: false,
        experience: false,
        education: false,
        skills: false,
        languages: false,
        projects: false,
        certificates: false,
        publications: false,
        awards: false,
        volunteer: false,
        interests: false,
        references: false,
        custom: false,
      },
      paperSize: 'A4',
    });

    setClearDialogOpen(false);
  };

  return (
    <div className="flex h-screen flex-col" data-cv-app-chrome>
      {/* Clear-all warning dialog */}
      {clearDialogOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-20"
          onClick={(e) => {
            if (e.target === e.currentTarget) setClearDialogOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setClearDialogOpen(false);
          }}
        >
          <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-3 flex items-center gap-2 text-red-600">
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="text-base font-semibold">{t('actions.clearAllTitle')}</h2>
            </div>
            <p className="mb-5 text-sm text-slate-600">{t('actions.clearAllConfirm')}</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setClearDialogOpen(false);
                }}
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {t('actions.clearAllCancel')}
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
              >
                {t('actions.clearAll')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App header */}
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-2 sm:px-6">
        <h1 className="shrink-0 text-sm font-semibold text-slate-900 sm:text-base">
          {t('app.title')}
        </h1>

        <div className="flex items-center gap-2">
          <IoButtons />

          {/* Clear all data */}
          <button
            type="button"
            onClick={() => {
              setClearDialogOpen(true);
            }}
            className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100"
          >
            {t('actions.clearAll')}
          </button>

          {/* Download PDF */}
          <button
            type="button"
            onClick={triggerPreviewPrint}
            className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
          >
            {t('actions.downloadPdf')}
          </button>

          {/* Language toggle — globe icon */}
          <button
            type="button"
            onClick={toggleLocale}
            className="flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
            title={t('settings.uiLocale')}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <circle cx="8" cy="8" r="6.5" />
              <ellipse cx="8" cy="8" rx="3" ry="6.5" />
              <line x1="1.5" y1="8" x2="14.5" y2="8" />
            </svg>
            {uiLocale.toUpperCase()}
          </button>
        </div>
      </header>

      {/* Document toolbar: design, language, settings, doc type toggle */}
      <DocumentToolbar />

      {/* Two-column layout: editor + preview */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 lg:flex-row lg:gap-6 lg:p-6">
        <section className="min-h-0 min-w-0 basis-1/2 overflow-y-auto scrollbar-none">
          <div className="flex flex-col gap-4">
            <ResumeEditor />
          </div>
        </section>

        <section className="min-h-0 min-w-0 basis-1/2 overflow-hidden rounded-lg border border-slate-200 bg-slate-200">
          <PreviewPane />
        </section>
      </div>
    </div>
  );
}
