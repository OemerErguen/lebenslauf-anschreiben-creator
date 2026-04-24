import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Resume, sampleResume } from '@cv/core';
import { STORAGE_KEYS } from './storageKeys.js';

/**
 * The user-profile resume pool — every job, school, skill, certificate the user
 * owns. CV variants reference IDs from this pool to build tailored CVs; this
 * store always holds the *complete* set, never a filtered view.
 */
interface ResumeStore {
  resume: Resume;
  setResume: (resume: Resume) => void;
  patchResume: (patch: Partial<Resume>) => void;
  resetResume: () => void;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resume: sampleResume,
      setResume: (resume) => set({ resume }),
      patchResume: (patch) => set((state) => ({ resume: { ...state.resume, ...patch } })),
      resetResume: () => set({ resume: sampleResume }),
    }),
    { name: STORAGE_KEYS.resume },
  ),
);
