import type { ComponentRenderProps } from '@cv/layout-engine';
import { toHtml } from './renderHtml.js';

/**
 *
 * @param root0
 * @returns React element displaying custom sections, or null if empty
 */
export function CustomSection({ resume, tokens }: ComponentRenderProps) {
  if (resume.custom.length === 0) return null;

  return (
    <>
      {resume.custom.map((c) => (
        <section key={c.id} className="cv-section cv-main-section">
          <h2
            className={`cv-section-title cv-section-title--${(tokens.options['sectionTitleStyle'] as string) ?? 'uppercase-spaced'}`}
          >
            {c.title}
          </h2>
          {c.items.map((item) => (
            <article key={item.id} className="cv-entry">
              {item.heading && (
                <div className="cv-entry-head">
                  <div className="cv-entry-title">{item.heading}</div>
                </div>
              )}
              <div
                className="cv-entry-summary"
                dangerouslySetInnerHTML={{ __html: toHtml(item.body) }}
              />
            </article>
          ))}
        </section>
      ))}
    </>
  );
}
