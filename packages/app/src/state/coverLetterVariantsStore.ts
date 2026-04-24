import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  type CoverLetterParty,
  type CoverLetterVariant,
  sampleCoverLetterVariant,
  type SlotAssignment,
} from '@cv/core';
import { generateId } from '../utils/generateId.js';
import { STORAGE_KEYS } from './storageKeys.js';

type Zone = 'header' | 'footer';

export function createDefaultCoverLetterVariant(name: string): CoverLetterVariant {
  return {
    id: generateId('cl-variant'),
    name,
    recipient: { name: '' },
    subject: '',
    reference: '',
    salutation: '',
    paragraphs: [],
  };
}

function cloneCoverLetterVariant(
  source: CoverLetterVariant,
  newName: string,
): CoverLetterVariant {
  return { ...structuredClone(source), id: generateId('cl-variant'), name: newName };
}

interface CoverLetterVariantsStore {
  variants: CoverLetterVariant[];
  activeVariantId: string | undefined;

  setActiveVariantId: (id: string | undefined) => void;

  createVariant: (name: string) => string;
  duplicateVariant: (sourceId: string, newName: string) => string | undefined;
  removeVariant: (id: string) => void;
  setVariant: (id: string, variant: CoverLetterVariant) => void;
  patchVariant: (id: string, patch: Partial<CoverLetterVariant>) => void;
  setAll: (variants: CoverLetterVariant[], activeVariantId?: string  ) => void;

  patchRecipient: (id: string, patch: Partial<CoverLetterParty>) => void;

  addParagraph: (id: string, value?: string) => void;
  removeParagraph: (id: string, index: number) => void;
  updateParagraph: (id: string, index: number, value: string) => void;
  moveParagraph: (id: string, from: number, to: number) => void;

  toggleZoneComponent: (
    id: string,
    zone: Zone,
    componentId: string,
    defaults: SlotAssignment[],
  ) => void;
  updateZoneComponentOptions: (
    id: string,
    zone: Zone,
    componentId: string,
    options: Record<string, unknown>,
    defaults: SlotAssignment[],
  ) => void;
  moveZoneComponent: (
    id: string,
    zone: Zone,
    from: number,
    to: number,
    defaults: SlotAssignment[],
  ) => void;
}

function reduceUpdate(
  state: { variants: CoverLetterVariant[] },
  id: string,
  fn: (v: CoverLetterVariant) => CoverLetterVariant,
) {
  return { variants: state.variants.map((v) => (v.id === id ? fn(v) : v)) };
}

function zoneKey(zone: Zone): 'headerComponentOverrides' | 'footerComponentOverrides' {
  return zone === 'header' ? 'headerComponentOverrides' : 'footerComponentOverrides';
}

export const useCoverLetterVariantsStore = create<CoverLetterVariantsStore>()(
  persist(
    (set, get) => ({
      variants: [sampleCoverLetterVariant],
      activeVariantId: sampleCoverLetterVariant.id,

      setActiveVariantId: (id) => set({ activeVariantId: id }),

      createVariant: (name) => {
        const variant = createDefaultCoverLetterVariant(name);
        set((state) => ({ variants: [...state.variants, variant], activeVariantId: variant.id }));
        return variant.id;
      },

      duplicateVariant: (sourceId, newName) => {
        const source = get().variants.find((v) => v.id === sourceId);
        if (!source) return undefined;
        const cloned = cloneCoverLetterVariant(source, newName);
        set((state) => ({ variants: [...state.variants, cloned], activeVariantId: cloned.id }));
        return cloned.id;
      },

      removeVariant: (id) =>
        set((state) => {
          const variants = state.variants.filter((v) => v.id !== id);
          const activeVariantId =
            state.activeVariantId === id ? variants[0]?.id : state.activeVariantId;
          return { variants, activeVariantId };
        }),

      setVariant: (id, variant) =>
        set((state) => ({ variants: state.variants.map((v) => (v.id === id ? variant : v)) })),

      patchVariant: (id, patch) =>
        set((state) => reduceUpdate(state, id, (v) => ({ ...v, ...patch }))),

      setAll: (variants, activeVariantId) =>
        set({ variants, activeVariantId: activeVariantId ?? variants[0]?.id }),

      patchRecipient: (id, patch) =>
        set((state) =>
          reduceUpdate(state, id, (v) => ({
            ...v,
            recipient: { ...v.recipient, ...patch },
          })),
        ),

      addParagraph: (id, value = '') =>
        set((state) =>
          reduceUpdate(state, id, (v) => ({ ...v, paragraphs: [...v.paragraphs, value] })),
        ),

      removeParagraph: (id, index) =>
        set((state) =>
          reduceUpdate(state, id, (v) => ({
            ...v,
            paragraphs: v.paragraphs.filter((_, i) => i !== index),
          })),
        ),

      updateParagraph: (id, index, value) =>
        set((state) =>
          reduceUpdate(state, id, (v) => ({
            ...v,
            paragraphs: v.paragraphs.map((p, i) => (i === index ? value : p)),
          })),
        ),

      moveParagraph: (id, from, to) =>
        set((state) =>
          reduceUpdate(state, id, (v) => {
            const paragraphs = [...v.paragraphs];
            const [item] = paragraphs.splice(from, 1);
            if (item === undefined) return v;
            paragraphs.splice(to, 0, item);
            return { ...v, paragraphs };
          }),
        ),

      toggleZoneComponent: (id, zone, componentId, defaults) =>
        set((state) =>
          reduceUpdate(state, id, (v) => {
            const key = zoneKey(zone);
            const current = v[key] ?? defaults;
            const exists = current.some((a) => a.componentId === componentId);
            const updated = exists
              ? current.filter((a) => a.componentId !== componentId)
              : [...current, { componentId, options: {} }];
            return { ...v, [key]: updated };
          }),
        ),

      updateZoneComponentOptions: (id, zone, componentId, options, defaults) =>
        set((state) =>
          reduceUpdate(state, id, (v) => {
            const key = zoneKey(zone);
            const current = v[key] ?? defaults;
            const updated = current.map((a) =>
              a.componentId === componentId ? { ...a, options: { ...a.options, ...options } } : a,
            );
            return { ...v, [key]: updated };
          }),
        ),

      moveZoneComponent: (id, zone, from, to, defaults) =>
        set((state) =>
          reduceUpdate(state, id, (v) => {
            const key = zoneKey(zone);
            const current = [...(v[key] ?? defaults)];
            const [item] = current.splice(from, 1);
            if (!item) return v;
            current.splice(to, 0, item);
            return { ...v, [key]: current };
          }),
        ),
    }),
    { name: STORAGE_KEYS.coverLetterVariants },
  ),
);

export function useActiveCoverLetterVariant(): CoverLetterVariant | undefined {
  return useCoverLetterVariantsStore((s) => s.variants.find((v) => v.id === s.activeVariantId));
}

export function useActiveCoverLetterVariantId(): string | undefined {
  return useCoverLetterVariantsStore((s) => s.activeVariantId);
}
