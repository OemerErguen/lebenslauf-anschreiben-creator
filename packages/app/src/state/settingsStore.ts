import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type DocumentType, type GlobalSettings, type Locale, sampleGlobalSettings } from '@cv/core';
import { STORAGE_KEYS } from './storageKeys.js';

/**
 * Truly global UI preferences. Anything that should differ per CV (document
 * locale, paper size, design, section order/visibility) lives on the variant.
 */
interface SettingsStore {
  settings: GlobalSettings;
  setSettings: (settings: GlobalSettings) => void;
  setUiLocale: (locale: Locale) => void;
  setActiveDocumentType: (type: DocumentType) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: sampleGlobalSettings,
      setSettings: (settings) => set({ settings }),
      setUiLocale: (uiLocale) => set((state) => ({ settings: { ...state.settings, uiLocale } })),
      setActiveDocumentType: (activeDocumentType) =>
        set((state) => ({ settings: { ...state.settings, activeDocumentType } })),
      resetSettings: () => set({ settings: sampleGlobalSettings }),
    }),
    { name: STORAGE_KEYS.globalSettings },
  ),
);
