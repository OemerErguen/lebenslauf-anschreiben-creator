import type { DocumentType, SlotAssignment, UserOverrides } from '@cv/core';
import type { DesignDefinition, ResolvedTokens } from '@cv/layout-engine';
import { useMemo } from 'react';
import {
  emptyOverrides,
  getDesign,
  resolveAllSlotOptions,
  resolveSlotAssignments,
  resolveTokens,
} from '@cv/layout-engine';
import { useCvVariantsStore } from './cvVariantsStore.js';
import { useSettingsStore } from './settingsStore.js';

/**
 * Façade preserving the legacy `useDesignStore` selector API. Internally, all
 * design state lives on the active CV variant — this hook just relays reads
 * and writes. UI-level fields (active document type) come from settingsStore.
 */
interface DesignFacade {
  activeDesignId: string;
  overrides: UserOverrides;
  activeDocumentType: DocumentType;

  applyDesign: (designId: string) => void;
  applyPresetOverrides: (designId: string, overrides: UserOverrides) => void;

  setColor: (key: string, value: string) => void;
  setFont: (key: string, value: string) => void;
  setSpacing: (value: string) => void;
  setOption: (key: string, value: unknown) => void;
  setSlotOption: (slotName: string, optionKey: string, value: unknown) => void;
  setSlotAssignments: (slotName: string, assignments: SlotAssignment[]) => void;
  moveComponent: (slotName: string, fromIndex: number, toIndex: number) => void;
  toggleComponent: (slotName: string, componentId: string) => void;
  updateComponentOptions: (
    slotName: string,
    componentId: string,
    options: Record<string, unknown>,
  ) => void;

  setActiveDocumentType: (type: DocumentType) => void;
}

// ---------------------------------------------------------------------------
// Action helpers — module-scope so identities are stable across renders.
// They mutate the active variant via cvVariantsStore.
// ---------------------------------------------------------------------------

function getActiveVariantId(): string | undefined {
  return useCvVariantsStore.getState().activeVariantId;
}

function getActiveOverrides(): UserOverrides {
  const state = useCvVariantsStore.getState();
  const v = state.variants.find((variant) => variant.id === state.activeVariantId);
  return v?.design.overrides ?? emptyOverrides;
}

function patchOverrides(patch: Partial<UserOverrides>): void {
  const id = getActiveVariantId();
  if (!id) return;
  useCvVariantsStore.getState().patchDesignOverrides(id, patch);
}

const designActions: Omit<
  DesignFacade,
  'activeDesignId' | 'overrides' | 'activeDocumentType' | 'setActiveDocumentType'
