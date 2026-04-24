import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  type CVVariant,
  DEFAULT_SECTION_ORDER,
  DEFAULT_SECTION_VISIBILITY,
  emptyOverrides,
  type Locale,
  type PaperSize,
  sampleCvVariant,
  type SectionId,
  type SlotAssignment,
  type UserOverrides,
  type VariantDesign,
} from '@cv/core';
import { generateId } from '../utils/generateId.js';
import { STORAGE_KEYS } from './storageKeys.js';

/**
 * Build a fresh variant. Section order/visibility default to the standard CV
 * layout; selections are empty (= all items in pool order); design starts from
 * a blank `sidebar-left` with no overrides.
 */
export function createDefaultVariant(name: string, design?: Partial<VariantDesign>): CVVariant {
  return {
    id: generateId('variant'),
    name,
    documentLocale: 'de',
    paperSize: 'A4',
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    sectionVisibility: { ...DEFAULT_SECTION_VISIBILITY },
    selections: {},
    design: {
      activeDesignId: design?.activeDesignId ?? 'sidebar-left',
      overrides: design?.overrides ?? { ...emptyOverrides },
    },
  };
}

/** Deep-clone a variant under a new id and name. Selections are copied verbatim. */
function cloneVariant(source: CVVariant, newName: string): CVVariant {
  return {
    ...structuredClone(source),
    id: generateId('variant'),
    name: newName,
  };
}

interface CvVariantsStore {
  variants: CVVariant[];
  activeVariantId: string | undefined;

  setActiveVariantId: (id: string | undefined) => void;

  /** Create a new variant and make it active. Returns the new variant id. */
  createVariant: (name: string) => string;
  /** Duplicate the variant under a new name and id; new variant becomes active. */
  duplicateVariant: (sourceId: string, newName: string) => string | undefined;
  /** Remove a variant; if it was active, the next variant (if any) becomes active. */
  removeVariant: (id: string) => void;
  /** Replace a variant in place. */
  setVariant: (id: string, variant: CVVariant) => void;
  /** Shallow-merge a patch into the variant. */
  patchVariant: (id: string, patch: Partial<CVVariant>) => void;
  /** Replace the entire variants list (used by import). */
  setAll: (variants: CVVariant[], activeVariantId?: string  ) => void;

  // ---- Per-variant convenience actions (operate on active variant) ----
  setVariantName: (id: string, name: string) => void;
  setDocumentLocale: (id: string, locale: Locale) => void;
  setPaperSize: (id: string, size: PaperSize) => void;

  toggleSectionVisibility: (id: string, sectionId: SectionId) => void;
  setSectionOrder: (id: string, order: SectionId[]) => void;
  /** Replace the ordered list of selected item ids for a section. Empty array clears the entry (= include all). */
  setSectionSelection: (id: string, sectionId: SectionId, ids: string[]) => void;
  toggleItemSelection: (
    id: string,
    sectionId: SectionId,
    itemId: string,
    poolOrder: string[],
  ) => void;
  moveSelectedItem: (
    id: string,
    sectionId: SectionId,
    fromIndex: number,
    toIndex: number,
    poolOrder: string[],
  ) => void;

  // ---- Design overrides on the active variant ----
  setDesignActiveId: (id: string, designId: string) => void;
  setDesignOverrides: (id: string, overrides: UserOverrides) => void;
  patchDesignOverrides: (id: string, patch: Partial<UserOverrides>) => void;
  setDesignSlotAssignments: (id: string, slotName: string, assignments: SlotAssignment[]) => void;
}

function reduceUpdateVariant(state: { variants: CVVariant[] }, id: string, fn: (v: CVVariant) => CVVariant) {
  return { variants: state.variants.map((v) => (v.id === id ? fn(v) : v)) };
}

/** Return the current selection for a section, or fall back to the pool order. */
function currentSelection(variant: CVVariant, sectionId: SectionId, poolOrder: string[]): string[] {
  const stored = variant.selections[sectionId];
  if (stored && stored.length > 0) return stored;
  return poolOrder;
}

