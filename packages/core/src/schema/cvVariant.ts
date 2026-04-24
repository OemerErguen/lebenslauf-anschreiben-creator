import { z } from 'zod';
import { localeSchema, paperSizeSchema, sectionIdSchema } from './common.js';
import { userOverridesSchema } from './userOverrides.js';

/** Default section order used when creating a fresh variant. */
export const DEFAULT_SECTION_ORDER = [
  'personal',
  'summary',
  'experience',
  'education',
  'skills',
  'languages',
  'projects',
  'certificates',
  'interests',
] as const;

/** Default visibility used when creating a fresh variant. */
export const DEFAULT_SECTION_VISIBILITY = {
  personal: true,
  summary: true,
  experience: true,
  education: true,
  skills: true,
  languages: true,
  projects: false,
  certificates: false,
  publications: false,
  awards: false,
  volunteer: false,
  interests: false,
  references: false,
  custom: false,
} as const;

export const sectionVisibilitySchema = z.partialRecord(sectionIdSchema, z.boolean());
/**
 *
 */
export type SectionVisibility = z.infer<typeof sectionVisibilitySchema>;

/**
 * Per-section, ordered list of item IDs to include from the profile pool.
 * If a section key is missing or its array is empty, all items in the pool are
 * included in their pool order. Item IDs that no longer exist in the pool are
 * silently ignored by the resolver.
 */
export const sectionSelectionsSchema = z.partialRecord(sectionIdSchema, z.array(z.string()));
/**
 *
 */
export type SectionSelections = z.infer<typeof sectionSelectionsSchema>;

export const variantDesignSchema = z.object({
  activeDesignId: z.string(),
  overrides: userOverridesSchema,
});
/**
 *
 */
export type VariantDesign = z.infer<typeof variantDesignSchema>;

/**
 * A tailored CV — selects + reorders subsets of the profile pool and carries its
 * own document-level options (locale, paper size, design). The pool itself
 * (resume data) is shared across all variants.
 */
export const cvVariantSchema = z.object({
  id: z.string(),
  /** User-chosen variant name, e.g. "Acme Corp – Senior Backend". */
  name: z.string(),
  /** Optional metadata for organising variants. */
  targetCompany: z.string().optional(),
  targetRole: z.string().optional(),
  notes: z.string().optional(),

  documentLocale: localeSchema.default('de'),
  paperSize: paperSizeSchema.default('A4'),

  sectionOrder: z.array(sectionIdSchema).default([...DEFAULT_SECTION_ORDER]),
  sectionVisibility: sectionVisibilitySchema.default({ ...DEFAULT_SECTION_VISIBILITY }),
  selections: sectionSelectionsSchema.default({}),

  design: variantDesignSchema,
});
/**
 *
 */
export type CVVariant = z.infer<typeof cvVariantSchema>;
