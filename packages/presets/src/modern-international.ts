import type { Preset } from '@cv/core';

export const modernInternationalPreset: Preset = {
  id: 'modern-international',
  name: { de: 'Modern International', en: 'Modern International' },
  description: {
    de: 'Modernes internationales CV-Layout mit Kopfzeile',
    en: 'Modern international CV layout with top header',
  },
  thumbnail: '',
  designId: 'top-header',
  overrides: {
    colors: {},
    fonts: {},
    options: {},
    slotOptions: {},
    slotAssignments: {
      header: [
        { componentId: 'personal-info', options: { showFields: ['name', 'label'] } },
        { componentId: 'contact-info', options: { layout: 'horizontal', displayStyle: 'both' } },
      ],
      sidebar: [
        { componentId: 'skills-list', options: { displayMode: 'bar' } },
        { componentId: 'languages-list', options: {} },
      ],
      main: [
        { componentId: 'summary', options: {} },
        { componentId: 'experience-list', options: { showHighlights: true } },
        { componentId: 'education-list', options: {} },
        { componentId: 'projects-list', options: { showHighlights: true } },
      ],
    },
  },
};
