import { describe, expect, it } from 'vitest';
import { resolveResume } from './resolveResume.js';
import { sampleCvVariant, sampleResume } from './sampleData.js';

describe('resolveResume', () => {
  it('returns the full pool unchanged when no selections and all sections visible', () => {
    const variant = {
      ...sampleCvVariant,
      sectionVisibility: {
        ...sampleCvVariant.sectionVisibility,
        skills: true,
        experience: true,
      },
      selections: {},
    };
    const resolved = resolveResume(sampleResume, variant);
    expect(resolved.skills).toEqual(sampleResume.skills);
    expect(resolved.work).toEqual(sampleResume.work);
  });

  it('filters and reorders skills by selected ids', () => {
    const variant = {
      ...sampleCvVariant,
      selections: { skills: ['skill-3', 'skill-1'] },
    };
    const resolved = resolveResume(sampleResume, variant);
    expect(resolved.skills.map((s) => s.id)).toEqual(['skill-3', 'skill-1']);
  });

  it('drops unknown ids silently', () => {
    const variant = {
      ...sampleCvVariant,
      selections: { skills: ['skill-1', 'does-not-exist', 'skill-2'] },
    };
    const resolved = resolveResume(sampleResume, variant);
    expect(resolved.skills.map((s) => s.id)).toEqual(['skill-1', 'skill-2']);
  });

  it('returns an empty array for sections marked invisible', () => {
    const variant = {
      ...sampleCvVariant,
      sectionVisibility: { ...sampleCvVariant.sectionVisibility, skills: false },
    };
    const resolved = resolveResume(sampleResume, variant);
    expect(resolved.skills).toEqual([]);
    expect(resolved.work).not.toEqual([]);
  });

  it('always returns the pool basics regardless of variant', () => {
    const resolved = resolveResume(sampleResume, sampleCvVariant);
    expect(resolved.basics).toBe(sampleResume.basics);
  });
});
