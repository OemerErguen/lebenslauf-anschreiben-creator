import type { Preset } from '@cv/core';

export const modernPreset: Preset = {
  id: 'modern',
  name: { de: 'Modern', en: 'Modern' },
  description: {
    de: 'Modernes Layout mit Kopfzeile und Akzent-Unterstrichen',
    en: 'Modern layout with top header and accent underlines',
  },
  thumbnail: '',
  designId: 'top-header',
  overrides: {
    colors: {},
    fonts: {},
    options: {},
    slotOptions: {},
    slotAssignments: {},
  },
};
