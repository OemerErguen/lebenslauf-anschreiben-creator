import { defineDesign, STANDARD_FONT_OPTIONS } from '@cv/layout-engine';

export const sidebarLeftDesign = defineDesign({
  id: 'sidebar-left',
  name: { de: 'Klassisch', en: 'Classic' },
  description: {
    de: 'Klassisches Layout mit Seitenleiste links oder rechts',
    en: 'Classic layout with sidebar on the left or right',
  },
  thumbnail: '',

  documentTypes: ['lebenslauf', 'anschreiben'],
  supportedLocales: ['de', 'en'],

  colors: [
    {
      key: 'primary',
      label: { de: 'Akzentfarbe', en: 'Accent' },
      default: '#1e3a8a',
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
      default: '#f2f4f7',
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
        { value: 'uppercase-spaced', label: { de: 'GROSSBUCHSTABEN', en: 'UPPERCASE' } },
        { value: 'normal', label: { de: 'Normal', en: 'Normal' } },
        { value: 'accent-bar', label: { de: 'Akzent-Balken', en: 'Accent bar' } },
        { value: 'accent-underline', label: { de: 'Akzent-Unterstrich', en: 'Accent underline' } },
      ],
      default: 'uppercase-spaced',
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
      default: 'line',
    },
  },

  slots: {
    sidebar: {
      accepts: ['sidebar'],
      defaultComponents: [
        { componentId: 'photo', options: { shape: 'circle', size: 'md' } },
        {
          componentId: 'personal-info',
          options: { showFields: ['birthDate', 'birthPlace', 'nationality'] },
        },
        { componentId: 'contact-info', options: { layout: 'vertical', displayStyle: 'both' } },
        { componentId: 'skills-list', options: { displayMode: 'dots' } },
        { componentId: 'languages-list', options: {} },
      ],
      options: {
        position: {
          type: 'enum',
          key: 'position',
          label: { de: 'Position', en: 'Position' },
          values: [
            { value: 'left', label: { de: 'Links', en: 'Left' } },
            { value: 'right', label: { de: 'Rechts', en: 'Right' } },
          ],
          default: 'left',
        },
      },
    },
    main: {
      accepts: ['main'],
      defaultComponents: [
        { componentId: 'personal-info', options: { showFields: ['name', 'label'] } },
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
      { componentId: 'letter-contact', options: { showFields: ['email', 'phone'] } },
    ],
    headerAccepts: ['letter-header'],
  },

  css: (opts) => {
    const position = (opts['sidebar.position'] as string | undefined) ?? 'left';
    const columns = position === 'right' ? '1fr 70mm' : '70mm 1fr';
    const sidebarOrder = position === 'right' ? 'order: 2;' : '';
    const mainOrder = position === 'right' ? 'order: 1;' : '';

    return `
.cv-page {
  display: grid;
  grid-template-columns: ${columns};
}
.cv-slot-sidebar {
  background: var(--cv-sidebar-bg);
  padding: 14mm 10mm;
  display: flex;
  flex-direction: column;
  gap: var(--cv-spacing-gap);
  ${sidebarOrder}
}
.cv-slot-main {
  padding: 14mm 12mm;
  display: flex;
  flex-direction: column;
  gap: var(--cv-spacing-gap);
  ${mainOrder}
}`;
  },
});
