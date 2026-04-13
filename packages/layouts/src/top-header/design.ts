import { defineDesign, STANDARD_FONT_OPTIONS } from '@cv/layout-engine';

export const topHeaderDesign = defineDesign({
  id: 'top-header',
  name: { de: 'Modern', en: 'Modern' },
  description: {
    de: 'Modernes Layout mit Kopfzeile und Seitenleiste',
    en: 'Modern layout with top header and sidebar',
  },
  thumbnail: '',

  documentTypes: ['lebenslauf', 'anschreiben'],
  supportedLocales: ['de', 'en'],

  colors: [
    {
      key: 'primary',
      label: { de: 'Akzentfarbe', en: 'Accent' },
      default: '#0f172a',
      cssVar: '--cv-primary',
    },
    {
      key: 'secondary',
      label: { de: 'Sekundär', en: 'Secondary' },
      default: '#3b82f6',
      cssVar: '--cv-secondary',
    },
    {
      key: 'sidebar-bg',
      label: { de: 'Seitenleiste', en: 'Sidebar' },
      default: '#f8fafc',
      cssVar: '--cv-sidebar-bg',
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
      key: 'heading',
      label: { de: 'Überschrift', en: 'Heading' },
      default: "'Inter', system-ui, sans-serif",
      cssVar: '--cv-font-heading',
      options: STANDARD_FONT_OPTIONS,
    },
    {
      key: 'body',
      label: { de: 'Fließtext', en: 'Body' },
      default: "'Inter', system-ui, sans-serif",
      cssVar: '--cv-font-body',
      options: STANDARD_FONT_OPTIONS,
    },
  ],

  spacing: {
    options: ['compact', 'normal', 'spacious'],
    default: 'normal',
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
        { value: 'accent-underline', label: { de: 'Akzent-Unterstrich', en: 'Accent underline' } },
        { value: 'uppercase-spaced', label: { de: 'GROSSBUCHSTABEN', en: 'UPPERCASE' } },
        { value: 'normal', label: { de: 'Normal', en: 'Normal' } },
        { value: 'accent-bar', label: { de: 'Akzent-Balken', en: 'Accent bar' } },
      ],
      default: 'accent-underline',
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
      default: 'accent',
    },
  },

  slots: {
    header: {
      accepts: ['header'],
      defaultComponents: [
        { componentId: 'personal-info', options: { showFields: ['name', 'label'] } },
        { componentId: 'contact-info', options: { layout: 'horizontal', displayStyle: 'both' } },
      ],
    },
    sidebar: {
      accepts: ['sidebar'],
      defaultComponents: [
        { componentId: 'skills-list', options: { displayMode: 'bar' } },
        { componentId: 'languages-list', options: {} },
      ],
    },
    main: {
      accepts: ['main'],
      defaultComponents: [
        { componentId: 'summary', options: {} },
        { componentId: 'experience-list', options: { showHighlights: true } },
        { componentId: 'education-list', options: {} },
      ],
    },
  },

  anschreibenConfig: {
    headerBg: 'var(--cv-sidebar-bg)',
    headerComponents: [
      { componentId: 'letter-photo', options: { shape: 'circle' } },
      { componentId: 'letter-title', options: {} },
      { componentId: 'letter-contact', options: { showFields: ['email', 'phone', 'url'] } },
    ],
    headerAccepts: ['letter-header'],
    showFooter: true,
    footerBg: 'var(--cv-sidebar-bg)',
    footerComponents: [
      { componentId: 'letter-contact', options: { showFields: ['email', 'phone', 'url'] } },
    ],
    footerAccepts: ['letter-footer'],
  },

  css: `
.cv-page {
  display: grid;
  grid-template-columns: 70mm 1fr;
  grid-template-rows: auto 1fr;
}
.cv-slot-header {
  grid-column: 1 / -1;
  padding: 12mm 14mm 8mm;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 3mm 8mm;
  border-bottom: 0.5pt solid var(--cv-border);
}
.cv-slot-sidebar {
  background: var(--cv-sidebar-bg);
  padding: 10mm 10mm;
  display: flex;
  flex-direction: column;
  gap: var(--cv-spacing-gap);
}
.cv-slot-main {
  padding: 10mm 12mm;
  display: flex;
  flex-direction: column;
  gap: var(--cv-spacing-gap);
}`,
});
