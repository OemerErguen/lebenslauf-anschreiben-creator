import { useCallback, useMemo } from 'react';
import {
  useActiveCoverLetterVariant,
  useCoverLetterVariantsStore,
} from '../../state/coverLetterVariantsStore.js';
import { useActiveDesign } from '../../state/designStore.js';

/**
 * Reads and writes the full options object for a letter component in a
 * header/footer zone. Zone component overrides live on the active
 * cover-letter variant; if unset, the design defaults apply.
 */
export function useZoneComponentOptions(
  slotName: string,
  componentId: string,
): [Record<string, unknown>, (patch: Record<string, unknown>) => void] {
  const zone = slotName === 'anschreiben-header' ? ('header' as const) : ('footer' as const);
  const overrideKey =
    zone === 'header' ? 'headerComponentOverrides' : ('footerComponentOverrides' as const);
  const configKey = zone === 'header' ? 'headerComponents' : ('footerComponents' as const);

  const variant = useActiveCoverLetterVariant();
  const updateZoneComponentOptions = useCoverLetterVariantsStore(
    (s) => s.updateZoneComponentOptions,
  );
  const design = useActiveDesign();

  const rawDefaults = design?.anschreibenConfig?.[configKey];
  const defaults = useMemo(() => rawDefaults ?? [], [rawDefaults]);
  const assignments = variant?.[overrideKey] ?? defaults;
  const match = assignments.find((a) => a.componentId === componentId);
  const options = match?.options ?? {};

  const variantId = variant?.id;
  const patchOptions = useCallback(
    (patch: Record<string, unknown>) => {
      if (!variantId) return;
      updateZoneComponentOptions(variantId, zone, componentId, patch, defaults);
    },
    [variantId, zone, componentId, updateZoneComponentOptions, defaults],
  );

  return [options, patchOptions];
}
