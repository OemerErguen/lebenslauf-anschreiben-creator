import type { CoverLetterProfile } from './schema/coverLetterProfile.js';
import type { CoverLetterVariant } from './schema/coverLetterVariant.js';

/**
 * The fully-resolved cover letter shape consumed by the renderer.
 * Mirrors the legacy `CoverLetter` shape so existing components keep working.
 */
export interface ResolvedCoverLetter {
  sender: CoverLetterProfile['sender'];
  recipient: CoverLetterVariant['recipient'];
  place: string | undefined;
  date: string | undefined;
  subject: string;
  reference: string;
  salutation: string;
  paragraphs: string[];
  closing: string;
  signatureName: string;
  signatureImage: string;
  din5008Form: 'A' | 'B';
  showFoldMarks: boolean;
  showSenderInfo: boolean;
  headerComponentOverrides: CoverLetterVariant['headerComponentOverrides'];
  footerComponentOverrides: CoverLetterVariant['footerComponentOverrides'];
}

/**
 * Materialise the cover letter the renderer consumes. The profile supplies the
 * defaults (sender, signature, closing, style toggles); the variant supplies
 * per-letter content and any per-letter overrides.
 * @param profile
 * @param variant
 * @returns The renderer-facing cover letter.
 */
export function resolveCoverLetter(
  profile: CoverLetterProfile,
  variant: CoverLetterVariant,
): ResolvedCoverLetter {
  return {
    sender: profile.sender,
    recipient: variant.recipient,
    place: variant.place,
    date: variant.date,
    subject: variant.subject,
    reference: variant.reference,
    salutation: variant.salutation,
    paragraphs: variant.paragraphs,
    closing: variant.closingOverride ?? profile.defaultClosing,
    signatureName: variant.signatureNameOverride ?? profile.signatureName,
    signatureImage: variant.signatureImageOverride ?? profile.signatureImage,
    din5008Form: variant.din5008Form ?? profile.defaultDin5008Form,
    showFoldMarks: variant.showFoldMarks ?? profile.defaultShowFoldMarks,
    showSenderInfo: variant.showSenderInfo ?? profile.defaultShowSenderInfo,
    headerComponentOverrides: variant.headerComponentOverrides,
    footerComponentOverrides: variant.footerComponentOverrides,
  };
}
