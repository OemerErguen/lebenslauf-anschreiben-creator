/**
 * Shortens a URL for print: drops the protocol, a leading "www." and a trailing slash.
 * @param url Full URL as entered by the user
 * @returns Readable URL text
 */
export function displayUrl(url: string): string {
  return url
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/$/, '');
}

/**
 * Visible, clickable URL for a list entry, so the link is readable on paper and clickable in the PDF.
 * @param root0
 * @param root0.url Full URL, or undefined/empty to render nothing
 * @returns Link element, or null if no URL is set
 */
export function EntryUrl({ url }: { url?: string | undefined }) {
  if (!url) return null;
  return (
    <a href={url} className="cv-entry-url">
      {displayUrl(url)}
    </a>
  );
}
