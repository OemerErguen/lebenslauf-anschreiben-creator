import type { ComponentDefinition, ExpandedSlotDefinition } from './types.js';
import type { SlotAssignment } from '@cv/core';

/**
 * Returns components that are compatible with a given slot and not yet
 * assigned to it (or allowed to appear multiple times).
 * @param slotDef
 * @param allComponents
 * @param currentAssignments
 * @returns Array of compatible component definitions not yet assigned
 */
export function getCompatibleComponents(
  slotDef: ExpandedSlotDefinition,
  allComponents: ComponentDefinition[],
  currentAssignments: SlotAssignment[],
): ComponentDefinition[] {
  // Check maxComponents limit
  if (slotDef.maxComponents !== undefined && currentAssignments.length >= slotDef.maxComponents) {
    return [];
  }

  return allComponents.filter((c) => {
    // Component must have at least one allowedSlot that the slot accepts
    const compatible = c.allowedSlots.some((s) => slotDef.accepts.includes(s));
    if (!compatible) return false;

    // Exclude components already in this slot (no duplicates)
    const alreadyAssigned = currentAssignments.some((a) => a.componentId === c.id);
    return !alreadyAssigned;
  });
}

/**
 * Checks whether a specific component can be added to a slot.
 * @param slotDef
 * @param component
 * @param currentAssignments
 * @returns True if the component can be added to the slot
 */
export function canAddToSlot(
  slotDef: ExpandedSlotDefinition,
  component: ComponentDefinition,
  currentAssignments: SlotAssignment[],
): boolean {
  if (slotDef.maxComponents !== undefined && currentAssignments.length >= slotDef.maxComponents) {
    return false;
  }
  return component.allowedSlots.some((s) => slotDef.accepts.includes(s));
}