export const useCvVariantsStore = create<CvVariantsStore>()(
  persist(
    (set, get) => ({
      variants: [sampleCvVariant],
      activeVariantId: sampleCvVariant.id,

      setActiveVariantId: (id) => set({ activeVariantId: id }),

      createVariant: (name) => {
        const variant = createDefaultVariant(name);
        set((state) => ({ variants: [...state.variants, variant], activeVariantId: variant.id }));
        return variant.id;
      },

      duplicateVariant: (sourceId, newName) => {
        const source = get().variants.find((v) => v.id === sourceId);
        if (!source) return undefined;
        const cloned = cloneVariant(source, newName);
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
        set((state) => reduceUpdateVariant(state, id, (v) => ({ ...v, ...patch }))),

      setAll: (variants, activeVariantId) =>
        set({ variants, activeVariantId: activeVariantId ?? variants[0]?.id }),

      setVariantName: (id, name) =>
        set((state) => reduceUpdateVariant(state, id, (v) => ({ ...v, name }))),

      setDocumentLocale: (id, documentLocale) =>
        set((state) => reduceUpdateVariant(state, id, (v) => ({ ...v, documentLocale }))),

      setPaperSize: (id, paperSize) =>
        set((state) => reduceUpdateVariant(state, id, (v) => ({ ...v, paperSize }))),

      toggleSectionVisibility: (id, sectionId) =>
        set((state) =>
          reduceUpdateVariant(state, id, (v) => ({
            ...v,
            sectionVisibility: {
              ...v.sectionVisibility,
              [sectionId]: !(v.sectionVisibility[sectionId] ?? false),
            },
          })),
        ),

      setSectionOrder: (id, order) =>
        set((state) => reduceUpdateVariant(state, id, (v) => ({ ...v, sectionOrder: order }))),

      setSectionSelection: (id, sectionId, ids) =>
        set((state) =>
          reduceUpdateVariant(state, id, (v) => {
            if (ids.length === 0) {
              const rest = { ...v.selections };
              Reflect.deleteProperty(rest, sectionId);
              return { ...v, selections: rest };
            }
            return { ...v, selections: { ...v.selections, [sectionId]: ids } };
          }),
        ),

      toggleItemSelection: (id, sectionId, itemId, poolOrder) =>
        set((state) =>
          reduceUpdateVariant(state, id, (v) => {
            const current = currentSelection(v, sectionId, poolOrder);
            const has = current.includes(itemId);
            const next = has ? current.filter((x) => x !== itemId) : [...current, itemId];
            return {
              ...v,
              selections: { ...v.selections, [sectionId]: next },
            };
          }),
        ),

      moveSelectedItem: (id, sectionId, fromIndex, toIndex, poolOrder) =>
        set((state) =>
          reduceUpdateVariant(state, id, (v) => {
            const current = [...currentSelection(v, sectionId, poolOrder)];
            const [item] = current.splice(fromIndex, 1);
            if (item === undefined) return v;
            current.splice(toIndex, 0, item);
            return { ...v, selections: { ...v.selections, [sectionId]: current } };
          }),
        ),

      setDesignActiveId: (id, designId) =>
        set((state) =>
          reduceUpdateVariant(state, id, (v) => ({
            ...v,
            design: { activeDesignId: designId, overrides: { ...emptyOverrides } },
          })),
        ),

      setDesignOverrides: (id, overrides) =>
        set((state) =>
          reduceUpdateVariant(state, id, (v) => ({
            ...v,
            design: { ...v.design, overrides },
          })),
        ),

      patchDesignOverrides: (id, patch) =>
        set((state) =>
          reduceUpdateVariant(state, id, (v) => ({
            ...v,
            design: { ...v.design, overrides: { ...v.design.overrides, ...patch } },
          })),
        ),

      setDesignSlotAssignments: (id, slotName, assignments) =>
        set((state) =>
          reduceUpdateVariant(state, id, (v) => ({
            ...v,
            design: {
              ...v.design,
              overrides: {
                ...v.design.overrides,
                slotAssignments: { ...v.design.overrides.slotAssignments, [slotName]: assignments },
              },
            },
          })),
        ),
    }),
    { name: STORAGE_KEYS.cvVariants },
  ),
);

// ---------------------------------------------------------------------------
// Convenience hooks
// ---------------------------------------------------------------------------

/** The currently active CV variant, or undefined if none. */
export function useActiveCvVariant(): CVVariant | undefined {
  return useCvVariantsStore((s) => s.variants.find((v) => v.id === s.activeVariantId));
}

/** Active variant id (stable selector). */
export function useActiveCvVariantId(): string | undefined {
  return useCvVariantsStore((s) => s.activeVariantId);
}
