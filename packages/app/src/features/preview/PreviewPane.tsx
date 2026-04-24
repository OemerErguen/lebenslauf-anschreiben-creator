import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { resolveCoverLetter, resolveResume } from '@cv/core';
import { useCoverLetterProfileStore } from '../../state/coverLetterProfileStore.js';
import { useActiveCoverLetterVariant } from '../../state/coverLetterVariantsStore.js';
import { useActiveCvVariant } from '../../state/cvVariantsStore.js';
import { useActiveDesign, useDesignStore } from '../../state/designStore.js';
import { useResumeStore } from '../../state/resumeStore.js';
import { usePagedPreview } from './usePagedPreview.js';

const ZOOM_STEPS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2] as const;
/** 210mm in px at 96 dpi */
const A4_WIDTH_PX = 793.7;
const PADDING_PX = 32;

export function PreviewPane() {
  const { t } = useTranslation();

  const profileResume = useResumeStore((s) => s.resume);
  const coverLetterProfile = useCoverLetterProfileStore((s) => s.profile);
  const activeCvVariant = useActiveCvVariant();
  const activeClVariant = useActiveCoverLetterVariant();
  const design = useActiveDesign();
  const overrides = useDesignStore((s) => s.overrides);
  const activeDocumentType = useDesignStore((s) => s.activeDocumentType);

  const resolvedResume = useMemo(
    () => (activeCvVariant ? resolveResume(profileResume, activeCvVariant) : profileResume),
    [profileResume, activeCvVariant],
  );

  const resolvedCoverLetter = useMemo(
    () =>
      activeClVariant ? resolveCoverLetter(coverLetterProfile, activeClVariant) : undefined,
    [coverLetterProfile, activeClVariant],
  );

  const documentLocale = activeCvVariant?.documentLocale ?? 'de';

  const { hostRef, pageCount, generating } = usePagedPreview({
    resume: resolvedResume,
    ...(resolvedCoverLetter ? { coverLetter: resolvedCoverLetter } : {}),
    design,
    overrides,
    locale: documentLocale,
    documentType: activeDocumentType,
  });

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [fitZoom, setFitZoom] = useState(1);
  const [zoom, setZoom] = useState<number | null>(null); // null = fit-to-width

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const update = () => {
      const available = el.clientWidth - PADDING_PX;
      setFitZoom(Math.min(available / A4_WIDTH_PX, 1));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      ro.disconnect();
    };
  }, []);

  const activeZoom = zoom ?? fitZoom;

  const zoomIn = useCallback(() => {
    setZoom((z) => {
      const current = z ?? fitZoom;
      const next = ZOOM_STEPS.find((s) => s > current);
      return next ?? current;
    });
  }, [fitZoom]);

  const zoomOut = useCallback(() => {
    setZoom((z) => {
      const current = z ?? fitZoom;
      const prev = [...ZOOM_STEPS].reverse().find((s) => s < current);
      return prev ?? current;
    });
  }, [fitZoom]);

  const zoomReset = useCallback(() => {
    setZoom(null);
  }, []);

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between bg-slate-100 px-3 py-1.5">
        <span className="text-xs text-slate-500">
          {pageCount > 0 &&
            `${pageCount} ${pageCount === 1 ? t('preview.page') : t('preview.pages')}`}
        </span>

        <div className="flex items-center gap-1">
          {generating && (
            <span className="mr-2 flex items-center gap-1.5 text-xs text-slate-400">
              <svg className="h-3 w-3 animate-spin" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                <path
                  d="M14 8a6 6 0 00-6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              {t('preview.rendering')}
            </span>
          )}

          <button
            type="button"
            onClick={zoomOut}
            disabled={activeZoom <= ZOOM_STEPS[0]}
            className="rounded p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent"
            title={t('preview.zoomOut')}
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="8" x2="13" y2="8" />
            </svg>
          </button>

          <button
            type="button"
            onClick={zoomReset}
            className="min-w-12 rounded px-1 py-0.5 text-center text-xs text-slate-600 hover:bg-slate-200"
            title={t('preview.zoomReset')}
          >
            {Math.round(activeZoom * 100)}%
          </button>

          <button
            type="button"
            onClick={zoomIn}
            disabled={activeZoom >= (ZOOM_STEPS.at(-1) ?? activeZoom)}
            className="rounded p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent"
            title={t('preview.zoomIn')}
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="8" x2="13" y2="8" />
              <line x1="8" y1="3" x2="8" y2="13" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="scrollbar-none relative min-h-0 flex-1 overflow-auto bg-slate-200 py-4"
      >
        <div
          ref={hostRef}
          style={{
            width: '210mm',
            transformOrigin: 'top center',
            transform: `scale(${activeZoom})`,
            margin: '0 auto',
          }}
        />
      </div>
    </div>
  );
}
