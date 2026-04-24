/**
 * Re-exports of inferred types for convenience.
 * The actual zod schemas are exported from their respective files.
 */

export type {
  IsoDateLike,
  Locale,
  LocalizedString,
  PaperSize,
  SectionId,
} from './schema/common.js';
export type {
  Basics,
  Certificate,
  CustomSection,
  Education,
  Interest,
  Language,
  Location,
  Profile,
  Project,
  Resume,
  Skill,
  Work,
} from './schema/resume.js';
export type { CoverLetterParty } from './schema/coverLetter.js';
export type { CoverLetterProfile, ParagraphTemplate } from './schema/coverLetterProfile.js';
export type { CoverLetterVariant } from './schema/coverLetterVariant.js';
export type {
  CVVariant,
  SectionSelections,
  SectionVisibility,
  VariantDesign,
} from './schema/cvVariant.js';
export type { DocumentType, GlobalSettings } from './schema/settings.js';
export type { PersistedState, UserProfile } from './schema/persistedState.js';
export type { ResolvedCoverLetter } from './resolveCoverLetter.js';
