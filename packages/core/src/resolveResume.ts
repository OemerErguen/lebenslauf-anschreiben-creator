import type { CVVariant, SectionId, SectionVisibility } from './index.js';
import type { Resume } from './schema/resume.js';

/** Map a section id to the resume key holding its array of items. */
const SECTION_TO_RESUME_KEY: Partial<Record<SectionId, keyof Resume>> = {
  experience: 'work',
  education: 'education',
  skills: 'skills',
  languages: 'languages',
  projects: 'projects',
  certificates: 'certificates',
  publications: 'publications',
  awards: 'awards',
  volunteer: 'volunteer',
  interests: 'interests',
  references: 'references',
  custom: 'custom',
};

/**
 * Apply a variant's selection + ordering rules to a single section array. If no
 * selection entry exists for the section, the pool order is preserved. Items
 * not found in the pool are silently dropped (e.g. removed after the variant
 * was created).
 * @param items
 * @param selectedIds
 * @returns Filtered and reordered items.
 */
function applySelection<T extends { id: string }>(items: T[], selectedIds: string[] | undefined): T[] {
  if (!selectedIds || selectedIds.length === 0) return items;
  const byId = new Map(items.map((item) => [item.id, item]));
  return selectedIds.map((id) => byId.get(id)).filter((item): item is T => item != null);
}

/**
 * Materialise the {@link Resume} that the renderer will consume for the given
 * variant. The pool resume is the source of truth; the variant supplies
 * selections (which items, in which order). Sections hidden by the variant's
 * visibility are emptied so renderer components see no data for them.
 * @param profileResume
 * @param variant
 * @returns Resume materialised for the renderer.
 */
export function resolveResume(profileResume: Resume, variant: CVVariant): Resume {
  const visibility = variant.sectionVisibility;
  const selections = variant.selections;

  const isVisible = (sectionId: SectionId) => visibility[sectionId] !== false;

  const filteredOrEmpty = <K extends keyof Resume>(sectionId: SectionId, key: K): Resume[K] => {
    if (!isVisible(sectionId)) return [] as unknown as Resume[K];
    const items = profileResume[key] as { id: string }[];
    return applySelection(items, selections[sectionId]) as unknown as Resume[K];
  };

  const resolved: Resume = {
    basics: profileResume.basics,
    work: filteredOrEmpty('experience', 'work'),
    education: filteredOrEmpty('education', 'education'),
    skills: filteredOrEmpty('skills', 'skills'),
    languages: filteredOrEmpty('languages', 'languages'),
    projects: filteredOrEmpty('projects', 'projects'),
    certificates: filteredOrEmpty('certificates', 'certificates'),
    publications: filteredOrEmpty('publications', 'publications'),
    awards: filteredOrEmpty('awards', 'awards'),
    volunteer: filteredOrEmpty('volunteer', 'volunteer'),
    interests: filteredOrEmpty('interests', 'interests'),
    references: filteredOrEmpty('references', 'references'),
    custom: filteredOrEmpty('custom', 'custom'),
  };

  return resolved;
}

/**
 * Convenience: build the *full* selections map for a variant by filling in any
 * missing sections with the pool's current item order. Useful for the UI when
 * displaying the per-section ordering even though storage is sparse.
 * @param profileResume
 * @param selections
 * @returns Full Record of section IDs to ordered item IDs.
 */
export function expandSelections(
  profileResume: Resume,
  selections: CVVariant['selections'],
): Record<SectionId, string[]> {
  const out: Partial<Record<SectionId, string[]>> = {};
  for (const [sectionId, key] of Object.entries(SECTION_TO_RESUME_KEY) as [SectionId, keyof Resume][]) {
    const explicit = selections[sectionId];
    if (explicit && explicit.length > 0) {
      out[sectionId] = explicit;
    } else {
      out[sectionId] = (profileResume[key] as { id: string }[]).map((item) => item.id);
    }
  }
  return out as Record<SectionId, string[]>;
}

/**
 * Default visibility lookup helper — returns the variant's visibility map.
 * @param variant
 * @returns The variant's SectionVisibility map.
 */
export function getSectionVisibility(variant: CVVariant): SectionVisibility {
  return variant.sectionVisibility;
}
