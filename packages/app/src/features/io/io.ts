import { CURRENT_SCHEMA_VERSION, deserialize, type PersistedState, serialize } from '@cv/core';
import { useCoverLetterProfileStore } from '../../state/coverLetterProfileStore.js';
import { useCoverLetterVariantsStore } from '../../state/coverLetterVariantsStore.js';
import { useCvVariantsStore } from '../../state/cvVariantsStore.js';
import { useResumeStore } from '../../state/resumeStore.js';
import { useSettingsStore } from '../../state/settingsStore.js';

export function exportStateJson(): string {
  const cvState = useCvVariantsStore.getState();
  const clState = useCoverLetterVariantsStore.getState();
  const state: PersistedState = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    globalSettings: useSettingsStore.getState().settings,
    profile: {
      resume: useResumeStore.getState().resume,
      coverLetter: useCoverLetterProfileStore.getState().profile,
    },
    cvVariants: cvState.variants,
    coverLetterVariants: clState.variants,
    activeCvVariantId: cvState.activeVariantId,
    activeCoverLetterVariantId: clState.activeVariantId,
  };
  return serialize(state);
}

export function downloadJson(filename = 'cv.json'): void {
  const json = exportStateJson();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function importJsonFile(file: File): Promise<void> {
  const text = await file.text();
  const state = deserialize(text);
  useResumeStore.getState().setResume(state.profile.resume);
  useCoverLetterProfileStore.getState().setProfile(state.profile.coverLetter);
  useSettingsStore.getState().setSettings(state.globalSettings);
  useCvVariantsStore.getState().setAll(state.cvVariants, state.activeCvVariantId);
  useCoverLetterVariantsStore
    .getState()
    .setAll(state.coverLetterVariants, state.activeCoverLetterVariantId);
}
