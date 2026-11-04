import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { cakeImageFiles, getCakeImage } from '@/lib/cake-images';
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
