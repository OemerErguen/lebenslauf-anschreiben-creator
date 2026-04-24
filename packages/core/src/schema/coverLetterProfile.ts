import { z } from 'zod';
import { coverLetterPartySchema } from './coverLetter.js';

/** A reusable paragraph template the user can pick from when composing a letter. */
export const paragraphTemplateSchema = z.object({
  id: z.string(),
  label: z.string(),
  body: z.string(),
});
/**
 *
 */
export type ParagraphTemplate = z.infer<typeof paragraphTemplateSchema>;

/**
 * The user's reusable cover-letter pool — sender info, signature defaults, and a
 * library of paragraph snippets. A {@link CoverLetterVariant} consumes these
 * defaults and supplies per-letter content (recipient, subject, paragraphs).
 */
export const coverLetterProfileSchema = z.object({
  sender: coverLetterPartySchema.default({ name: '' }),
  signatureName: z.string().default(''),
  signatureImage: z.string().default(''),
  defaultClosing: z.string().default('Mit freundlichen Grüßen'),
  defaultDin5008Form: z.enum(['A', 'B']).default('B'),
  defaultShowFoldMarks: z.boolean().default(true),
  defaultShowSenderInfo: z.boolean().default(true),
  paragraphLibrary: z.array(paragraphTemplateSchema).default([]),
});
/**
 *
 */
export type CoverLetterProfile = z.infer<typeof coverLetterProfileSchema>;
