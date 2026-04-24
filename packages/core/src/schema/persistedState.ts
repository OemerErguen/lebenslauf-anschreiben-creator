import { z } from 'zod';
import { coverLetterProfileSchema } from './coverLetterProfile.js';
import { coverLetterVariantSchema } from './coverLetterVariant.js';
import { cvVariantSchema } from './cvVariant.js';
import { resumeSchema } from './resume.js';
import { globalSettingsSchema } from './settings.js';

/** Schema version for persisted state. Bump on breaking changes; add a migration step. */
export const CURRENT_SCHEMA_VERSION = 1 as const;

/**
 * The user's reusable pool — full resume data (every job, every skill) and the
 * cover-letter profile (sender, signature, paragraph library). Edited once,
 * referenced by all variants.
 */
export const userProfileSchema = z.object({
  resume: resumeSchema,
  coverLetter: coverLetterProfileSchema,
});
/**
 *
 */
export type UserProfile = z.infer<typeof userProfileSchema>;

/**
 * Top-level persisted state. Bundles the profile pool with N CV variants and
 * N cover-letter variants. Variants are pure views over the pool — they select,
 * reorder, and carry per-document settings (locale, paper size, design).
 */
export const persistedStateSchema = z.object({
  schemaVersion: z.number().int().positive(),
  globalSettings: globalSettingsSchema,
  profile: userProfileSchema,
  cvVariants: z.array(cvVariantSchema).default([]),
  coverLetterVariants: z.array(coverLetterVariantSchema).default([]),
  activeCvVariantId: z.string().optional(),
  activeCoverLetterVariantId: z.string().optional(),
});
/**
 *
 */
export type PersistedState = z.infer<typeof persistedStateSchema>;
