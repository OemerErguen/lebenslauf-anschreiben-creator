import { z } from 'zod';
import { localeSchema } from './common.js';

export const documentTypeSchema = z.enum(['lebenslauf', 'anschreiben']);
/**
 *
 */
export type DocumentType = z.infer<typeof documentTypeSchema>;

/**
 * Global, cross-variant UI preferences.
 * Things that change *per CV* (document language, paper size, section order, visibility,
 * design selection) live on the variant, not here.
 */
export const globalSettingsSchema = z.object({
  uiLocale: localeSchema.default('de'),
  activeDocumentType: documentTypeSchema.default('lebenslauf'),
});
/**
 *
 */
export type GlobalSettings = z.infer<typeof globalSettingsSchema>;
