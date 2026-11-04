import type { CakeConfig, CakeFrosting } from '@/lib/bakery';

/** Exact filenames of the 19 corrected cake photos (served from /public/bolos). */
export const cakeImageFiles = [
  'bolo-1-andar-coracao-baunilha-brigadeiro-chocolate',
  'bolo-1-andar-coracao-baunilha-brigadeiro-doce-de-leite-branca',
  'bolo-1-andar-coracao-chocolate-brigadeiro-doce-de-leite-naked',
  'bolo-1-andar-coracao-red-velvet-creme-de-baunilha-morango-naked',
  'bolo-1-andar-quadrado-baunilha-brigadeiro-doce-de-leite-naked',
  'bolo-1-andar-quadrado-chocolate-doce-de-leite-chocolate',
  'bolo-1-andar-quadrado-red-velvet-doce-de-leite-branca',
  'bolo-1-andar-redondo-baunilha-creme-de-baunilha-branca',
  'bolo-1-andar-redondo-chocolate-brigadeiro-chocolate',
  'bolo-1-andar-redondo-red-velvet-brigadeiro-naked',
  'bolo-2-andares-coracao-chocolate-creme-de-baunilha-chocolate',
  'bolo-2-andares-coracao-chocolate-morango-naked',
  'bolo-2-andares-coracao-red-velvet-creme-de-baunilha-naked',
  'bolo-2-andares-quadrado-baunilha-doce-de-leite-naked',
  'bolo-2-andares-quadrado-baunilha-morango-chocolate',
  'bolo-2-andares-quadrado-red-velvet-brigadeiro-doce-de-leite-branca',
  'bolo-2-andares-redondo-baunilha-morango-creme-de-baunilha-branca',
  'bolo-2-andares-redondo-chocolate-creme-de-baunilha-morango-branca',
  'bolo-2-andares-redondo-red-velvet-brigadeiro-chocolate',
] as const;

const slug = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '-');
const frostingSlug: Record<CakeFrosting, string> = { ivory: 'branca', chocolate: 'chocolate', naked: 'naked', rose: 'rosa' };

/** Order-insensitive lookup key: tiers|shape|dough|sorted fillings|frosting. */
const lookupKey = (tiers: number, shape: string, dough: string, fillings: string[], frosting: string) =>
  [tiers, shape, dough, [...fillings].sort().join('+'), frosting].join('|');

const fillingSlugs = ['creme-de-baunilha', 'doce-de-leite', 'brigadeiro', 'morango'];
const imageMap = new Map<string, string>();
for (const file of cakeImageFiles) {
  const m = file.match(/^bolo-(\d)-andar(?:es)?-(coracao|quadrado|redondo)-(baunilha|chocolate|red-velvet)-(.+)-(branca|chocolate|naked)$/)!;
  let rest: string = m[4] ?? ''; const fillings: string[] = [];
  while (rest) { const r = rest; const f = fillingSlugs.find(s => r === s || r.startsWith(`${s}-`))!; fillings.push(f); rest = rest.slice(f.length + 1); }
  imageMap.set(lookupKey(Number(m[1]), m[2] ?? '', m[3] ?? '', fillings, m[5] ?? ''), file);
}

/** Returns the URL of the exact photo for the selected buttons, or null when none was photographed. */
export function getCakeImage(andares: number, massa: string, recheios: string[], formato: string, cobertura: CakeFrosting): string | null {
  const file = imageMap.get(lookupKey(andares, slug(formato), slug(massa), recheios.map(slug), frostingSlug[cobertura]));
  return file ? `/bolos/${file}.webp` : null;
}

export const cakeImageFor = (config: CakeConfig, frosting: CakeFrosting = config.frosting ?? 'ivory') =>
  getCakeImage(config.tiers ?? 1, config.dough, config.fillings, config.shape, frosting);
