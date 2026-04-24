import type { ResolvedCoverLetter } from '../resolveCoverLetter.js';
import { z } from 'zod';
import { locationSchema } from './resume.js';

/** Postal address party — used for both sender and recipient in DIN 5008 letters. */
export const coverLetterPartySchema = z.object({
  name: z.string(),
  company: z.string().optional(),
  location: locationSchema.optional(),
});
/**
 *
 */
export type CoverLetterParty = z.infer<typeof coverLetterPartySchema>;

/**
 * The renderer-facing cover-letter shape, materialised from the cover-letter
 * profile + a {@link CoverLetterVariant} via {@link resolveCoverLetter}.
 * Components and the layout engine consume this exact shape.
 */
export type CoverLetter = ResolvedCoverLetter;
