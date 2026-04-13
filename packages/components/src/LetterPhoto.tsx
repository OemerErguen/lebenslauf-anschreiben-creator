import type { ComponentRenderProps } from '@cv/layout-engine';

/**
 * Compact photo for DIN 5008 letter header/footer.
 * Reads image from component options — independent of resume data.
 * @param root0
 * @returns React element displaying the letter photo, or null if no image
 */
export function LetterPhoto({ options }: ComponentRenderProps) {
  const shape = (options['shape'] as string) ?? 'circle';
  const image = (options['image'] as string) ?? '';
  const name = (options['name'] as string) ?? '';

  if (!image) return null;

  return <img className={`cv-lh-photo cv-lh-photo--${shape}`} src={image} alt={name} />;
}
