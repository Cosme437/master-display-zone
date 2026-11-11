import { describe, expect, it } from 'vitest';
import { branchCrowd, cakeWeightKg, defaultCake } from '@/lib/bakery';
describe('cake weight', () => {
  it('grows with size and tiers', () => {
    expect(cakeWeightKg({ ...defaultCake, size: 15, tiers: 1 })).toBe(1.2);
    expect(cakeWeightKg({ ...defaultCake, size: 25, tiers: 1 })).toBe(3);
    expect(cakeWeightKg({ ...defaultCake, size: 20, tiers: 2 })).toBe(3.2);
  });
});
describe('store crowd', () => {
  it('is never crowded in the middle of the night', () => { expect(branchCrowd('jardins', new Date(2026, 0, 1, 3, 0)).level).toBe('VAZIO'); });
});
