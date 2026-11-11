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
const entries: { file: string; tiers: number; shape: string; dough: string; fillings: string[]; frosting: string }[] = [];
for (const file of cakeImageFiles) {
  const m = file.match(/^bolo-(\d)-andar(?:es)?-(coracao|quadrado|redondo)-(baunilha|chocolate|red-velvet)-(.+)-(branca|chocolate|naked)$/);
  if (!m) continue;
  let rest: string = m[4] ?? ''; const fillings: string[] = [];
  while (rest) { const r = rest; const f = fillingSlugs.find(s => r === s || r.startsWith(`${s}-`)); if (!f) break; fillings.push(f); rest = rest.slice(f.length + 1); }
  imageMap.set(lookupKey(Number(m[1]), m[2] ?? '', m[3] ?? '', fillings, m[5] ?? ''), file);
  entries.push({ file, tiers: Number(m[1]), shape: m[2] ?? '', dough: m[3] ?? '', fillings, frosting: m[5] ?? '' });
}

/** Returns the URL of the exact photo for the selected buttons, or null when none was photographed. */
export function getCakeImage(andares: number, massa: string, recheios: string[], formato: string, cobertura: CakeFrosting): string | null {
  const file = imageMap.get(lookupKey(andares, slug(formato), slug(massa), recheios.map(slug), frostingSlug[cobertura]));
  return file ? `/bolos/${file}.webp` : null;
}

export const cakeImageFor = (config: CakeConfig, frosting: CakeFrosting = config.frosting ?? 'ivory') =>
  decorateCakeImage(getCakeImage(config.tiers ?? 1, config.dough, config.fillings, config.shape, frosting), config);

/** Decorations select an edited whole-cake photograph, never an overlay. */
function decorateCakeImage(url: string | null, config: CakeConfig): string | null {
  if (!url) return null;
  const suffix = config.edibleFlowers ? (config.redBerries ? '' : '-flores') : (config.redBerries ? '-frutas' : '-lisa');
  return url.replace(/\.webp$/, `${suffix}.webp`);
}

/** Shown when the selection has no real photo; never substitute a different cake. */
export const cakeSilhouetteImage = '/bolos/silhueta.svg';

/** The exact photo for the selection (with decoration suffix), or the silhouette. */
export function exactCakeImage(config: CakeConfig): { url: string; exact: boolean } {
  const url = cakeImageFor(config);
  return url ? { url, exact: true } : { url: cakeSilhouetteImage, exact: false };
}

type Entry = (typeof entries)[number];
const fillingName: Record<string, string> = { 'creme-de-baunilha': 'Creme de Baunilha', 'doce-de-leite': 'Doce de Leite', brigadeiro: 'Brigadeiro', morango: 'Morango' };
const frostingId: Record<string, CakeFrosting> = { branca: 'ivory', chocolate: 'chocolate', naked: 'naked' };
const sameSet = (a: string[], b: string[]) => a.length === b.length && a.every(x => b.includes(x));
const step = (c: CakeConfig) => ({ tiers: c.tiers ?? 1, dough: slug(c.dough), shape: slug(c.shape), fillings: c.fillings.map(slug), frosting: frostingSlug[c.frosting ?? 'ivory'] });
const matching = (c: CakeConfig, upTo: 'tiers' | 'dough' | 'shape' | 'fillings') => {
  const s = step(c); const order = ['tiers', 'dough', 'shape', 'fillings'] as const; const n = order.indexOf(upTo);
  return entries.filter(e => e.tiers === s.tiers && (n < 1 || e.dough === s.dough) && (n < 2 || e.shape === s.shape) && (n < 3 || sameSet(e.fillings, s.fillings)));
};

/** Which buttons lead to one of the real photos, given the choices made upstream (andares → massa → formato → recheio → cobertura). */
export function cakeOptionAvailability(config: CakeConfig) {
  const s = step(config);
  return {
    tiers: (t: number) => entries.some(e => e.tiers === t),
    dough: (d: string) => matching(config, 'tiers').some(e => e.dough === slug(d)),
    shape: (sh: string) => matching(config, 'dough').some(e => e.shape === slug(sh)),
    filling: (f: string) => matching(config, 'shape').some(e => e.fillings.includes(slug(f))),
    frosting: (f: CakeFrosting) => matching(config, 'fillings').some(e => e.frosting === frostingSlug[f]),
    current: s,
  };
}

const toConfig = (c: CakeConfig, e: Entry): CakeConfig => ({ ...c, tiers: e.tiers as 1 | 2, dough: c.dough, fillings: e.fillings.map(f => fillingName[f] ?? f), frosting: frostingId[e.frosting] ?? 'ivory' });
const dough: Record<string, string> = { baunilha: 'Baunilha', chocolate: 'Chocolate', 'red-velvet': 'Red Velvet' };
const shape: Record<string, string> = { redondo: 'Redondo', quadrado: 'Quadrado', coracao: 'Coração' };

/** Moves the selection onto the nearest real photo after a change, keeping the user's latest choice. */
export function snapCakeToPhoto(config: CakeConfig, clickedFilling?: string): CakeConfig {
  if (cakeImageFor(config)) return config;
  const s = step(config);
  let pool = entries.filter(e => e.tiers === s.tiers);
  for (const k of ['dough', 'shape'] as const) { const n = pool.filter(e => e[k] === s[k]); if (n.length) pool = n; }
  if (clickedFilling) { const n = pool.filter(e => e.fillings.includes(slug(clickedFilling))); if (n.length) pool = n; }
  const score = (e: Entry) => (sameSet(e.fillings, s.fillings) ? 10 : 0) + e.fillings.filter(f => s.fillings.includes(f)).length * 2 - e.fillings.filter(f => !s.fillings.includes(f)).length + (e.frosting === s.frosting ? 3 : 0);
  const best = [...pool].sort((a, b) => score(b) - score(a))[0];
  if (!best) return config;
  return { ...toConfig(config, best), dough: dough[best.dough] ?? config.dough, shape: shape[best.shape] ?? config.shape };
}

/** Warm the browser cache so switching decorations swaps the photo instantly. */
export function preloadCakeImages(config: CakeConfig) {
  if (typeof window === 'undefined') return;
  const exact = cakeImageFor(config); if (!exact) return;
  const base = exact.replace(/-(frutas|flores|lisa)\.webp$/, '.webp');
  for (const suffix of ['', '-frutas', '-flores', '-lisa']) {
    const i = new Image(); i.decoding = 'async'; i.src = base.replace(/\.webp$/, `${suffix}.webp`);
  }
}
