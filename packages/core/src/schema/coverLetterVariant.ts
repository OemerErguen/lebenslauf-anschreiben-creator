import { z } from 'zod';
import { isoDateLikeSchema, localeSchema } from './common.js';
import { coverLetterPartySchema } from './coverLetter.js';
import { slotAssignmentSchema } from './userOverrides.js';

/**
 * A single tailored cover letter — recipient, subject, and the actual paragraphs
 * for one application. Pulls sender/signature/style defaults from the
 * {@link CoverLetterProfile} via the resolver.
 */
export const coverLetterVariantSchema = z.object({
  id: z.string(),
  /** User-chosen variant name, e.g. "Acme Corp – Senior Backend". */
  name: z.string(),
  /** Optional metadata for organising variants. */
  targetCompany: z.string().optional(),
  targetRole: z.string().optional(),
  notes: z.string().optional(),

  /** Optional language override; falls back to the linked CV variant's locale. */
  documentLocale: localeSchema.optional(),

  recipient: coverLetterPartySchema.default({ name: '' }),
  place: z.string().optional(),
  date: isoDateLikeSchema.optional(),
  subject: z.string().default(''),
  reference: z.string().default(''),
  salutation: z.string().default(''),
  paragraphs: z.array(z.string()).default([]),

  /** Per-letter override of the profile's default closing. */
  closingOverride: z.string().optional(),
  /** Per-letter override of the profile's default signature name. */
  signatureNameOverride: z.string().optional(),
  /** Per-letter override of the profile's default signature image. */
  signatureImageOverride: z.string().optional(),

  /** Per-letter style toggles — default to the profile values when undefined. */
  din5008Form: z.enum(['A', 'B']).optional(),
  showFoldMarks: z.boolean().optional(),
  showSenderInfo: z.boolean().optional(),

  /** Header/footer component overrides for this letter. */
  headerComponentOverrides: z.array(slotAssignmentSchema).optional(),
  footerComponentOverrides: z.array(slotAssignmentSchema).optional(),

  /** Optional link to a CV variant for paired application bundles. */
  linkedCvVariantId: z.string().optional(),
});
/**
 *
 */
export type CoverLetterVariant = z.infer<typeof coverLetterVariantSchema>;