> = {
  applyDesign: (designId) => {
    const id = getActiveVariantId();
    if (!id) return;
    useCvVariantsStore.getState().setDesignActiveId(id, designId);
  },

  applyPresetOverrides: (designId, overrides) => {
    const id = getActiveVariantId();
    if (!id) return;
    useCvVariantsStore.getState().patchVariant(id, {
      design: { activeDesignId: designId, overrides },
    });
  },

  setColor: (key, value) => {
    const current = getActiveOverrides();
    patchOverrides({ colors: { ...current.colors, [key]: value } });
  },

  setFont: (key, value) => {
    const current = getActiveOverrides();
    patchOverrides({ fonts: { ...current.fonts, [key]: value } });
  },

  setSpacing: (value) => {
    patchOverrides({ spacing: value });
  },

  setOption: (key, value) => {
    const current = getActiveOverrides();
    patchOverrides({ options: { ...current.options, [key]: value } });
  },

  setSlotOption: (slotName, optionKey, value) => {
    const current = getActiveOverrides();
    patchOverrides({
      slotOptions: { ...current.slotOptions, [`${slotName}.${optionKey}`]: value },
    });
  },

  setSlotAssignments: (slotName, assignments) => {
    const id = getActiveVariantId();
    if (!id) return;
    useCvVariantsStore.getState().setDesignSlotAssignments(id, slotName, assignments);
  },

  moveComponent: (slotName, fromIndex, toIndex) => {
    const id = getActiveVariantId();
    if (!id) return;
    const overrides = getActiveOverrides();
    const designId = useCvVariantsStore
      .getState()
      .variants.find((v) => v.id === id)?.design.activeDesignId;
    const design = designId ? getDesign(designId) : undefined;
    const defaults = design?.slots[slotName]?.defaultComponents ?? [];
    const current = [...(overrides.slotAssignments[slotName] ?? defaults)];
    const [item] = current.splice(fromIndex, 1);
    if (!item) return;
    current.splice(toIndex, 0, item);
    useCvVariantsStore.getState().setDesignSlotAssignments(id, slotName, current);
  },

  toggleComponent: (slotName, componentId) => {
    const id = getActiveVariantId();
    if (!id) return;
    const overrides = getActiveOverrides();
    const designId = useCvVariantsStore
      .getState()
      .variants.find((v) => v.id === id)?.design.activeDesignId;
    const design = designId ? getDesign(designId) : undefined;
    const defaults = design?.slots[slotName]?.defaultComponents ?? [];
    const current = overrides.slotAssignments[slotName] ?? defaults;
    const exists = current.some((a) => a.componentId === componentId);
    const updated = exists
      ? current.filter((a) => a.componentId !== componentId)
      : [...current, { componentId, options: {} }];
    useCvVariantsStore.getState().setDesignSlotAssignments(id, slotName, updated);
  },

  updateComponentOptions: (slotName, componentId, options) => {
    const id = getActiveVariantId();
    if (!id) return;
    const overrides = getActiveOverrides();
    const designId = useCvVariantsStore
      .getState()
      .variants.find((v) => v.id === id)?.design.activeDesignId;
    const design = designId ? getDesign(designId) : undefined;
    const defaults = design?.slots[slotName]?.defaultComponents ?? [];
    const current = overrides.slotAssignments[slotName] ?? defaults;
    const updated = current.map((a) =>
      a.componentId === componentId ? { ...a, options: { ...a.options, ...options } } : a,
    );
    useCvVariantsStore.getState().setDesignSlotAssignments(id, slotName, updated);
  },
};

// ---------------------------------------------------------------------------
// Hook surface
// ---------------------------------------------------------------------------

/**
 * Drop-in replacement for the legacy zustand `useDesignStore` selector hook.
 * Reads come from the active variant's design field; actions mutate the active
 * variant. `activeDocumentType` is sourced from globalSettings.
 */
export function useDesignStore<T>(selector: (state: DesignFacade) => T): T {
  const activeDesignId = useCvVariantsStore((s) => {
    const v = s.variants.find((variant) => variant.id === s.activeVariantId);
    return v?.design.activeDesignId ?? 'sidebar-left';
  });

  const overrides = useCvVariantsStore((s) => {
    const v = s.variants.find((variant) => variant.id === s.activeVariantId);
    return v?.design.overrides ?? emptyOverrides;
  });

  const activeDocumentType = useSettingsStore((s) => s.settings.activeDocumentType);
  const setActiveDocumentType = useSettingsStore((s) => s.setActiveDocumentType);

  const facade = useMemo<DesignFacade>(
    () => ({
      activeDesignId,
      overrides,
      activeDocumentType,
      setActiveDocumentType,
      ...designActions,
    }),
    [activeDesignId, overrides, activeDocumentType, setActiveDocumentType],
  );

  return selector(facade);
}

// ---------------------------------------------------------------------------
// Derived selectors — same API as before
// ---------------------------------------------------------------------------

export function useActiveDesign(): DesignDefinition | undefined {
  const id = useDesignStore((s) => s.activeDesignId);
  return getDesign(id);
}

export function useResolvedTokens(): ResolvedTokens | undefined {
  const design = useActiveDesign();
  const overrides = useDesignStore((s) => s.overrides);
  if (!design) return undefined;
  return resolveTokens(design, overrides);
}

export function useResolvedSlotAssignments(): Record<string, SlotAssignment[]> {
  const design = useActiveDesign();
  const overrides = useDesignStore((s) => s.overrides);
  if (!design) return {};
  return resolveSlotAssignments(design, overrides);
}

export function useResolvedSlotOptions(): Record<string, unknown> {
  const design = useActiveDesign();
  const overrides = useDesignStore((s) => s.overrides);
  if (!design) return {};
  return resolveAllSlotOptions(design, overrides);
}
