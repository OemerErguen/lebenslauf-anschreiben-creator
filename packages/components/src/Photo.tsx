import type { ComponentRenderProps } from '@cv/layout-engine';

/**
 *
 * @param root0
 * @returns React element displaying the photo, or null if no image
 */
export function Photo({ resume, options }: ComponentRenderProps) {
  const shape = (options['shape'] as string | undefined) ?? 'circle';
  const size = (options['size'] as string | undefined) ?? 'md';

  if (!resume.basics.image) return null;

  return (
    <img
      className={`cv-photo cv-photo--${shape} cv-photo--${size}`}
      src={resume.basics.image}
      alt={resume.basics.name}
    />
  );
}
