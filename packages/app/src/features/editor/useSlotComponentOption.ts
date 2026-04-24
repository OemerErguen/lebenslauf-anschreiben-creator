import { useCallback, useMemo } from 'react';
import {
  useActiveCoverLetterVariant,
  useCoverLetterVariantsStore,
} from '../../state/coverLetterVariantsStore.js';
import {
  useActiveDesign,
  useDesignStore,
  useResolvedSlotAssignments,
} from '../../state/designStore.js';

/**
 * Reads and writes a specific option for a component in a specific slot.
 *
 * For regular CV slots: operates on the active CV variant's design overrides.
 * For anschreiben zones (slot name starts with 'anschreiben-'): operates on the
 * active cover-letter variant's zone overrides, falling back to design defaults.
 */
export function useSlotComponentOption(
  slotName: string,
  componentId: string,
  optionKey: string,
  defaultValue: string,
) {
  const isAnschreibenZone = slotName.startsWith('anschreiben-');

  const updateComponentOptions = useDesignStore((s) => s.updateComponentOptions);
  const allAssignments = useResolvedSlotAssignments();

  const clVariant = useActiveCoverLetterVariant();
  const updateZoneComponentOptions = useCoverLetterVariantsStore(
    (s) => s.updateZoneComponentOptions,
  );
  const design = useActiveDesign();

  const zone = slotName === 'anschreiben-header' ? ('header' as const) : ('footer' as const);
  const overrideKey =
    zone === 'header' ? 'headerComponentOverrides' : ('footerComponentOverrides' as const);
  const configKey = zone === 'header' ? 'headerComponents' : ('footerComponents' as const);
  const rawAnschreibenDefaults = design?.anschreibenConfig?.[configKey];
  const anschreibenDefaults = useMemo(() => rawAnschreibenDefaults ?? [], [rawAnschreibenDefaults]);
  const anschreibenAssignments = clVariant?.[overrideKey] ?? anschreibenDefaults;
  const anschreibenMatch = anschreibenAssignments.find((a) => a.componentId === componentId);
  const anschreibenValue =
    (anschreibenMatch?.options[optionKey] as string | undefined) ?? defaultValue;

  const clVariantId = clVariant?.id;
  const setAnschreibenValue = useCallback(
    (newValue: string) => {
      if (!clVariantId) return;
      updateZoneComponentOptions(
        clVariantId,
        zone,
        componentId,
        { [optionKey]: newValue },
        anschreibenDefaults,
      );
    },
    [clVariantId, zone, componentId, optionKey, updateZoneComponentOptions, anschreibenDefaults],
  );

  const cvAssignments = allAssignments[slotName] ?? [];
  const cvMatch = cvAssignments.find((a) => a.componentId === componentId);
  const cvValue = (cvMatch?.options[optionKey] as string | undefined) ?? defaultValue;

  const setCvValue = useCallback(
    (newValue: string) => {
      updateComponentOptions(slotName, componentId, { [optionKey]: newValue });
    },
    [slotName, componentId, optionKey, updateComponentOptions],
  );

  if (isAnschreibenZone) {
    return [anschreibenValue, setAnschreibenValue] as const;
  }

  return [cvValue, setCvValue] as const;
}
