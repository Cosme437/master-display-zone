import { cakeFrostingName, catalogConfig, type CakeConfig } from '@/lib/bakery';
import { exactCakeImage, preloadCakeImages } from '@/lib/cake-images';
import { useEffect } from 'react';
import { Cherry, Flower2, Layers3, Ruler } from 'lucide-react';


export function cakeDimensions(config: CakeConfig) {
  return config.shape === 'Redondo' ? `Ø ${config.size} cm` : `${config.size} × ${config.size} cm`;
}

export const cakeCatalogImage = (key: string) => exactCakeImage(catalogConfig(key)).url;
export const cakePreviewImage = (config: CakeConfig): string => exactCakeImage(config).url;

export function CakePreview({ config }: { config: CakeConfig }) {
  const selectedImage = cakePreviewImage(config);
  useEffect(() => { preloadCakeImages(config); }, [selectedImage]);
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
    <p className="text-[11px] text-muted-foreground text-center">{exactCakeImage(config).exact ? 'Imagem ilustrativa' : 'Ainda não temos foto desta combinação'}</p>
    <div className="studio-caption"><span className="eyebrow text-primary">Feito para celebrar</span><h2>Uma doce obra-prima.</h2><p>{config.dough} · {config.fillings.join(' + ') || 'Sem recheio selecionado'}</p><p>Cobertura · {cakeFrostingName(config)}</p></div>
    <div className="studio-specs"><span><Layers3 size={14}/>{config.tiers ?? 1} {config.tiers === 2 ? 'andares' : 'andar'}</span><span><Ruler size={14}/>{dimensions}</span>{config.edibleFlowers && <span><Flower2 size={14}/>Flores</span>}{config.redBerries && <span><Cherry size={14}/>Frutas vermelhas</span>}</div>
  </div>;
}