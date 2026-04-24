import type { CoverLetterProfile, CoverLetterVariant, CVVariant, Resume } from '@cv/core';
import {
  DEFAULT_SECTION_ORDER,
  DEFAULT_SECTION_VISIBILITY,
  emptyOverrides,
} from '@cv/core';
import { useCoverLetterProfileStore } from './coverLetterProfileStore.js';
import { useCoverLetterVariantsStore } from './coverLetterVariantsStore.js';
import { useCvVariantsStore } from './cvVariantsStore.js';
import { useResumeStore } from './resumeStore.js';
import { useSettingsStore } from './settingsStore.js';

const EMPTY_RESUME: Resume = {
  basics: { name: '', profiles: [] },
  work: [],
  education: [],
  skills: [],
  languages: [],
  projects: [],
  certificates: [],
  publications: [],
  awards: [],
  volunteer: [],
  interests: [],
  references: [],
  custom: [],
};

const EMPTY_COVER_LETTER_PROFILE: CoverLetterProfile = {
  sender: { name: '' },
  signatureName: '',
  signatureImage: '',
  defaultClosing: 'Mit freundlichen Grüßen',
  defaultDin5008Form: 'B',
  defaultShowFoldMarks: true,
  defaultShowSenderInfo: true,
  paragraphLibrary: [],
};

function emptyCvVariant(id: string, name: string): CVVariant {
  return {
    id,
    name,
    documentLocale: 'de',
    paperSize: 'A4',
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    sectionVisibility: { ...DEFAULT_SECTION_VISIBILITY },
    selections: {},
    design: { activeDesignId: 'sidebar-left', overrides: { ...emptyOverrides } },
  };
}

function emptyCoverLetterVariant(id: string, name: string): CoverLetterVariant {
  return {
    id,
    name,
    recipient: { name: '' },
    subject: '',
    reference: '',
    salutation: '',
    paragraphs: [],
  };
}

export function clearAllStores(): void {
  useResumeStore.getState().setResume(EMPTY_RESUME);
  useCoverLetterProfileStore.getState().setProfile(EMPTY_COVER_LETTER_PROFILE);

  const cvVariant = emptyCvVariant('variant-default', 'Standard-Lebenslauf');
  useCvVariantsStore.getState().setAll([cvVariant], cvVariant.id);

  const clVariant = emptyCoverLetterVariant('cl-variant-default', 'Standard-Anschreiben');
  useCoverLetterVariantsStore.getState().setAll([clVariant], clVariant.id);

  const currentUiLocale = useSettingsStore.getState().settings.uiLocale;
  useSettingsStore.getState().setSettings({
    uiLocale: currentUiLocale,
    activeDocumentType: 'lebenslauf',
  });
}
