import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { cakeImageFiles, getCakeImage, exactCakeImage } from '@/lib/cake-images';
import { catalogCakes, catalogConfig } from '@/lib/bakery';
describe('getCakeImage', () => {
  it('maps the buttons to the exact uploaded filename', () => {
    expect(getCakeImage(1, 'Red Velvet', ['Brigadeiro'], 'Redondo', 'naked')).toBe('/bolos/bolo-1-andar-redondo-red-velvet-brigadeiro-naked.webp');
    expect(getCakeImage(2, 'Baunilha', ['Creme de Baunilha', 'Morango'], 'Redondo', 'ivory')).toBe('/bolos/bolo-2-andares-redondo-baunilha-morango-creme-de-baunilha-branca.webp');
  });
  it('returns null for an unphotographed combination', () => { expect(getCakeImage(1, 'Baunilha', ['Morango'], 'Redondo', 'naked')).toBeNull(); });
  it('covers every catalog cake with an existing file', () => {
    expect(cakeImageFiles).toHaveLength(19);
    for (const key of catalogCakes) { const c = catalogConfig(key); const url = getCakeImage(c.tiers!, c.dough, c.fillings, c.shape, c.frosting!); expect(url, key).not.toBeNull(); expect(existsSync(`public${url}`)).toBe(true); }
  });
});
describe('independent cake decorations', () => {
  for (const key of catalogCakes) {
    const config = catalogConfig(key);
    it(`${key}: berries without flowers`, () => {
      const image = exactCakeImage({ ...config, edibleFlowers: false, redBerries: true });
      expect(image.url).toMatch(/-frutas\.webp$/);
      expect(existsSync(`public${image.url}`)).toBe(true);
    });
    it(`${key}: flowers without berries`, () => {
      const image = exactCakeImage({ ...config, edibleFlowers: true, redBerries: false });
      expect(image.url).toMatch(/-flores\.webp$/);
      expect(existsSync(`public${image.url}`)).toBe(true);
    });
    it(`${key}: no decoration`, () => {
      const image = exactCakeImage({ ...config, edibleFlowers: false, redBerries: false });
      expect(image.url).toMatch(/-lisa\.webp$/);
      expect(existsSync(`public${image.url}`)).toBe(true);
    });
    it(`${key}: both decorations`, () => {
      const image = exactCakeImage({ ...config, edibleFlowers: true, redBerries: true });
      expect(image.url).toBe(getCakeImage(config.tiers ?? 1, config.dough, config.fillings, config.shape, config.frosting ?? 'ivory'));
    });
  }
});
import { defaultCake } from '@/lib/bakery';
import { cakeOptionAvailability, snapCakeToPhoto } from '@/lib/cake-images';
describe('exact photo paths only', () => {
  it('shows the silhouette instead of a different cake', () => {
    const r = exactCakeImage({ ...defaultCake, shape: 'Redondo', tiers: 1, dough: 'Baunilha', fillings: ['Morango'], frosting: 'naked' });
    expect(r.exact).toBe(false); expect(r.url).toBe('/bolos/silhueta.svg');
  });
  it('disables a filling with no photo for the chosen dough and shape', () => {
    const a = cakeOptionAvailability({ ...defaultCake, tiers: 1, dough: 'Baunilha', shape: 'Redondo', fillings: ['Creme de Baunilha'], frosting: 'ivory' });
    expect(a.filling('Creme de Baunilha')).toBe(true); expect(a.filling('Morango')).toBe(false); expect(a.frosting('naked')).toBe(false);
  });
  it('every click lands on a real photo', () => {
    for (const shape of ['Redondo', 'Quadrado', 'Coração']) for (const dough of ['Baunilha', 'Chocolate', 'Red Velvet']) for (const tiers of [1, 2] as const) {
      const c = snapCakeToPhoto({ ...defaultCake, shape, dough, tiers, fillings: ['Brigadeiro'], frosting: 'ivory' });
      expect(exactCakeImage(c).exact, `${tiers} ${dough} ${shape}`).toBe(true);
    }
  });
});
