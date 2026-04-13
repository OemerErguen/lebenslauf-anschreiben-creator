import { PRINT_ROOT_ATTRIBUTE } from './print.js';

/**
 *
 */
export interface PagedRendererOptions {
  pagedPolyfillUrl: string;
}

/**
 *
 */
export interface RenderResult {
  pageCount: number;
}

/**
 * Renders HTML+CSS inside a fully-isolated iframe using Paged.js for
 * pagination. The iframe is displayed directly as the preview and can
 * be printed via the browser's native print dialog for vector PDF output.
 */
export class PagedRenderer {
  private readonly host: HTMLElement;
  private readonly options: PagedRendererOptions;
  private iframe: HTMLIFrameElement | null = null;
  private renderSeq = 0;

  constructor(host: HTMLElement, options: PagedRendererOptions) {
    this.host = host;
    this.host.setAttribute(PRINT_ROOT_ATTRIBUTE, '');
    this.options = options;
  }

  /**
   *
   * @param html
   * @param css
   * @returns Render result with page count
   */
  async render(html: string, css: string): Promise<RenderResult> {
    const seq = ++this.renderSeq;
    const doc = this.buildDocument(css, html);

    const iframe = document.createElement('iframe');
    iframe.title = 'CV render';
    Object.assign(iframe.style, {
      display: 'block',
      width: '210mm',
      height: '500mm', // tall enough for Paged.js layout computation
      border: '0',
    } satisfies Partial<CSSStyleDeclaration>);
    iframe.srcdoc = doc;

    this.host.replaceChildren(iframe);
    this.iframe = iframe;

    // Wait for Paged.js to finish. The load event fires after all scripts
    // (including the Paged.js polyfill) have run.
    await new Promise<void>((resolve) => {
      iframe.addEventListener(
        'load',
        () => {
          resolve();
        },
        { once: true },
      );
    });

    if (seq !== this.renderSeq) return { pageCount: 0 };

    // Give Paged.js an extra tick to finish pagination
    await new Promise((r) => setTimeout(r, 100));

    const pageCount = iframe.contentDocument?.querySelectorAll('.pagedjs_page').length ?? 0;

    // Resize iframe to fit the actual content so the parent can scroll naturally
    const contentHeight = iframe.contentDocument?.documentElement.scrollHeight;
    if (contentHeight) {
      iframe.style.height = `${contentHeight}px`;
    }

    return { pageCount };
  }

  /**
   *
   */
  print(): void {
    const win = this.iframe?.contentWindow;
    if (!win) return;
    win.focus();
    win.print();
  }

  /**
   *
   */
  dispose(): void {
    this.host.replaceChildren();
    this.iframe = null;
  }

  private buildDocument(stylesheet: string, bodyHTML: string): string {
    const baseHref = `${window.location.origin}${window.location.pathname}`;
    return `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <base href="${baseHref}" />
    <title>CV render</title>
    <style>${stylesheet}</style>
    <style>${PAGEDJS_INTERFACE_CSS}</style>
    <script src="${this.options.pagedPolyfillUrl}"></script>
  </head>
  <body>${bodyHTML}</body>
</html>`;
  }
}

const PAGEDJS_INTERFACE_CSS = `
  :root { color-scheme: light; }
  html, body {
    background: #e2e8f0;
    margin: 0;
    padding: 0;
  }
  .pagedjs_pages {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 24px 0;
  }
  .pagedjs_page {
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08);
  }
  @media print {
    html, body {
      background: transparent;
    }
    .pagedjs_pages {
      gap: 0;
      padding: 0;
    }
    .pagedjs_page {
      box-shadow: none;
    }
  }
`;
