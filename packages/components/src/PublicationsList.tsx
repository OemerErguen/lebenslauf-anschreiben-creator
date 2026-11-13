import type { ComponentRenderProps } from '@cv/layout-engine';
import { EntryUrl } from './EntryUrl.js';
import { formatIsoDate } from './format.js';
import { getLabel } from './labels.js';
import { optStr } from './optionUtils.js';
import { toHtml } from './renderHtml.js';

/**
 *
 * @param root0
 * @returns React element displaying the publications list, or null if empty
 */
export function PublicationsList({ resume, locale, tokens, slot }: ComponentRenderProps) {
  if (resume.publications.length === 0) return null;

  const isMain = slot === 'main';
  const sectionCls = isMain ? 'cv-section cv-main-section' : 'cv-section';

  return (
    <section className={sectionCls}>
      <h2
        className={`cv-section-title cv-section-title--${optStr(tokens.options, 'sectionTitleStyle', 'uppercase-spaced')}`}
      >
        {getLabel(locale, 'publications')}
      </h2>
      {isMain ? (
        resume.publications.map((p) => (
          <article key={p.id} className="cv-entry">
            <div className="cv-entry-date">{formatIsoDate(p.releaseDate, locale)}</div>
            <div className="cv-entry-head">
              <div className="cv-entry-title">{p.name}</div>
              {(p.publisher || p.url) && (
                <div className="cv-entry-org">
                  {p.publisher}
                  {p.publisher && p.url && ' · '}
                  <EntryUrl url={p.url} />
                </div>
              )}
            </div>
            {p.summary && (
              <div
                className="cv-entry-summary"
                dangerouslySetInnerHTML={{ __html: toHtml(p.summary) }}
              />
            )}
          </article>
        ))
      ) : (
        <div className="cv-cert-sidebar">
          {resume.publications.map((p) => (
            <div key={p.id} className="cv-cert-sidebar-item">
              <div className="cv-cert-sidebar-name">{p.name}</div>
              <div className="cv-cert-sidebar-meta">
                {p.publisher && <span>{p.publisher}</span>}
                {p.publisher && p.url && <span> · </span>}
                <EntryUrl url={p.url} />
                {(p.publisher || p.url) && p.releaseDate && <span> · </span>}
                {p.releaseDate && <span>{formatIsoDate(p.releaseDate, locale)}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
