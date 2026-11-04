import { cakeFrostingName, catalogConfig, supportsRoseFrosting, type CakeConfig } from '@/lib/bakery';
import { cakeImageFor } from '@/lib/cake-images';
import { Cherry, Flower2, Layers3, Ruler } from 'lucide-react';

const photography = import.meta.glob<string>('../assets/cake-photography/*.webp', { eager: true, query: '?url', import: 'default' });
const frostings = import.meta.glob<string>('../assets/cake-frosting/*.webp', { eager: true, query: '?url', import: 'default' });
const catalog = import.meta.glob<string>('../assets/cake-catalog/*.webp', { eager: true, query: '?url', import: 'default' });
const fillingOrder = ['Creme de Baunilha', 'Brigadeiro', 'Doce de Leite', 'Morango'];

export function cakeDimensions(config: CakeConfig) {
  return config.shape === 'Redondo' ? `Ø ${config.size} cm` : `${config.size} × ${config.size} cm`;
}

export const cakeCatalogImage = (key: string) => cakeImageFor(catalogConfig(key)) ?? catalog[`../assets/cake-catalog/${key}.webp`];
export function cakePreviewImage(config: CakeConfig): string {
  const photo = cakeImageFor(config);
  if (photo) return photo;
  const shape = config.shape === 'Quadrado' ? 'square' : config.shape === 'Coração' ? 'heart' : 'round';
  const dough = config.dough === 'Chocolate' ? 'chocolate' : config.dough === 'Baunilha' ? 'vanilla' : 'velvet';
  const fillings = fillingOrder.flatMap((flavor, index) => config.fillings.includes(flavor) ? [index] : []).join('-') || 'none';
  const filename = `${shape}-${config.tiers ?? 1}-${dough}-${fillings}-${config.edibleFlowers ? 1 : 0}${config.redBerries ? 1 : 0}.webp`;
  if (config.frosting === 'rose' && supportsRoseFrosting(config)) {
    const rose = frostings[`../assets/cake-frosting/${filename.replace('.webp', '-rose.webp')}`];
    if (rose) return rose;
  }
  return photography[`../assets/cake-photography/${filename}`] ?? `/cake-variants/${filename}`;
}

export function CakePreview({ config }: { config: CakeConfig }) {
  const dimensions = cakeDimensions(config);
  return <div className="cake-studio" aria-label="Prévia do bolo personalizado">
    <div className="studio-heading"><span className="eyebrow">Ateliê Maison</span><span className="studio-live"><span />Sua criação</span></div>
    <div className={`cake-stage cake-size-${config.size} cake-tiers-${config.tiers ?? 1}`}>
      <div className="cake-composition">
        <img key={cakePreviewImage(config)} className="cake-render" src={cakePreviewImage(config)} alt={`Bolo ${config.shape}, ${config.tiers ?? 1} ${config.tiers === 2 ? 'andares' : 'andar'}, massa ${config.dough}, recheio ${config.fillings.join(' e ') || 'não selecionado'}, cobertura ${cakeFrostingName(config)}${config.edibleFlowers ? ', flores' : ''}${config.redBerries ? ', frutas vermelhas' : ''}`} width={700} height={700} decoding="async"/>
      </div>
      <div className="cake-measure"><span /> <p>{dimensions}</p> <span /></div>
      <div className="cake-height"><span />{config.tiers ?? 1} {config.tiers === 2 ? 'andares' : 'andar'}<span /></div>
    </div>
    <div className="studio-caption"><span className="eyebrow text-primary">Feito para celebrar</span><h2>Uma doce obra-prima.</h2><p>{config.dough} · {config.fillings.join(' + ') || 'Sem recheio selecionado'}</p><p>Cobertura · {cakeFrostingName(config)}</p></div>
    <div className="studio-specs"><span><Layers3 size={14}/>{config.tiers ?? 1} {config.tiers === 2 ? 'andares' : 'andar'}</span><span><Ruler size={14}/>{dimensions}</span>{config.edibleFlowers && <span><Flower2 size={14}/>Flores</span>}{config.redBerries && <span><Cherry size={14}/>Frutas vermelhas</span>}</div>
  </div>;
}