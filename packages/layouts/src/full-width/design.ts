import { defineDesign, STANDARD_FONT_OPTIONS } from '@cv/layout-engine';

export const fullWidthDesign = defineDesign({
  id: 'full-width',
  name: { de: 'Minimal', en: 'Minimal' },
  description: {
    de: 'Minimalistisches Layout ohne Seitenleiste',
    en: 'Minimalist layout without sidebar',
  },
  thumbnail: '',

  documentTypes: ['lebenslauf', 'anschreiben'],
  supportedLocales: ['de', 'en'],

  colors: [
    {
      key: 'primary',
      label: { de: 'Akzentfarbe', en: 'Accent' },
      default: '#000000',
      cssVar: '--cv-primary',
    },
    { key: 'text', label: { de: 'Text', en: 'Text' }, default: '#1b1f23', cssVar: '--cv-text' },
    {
      key: 'muted',
      label: { de: 'Gedämpft', en: 'Muted' },
      default: '#55606b',
      cssVar: '--cv-muted',
    },
    {
      key: 'border',
      label: { de: 'Rahmen', en: 'Border' },
      default: '#d0d7de',
      cssVar: '--cv-border',
    },
  ],

  fonts: [
    {
      key: 'body',
      label: { de: 'Schrift', en: 'Font' },
      default: 'system-ui, sans-serif',
      cssVar: '--cv-font-body',
      options: STANDARD_FONT_OPTIONS,
    },
  ],

  spacing: {
    options: ['compact', 'normal', 'spacious'],
    default: 'compact',
    scale: {
      compact: { section: '4mm', entry: '2mm', gap: '5mm' },
      normal: { section: '7mm', entry: '3mm', gap: '7mm' },
      spacious: { section: '10mm', entry: '5mm', gap: '9mm' },
    },
  },

  options: {
    sectionTitleStyle: {
      type: 'enum',
      key: 'sectionTitleStyle',
      label: { de: 'Titelstil', en: 'Title style' },
      values: [
        { value: 'normal', label: { de: 'Normal', en: 'Normal' } },
        { value: 'uppercase-spaced', label: { de: 'GROSSBUCHSTABEN', en: 'UPPERCASE' } },
        { value: 'accent-underline', label: { de: 'Akzent-Unterstrich', en: 'Accent underline' } },
      ],
      default: 'normal',
    },
    timelineStyle: {
      type: 'enum',
      key: 'timelineStyle',
      label: { de: 'Timeline-Stil', en: 'Timeline style' },
      values: [
        { value: 'plain', label: { de: 'Schlicht', en: 'Plain' } },
        { value: 'line', label: { de: 'Linie & Punkte', en: 'Line & dots' } },
        { value: 'accent', label: { de: 'Akzentlinie', en: 'Accent line' } },
      ],
      default: 'plain',
    },
  },

  slots: {
    main: {
      accepts: ['main', 'sidebar'],
      defaultComponents: [
        { componentId: 'personal-info', options: { showFields: ['name', 'label'] } },
        { componentId: 'contact-info', options: { layout: 'horizontal', displayStyle: 'both' } },
        { componentId: 'summary', options: {} },
        { componentId: 'experience-list', options: { showHighlights: true } },
        { componentId: 'education-list', options: {} },
        { componentId: 'skills-list', options: { displayMode: 'dots' } },
        { componentId: 'languages-list', options: {} },
      ],
    },
  },

  anschreibenConfig: {},

  css: `
.cv-page {
  display: flex;
  flex-direction: column;
}
.cv-slot-main {
  padding: 14mm 16mm;
  display: flex;
  flex-direction: column;
  gap: var(--cv-spacing-gap);
}`,
});
