import type { Preset } from '@cv/core';

export const classicPreset: Preset = {
  id: 'classic',
  name: { de: 'Klassisch', en: 'Classic' },
  description: {
    de: 'Klassisches deutsches Lebenslauf-Layout mit Seitenleiste',
    en: 'Classic German CV layout with sidebar',
  },
  thumbnail: '',
  designId: 'sidebar-left',
  overrides: {
    colors: {},
    fonts: {},
    options: {},
    slotOptions: {},
    slotAssignments: {},
  },
};
