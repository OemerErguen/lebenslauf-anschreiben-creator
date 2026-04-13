/**
 * Normalizes a summary string for dangerouslySetInnerHTML rendering.
 * Wraps plain text (non-HTML) in <p> tags so line breaks work correctly.
 * @param value
 * @returns HTML string, with plain text wrapped in a p tag
 */
export function toHtml(value: string | undefined): string {
  if (!value) return '';
  // If already HTML (starts with a tag), use as-is
  if (value.trimStart().startsWith('<')) return value;
  // Wrap plain text in <p>
  return `<p>${value}</p>`;
}
