import type { ComponentRenderProps } from '@cv/layout-engine';
import { formatIsoDate } from './format.js';
import { getLabel } from './labels.js';
import { optStr } from './optionUtils.js';
import { toHtml } from './renderHtml.js';

/**
 *
 * @param root0
 * @returns React element displaying the awards list, or null if empty
 */
export function AwardsList({ resume, locale, tokens, slot }: ComponentRenderProps) {
  if (resume.awards.length === 0) return null;

  const isMain = slot === 'main';
  const sectionCls = isMain ? 'cv-section cv-main-section' : 'cv-section';

  return (
    <section className={sectionCls}>
      <h2
        className={`cv-section-title cv-section-title--${optStr(tokens.options, 'sectionTitleStyle', 'uppercase-spaced')}`}
      >
        {getLabel(locale, 'awards')}
      </h2>
      {isMain ? (
        resume.awards.map((a) => (
          <article key={a.id} className="cv-entry">
            <div className="cv-entry-date">{formatIsoDate(a.date, locale)}</div>
            <div className="cv-entry-head">
              <div className="cv-entry-title">{a.title}</div>
              {a.awarder && <div className="cv-entry-org">{a.awarder}</div>}
            </div>
            {a.summary && (
              <div
                className="cv-entry-summary"
                dangerouslySetInnerHTML={{ __html: toHtml(a.summary) }}
              />
            )}
          </article>
        ))
      ) : (
        <div className="cv-cert-sidebar">
          {resume.awards.map((a) => (
            <div key={a.id} className="cv-cert-sidebar-item">
              <div className="cv-cert-sidebar-name">{a.title}</div>
              <div className="cv-cert-sidebar-meta">
                {a.awarder && <span>{a.awarder}</span>}
                {a.awarder && a.date && <span> · </span>}
                {a.date && <span>{formatIsoDate(a.date, locale)}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
