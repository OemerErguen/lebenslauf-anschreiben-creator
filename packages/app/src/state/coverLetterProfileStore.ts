import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  type CoverLetterParty,
  type CoverLetterProfile,
  type ParagraphTemplate,
  sampleCoverLetterProfile,
} from '@cv/core';
import { STORAGE_KEYS } from './storageKeys.js';

/**
 * The user-profile cover-letter pool — sender, signature defaults, and a
 * library of reusable paragraph snippets. Per-letter content (recipient,
 * subject, paragraphs) lives in {@link useCoverLetterVariantsStore}.
 */
interface CoverLetterProfileStore {
  profile: CoverLetterProfile;
  setProfile: (profile: CoverLetterProfile) => void;
  patchProfile: (patch: Partial<CoverLetterProfile>) => void;
  patchSender: (patch: Partial<CoverLetterParty>) => void;

  addParagraphTemplate: (template: Omit<ParagraphTemplate, 'id'> & { id?: string }) => string;
  updateParagraphTemplate: (id: string, patch: Partial<ParagraphTemplate>) => void;
  removeParagraphTemplate: (id: string) => void;

  resetProfile: () => void;
}

export const useCoverLetterProfileStore = create<CoverLetterProfileStore>()(
  persist(
    (set) => ({
      profile: sampleCoverLetterProfile,
      setProfile: (profile) => set({ profile }),
      patchProfile: (patch) => set((state) => ({ profile: { ...state.profile, ...patch } })),
      patchSender: (patch) =>
        set((state) => ({
          profile: { ...state.profile, sender: { ...state.profile.sender, ...patch } },
        })),

      addParagraphTemplate: (template) => {
        const id = template.id ?? `pt-${Date.now().toString(36)}`;
        set((state) => ({
          profile: {
            ...state.profile,
            paragraphLibrary: [
              ...state.profile.paragraphLibrary,
              { id, label: template.label, body: template.body },
            ],
          },
        }));
        return id;
      },
      updateParagraphTemplate: (id, patch) =>
        set((state) => ({
          profile: {
            ...state.profile,
            paragraphLibrary: state.profile.paragraphLibrary.map((t) =>
              t.id === id ? { ...t, ...patch } : t,
            ),
          },
        })),
      removeParagraphTemplate: (id) =>
        set((state) => ({
          profile: {
            ...state.profile,
            paragraphLibrary: state.profile.paragraphLibrary.filter((t) => t.id !== id),
          },
        })),

      resetProfile: () => set({ profile: sampleCoverLetterProfile }),
    }),
    { name: STORAGE_KEYS.coverLetterProfile },
  ),
);
