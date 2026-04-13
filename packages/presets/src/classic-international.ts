import type { Preset } from '@cv/core';

export const classicInternationalPreset: Preset = {
  id: 'classic-international',
  name: { de: 'Klassisch International', en: 'Classic International' },
  description: {
    de: 'Internationales CV-Layout — ohne Geburtsdaten und Nationalität',
    en: 'International CV layout — without birth details and nationality',
  },
  thumbnail: '',
  designId: 'sidebar-left',
  overrides: {
    colors: {},
    fonts: {},
    options: {},
    slotOptions: {},
    slotAssignments: {
      sidebar: [
        { componentId: 'photo', options: { shape: 'rounded', size: 'md' } },
        { componentId: 'contact-info', options: { layout: 'vertical', displayStyle: 'both' } },
        { componentId: 'skills-list', options: { displayMode: 'dots' } },
        { componentId: 'languages-list', options: {} },
      ],
      main: [
        { componentId: 'personal-info', options: { showFields: ['name', 'label'] } },
        { componentId: 'summary', options: {} },
        { componentId: 'experience-list', options: { showHighlights: true } },
        { componentId: 'education-list', options: {} },
      ],
    },
  },
};
