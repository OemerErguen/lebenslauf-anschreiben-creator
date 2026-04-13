import type { UserOverrides } from './resolveDesign.js';
import type {
  AnschreibenConfig,
  ComponentRenderProps,
  DesignDefinition,
  DocumentType,
  ResolvedTokens,
} from './types.js';
import type { CoverLetter, Locale, Resume } from '@cv/core';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getComponent } from './registry.js';
import { resolveAllSlotOptions, resolveSlotAssignments, resolveTokens } from './resolveDesign.js';
import { designTokensToCss } from './tokensToCss.js';

/**
 * Render a resume (Lebenslauf) page with slot-based layout.
 * @param resume
 * @param design
 * @param tokens
 * @param overrides
 * @param locale
 * @param layoutCss
 * @param tokenCss
 * @returns Object containing the rendered HTML and CSS strings
 */
function renderSlotPage(
  resume: Resume,
  design: DesignDefinition,
  tokens: ResolvedTokens,
  overrides: UserOverrides,
  locale: Locale,
  layoutCss: string,
  tokenCss: string,
): { html: string; css: string } {
  const css = `${layoutCss}\n${tokenCss}`;
  const slotAssignments = resolveSlotAssignments(design, overrides);
  const slotHtmlParts: string[] = [];

  for (const slotName of Object.keys(design.slots)) {
    const assignments = slotAssignments[slotName] ?? [];
    const componentHtmlParts: string[] = [];

    for (const assignment of assignments) {
      const compDef = getComponent(assignment.componentId);
      if (!compDef) continue;

      const mergedOptions = { ...compDef.defaultOptions, ...assignment.options };
      const props: ComponentRenderProps = {
        resume,
        tokens,
        options: mergedOptions,
        locale,
        slot: slotName,
      };

      const html = renderToStaticMarkup(createElement(compDef.render, props));
      componentHtmlParts.push(html);
    }

    slotHtmlParts.push(`<div class="cv-slot-${slotName}">${componentHtmlParts.join('')}</div>`);
  }

  const html = `<div class="cv-page">${slotHtmlParts.join('')}</div>`;
  return { html, css };
}

/**
 * Render a cover letter (anschreiben) page — fallback for designs without anschreibenConfig.
 * Uses a simple single-column layout with design tokens.
 * @param coverLetter
 * @param resume
 * @param tokens
 * @param locale
 * @param tokenCss
 * @param renderCoverLetterComponent
 * @returns Object containing the rendered HTML and CSS strings
 */
function renderCoverLetterFallback(
  coverLetter: CoverLetter,
  resume: Resume,
  tokens: ResolvedTokens,
  locale: Locale,
  tokenCss: string,
  renderCoverLetterComponent?: (props: {
    coverLetter: CoverLetter;
    resume: Resume;
    tokens: ResolvedTokens;
    locale: Locale;
  }) => string,
): { html: string; css: string } {
  const css = tokenCss;

  if (renderCoverLetterComponent) {
    const html = renderCoverLetterComponent({ coverLetter, resume, tokens, locale });
    return { html, css };
  }

  // Fallback: simple text-based cover letter
  const paragraphsHtml = coverLetter.paragraphs
    .map((p) => `<p class="cv-cl-paragraph">${p}</p>`)
    .join('');

  const html = `<div class="cv-page cv-cover-letter">
    <div class="cv-cl-subject">${coverLetter.subject}</div>
    ${coverLetter.salutation ? `<div class="cv-cl-salutation">${coverLetter.salutation}</div>` : ''}
    <div class="cv-cl-body">${paragraphsHtml}</div>
    ${coverLetter.closing ? `<div class="cv-cl-closing">${coverLetter.closing}</div>` : ''}
  </div>`;

  return { html, css };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 *
 */
export interface RenderDesignPageOptions {
  resume: Resume;
  coverLetter?: CoverLetter | undefined;
  design: DesignDefinition;
  overrides: UserOverrides;
  locale: Locale;
  documentType?: DocumentType | undefined;
  /** DIN 5008 letter renderer. Called when documentType is 'anschreiben'. */
  renderDin5008?:
    | ((props: {
        coverLetter: CoverLetter;
        resume: Resume;
        tokens: ResolvedTokens;
        locale: Locale;
        config: AnschreibenConfig;
        headerHtml?: string | undefined;
        footerHtml?: string | undefined;
      }) => string)
    | undefined;
  /** @deprecated Use renderDin5008 instead. */
  renderCoverLetter?:
    | ((props: {
        coverLetter: CoverLetter;
        resume: Resume;
        tokens: ResolvedTokens;
        locale: Locale;
      }) => string)
    | undefined;
}

export function renderDesignPage(opts: RenderDesignPageOptions): { html: string; css: string };
export function renderDesignPage(
  resume: Resume,
  design: DesignDefinition,
  overrides: UserOverrides,
  locale: Locale,
  documentType?: DocumentType,
): { html: string; css: string };
/**
 *
 * @param resumeOrOpts
 * @param designOrUndef
 * @param overridesOrUndef
 * @param localeOrUndef
 * @param documentTypeOrUndef
 * @returns Object containing the rendered HTML and CSS strings
 */
export function renderDesignPage(
  resumeOrOpts: Resume | RenderDesignPageOptions,
  designOrUndef?: DesignDefinition,
  overridesOrUndef?: UserOverrides,
  localeOrUndef?: Locale,
  documentTypeOrUndef?: DocumentType,
): { html: string; css: string } {
  // Normalize arguments
  let resume: Resume;
  let design: DesignDefinition;
  let overrides: UserOverrides;
  let locale: Locale;
  let documentType: DocumentType;
  let coverLetter: CoverLetter | undefined;
  let renderDin5008: RenderDesignPageOptions['renderDin5008'] | undefined;
  let renderCoverLetter: RenderDesignPageOptions['renderCoverLetter'] | undefined;

  if ('design' in resumeOrOpts) {
    const o = resumeOrOpts;
    resume = o.resume;
    design = o.design;
    overrides = o.overrides;
    locale = o.locale;
    documentType = o.documentType ?? 'lebenslauf';
    coverLetter = o.coverLetter;
    renderDin5008 = o.renderDin5008;
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    renderCoverLetter = o.renderCoverLetter;
  } else {
    resume = resumeOrOpts;
    // Positional overload guarantees these are defined
    design = designOrUndef as DesignDefinition;
    overrides = overridesOrUndef as UserOverrides;
    locale = localeOrUndef as Locale;
    documentType = documentTypeOrUndef ?? 'lebenslauf';
  }

  const tokens = resolveTokens(design, overrides);
  const slotOptions = resolveAllSlotOptions(design, overrides);
  const layoutCss = typeof design.css === 'function' ? design.css(slotOptions) : design.css;
  const tokenCss = designTokensToCss(design, tokens);

  if (documentType === 'anschreiben' && coverLetter) {
    // DIN 5008 rendering (preferred path)
    if (renderDin5008) {
      const config = design.anschreibenConfig ?? {};
      const html = renderDin5008({ coverLetter, resume, tokens, locale, config });
      return { html, css: tokenCss };
    }
    // Fallback: simple single-column rendering
    return renderCoverLetterFallback(
      coverLetter,
      resume,
      tokens,
      locale,
      tokenCss,
      renderCoverLetter,
    );
  }

  return renderSlotPage(resume, design, tokens, overrides, locale, layoutCss, tokenCss);
}
