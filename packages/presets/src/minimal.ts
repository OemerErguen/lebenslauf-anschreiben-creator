import type { Preset } from '@cv/core';

export const minimalPreset: Preset = {
  id: 'minimal',
  name: { de: 'Minimal', en: 'Minimal' },
  description: {
    de: 'Minimalistisches einseitiges Layout ohne Seitenleiste',
    en: 'Minimalist single-column layout without sidebar',
  },
  thumbnail: '',
  designId: 'full-width',
  overrides: {
    colors: {},
    fonts: {},
    options: {},
    slotOptions: {},
    slotAssignments: {},
  },
};
