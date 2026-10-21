import type { CakeConfig } from '@/lib/bakery';
import oneTier from '@/assets/custom-cake-one.png';
import twoTiers from '@/assets/custom-cake-two.png';
import flowers from '@/assets/cake-flowers.png';
import { Flower2, Layers3, Ruler } from 'lucide-react';

export function cakePreviewImage(config: CakeConfig) {
  return config.tiers === 2 ? twoTiers : oneTier;
}

export function CakePreview({ config }: { config: CakeConfig }) {
  return <div className="cake-studio" aria-label="Prévia do bolo personalizado">
    <div className="studio-heading"><span className="eyebrow">Ateliê Maison</span><span className="studio-live"><span />Sua criação</span></div>
    <div className={`cake-stage cake-size-${config.size} cake-tiers-${config.tiers ?? 1}`}>
      <div className="cake-composition">
        <img className="cake-render" src={cakePreviewImage(config)} alt={`Bolo de ${config.tiers ?? 1} andar${config.tiers === 2 ? 'es' : ''}, com corte mostrando massa de chocolate e creme de baunilha`} width={1024} height={1024}/>
        {config.edibleFlowers && <img className="cake-flower-decoration" src={flowers} alt="Decoração de flores comestíveis rosas" width={992} height={672}/>}
      </div>
      <div className="cake-measure"><span /> <p>Ø {config.size} cm</p> <span /></div>
      <div className="cake-height"><span />{config.tiers ?? 1} {config.tiers === 2 ? 'andares' : 'andar'}<span /></div>
    </div>
    <div className="studio-caption"><span className="eyebrow text-primary">Feito para celebrar</span><h2>Uma doce obra-prima.</h2><p>{config.dough} · {config.fillings.join(' + ') || 'Sem recheio selecionado'}</p></div>
    <div className="studio-specs"><span><Layers3 size={14}/>{config.tiers ?? 1} {config.tiers === 2 ? 'andares' : 'andar'}</span><span><Ruler size={14}/>{config.size} cm</span>{config.edibleFlowers && <span><Flower2 size={14}/>Flores comestíveis</span>}</div>
    <p className="studio-disclaimer">Prévia ilustrativa de chocolate e baunilha. Formato e sabores conforme sua seleção.</p>
  </div>;
}