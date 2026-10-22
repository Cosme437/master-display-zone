import type { CakeConfig } from '@/lib/bakery';
import oneTier from '@/assets/custom-cake-one.png';
import twoTiers from '@/assets/custom-cake-two.png';
import flowers from '@/assets/cake-flowers.png';
import squareOne from '@/assets/square-velvet-one.png';
import squareTwo from '@/assets/square-velvet-two.png';
import squareOneDecorated from '@/assets/square-velvet-one-decorated.png';
import squareTwoDecorated from '@/assets/square-velvet-two-decorated.png';
import { Flower2, Layers3, Ruler } from 'lucide-react';

export function cakePreviewImage(config: CakeConfig) {
  if (config.shape === 'Quadrado') {
    return config.tiers === 2
      ? (config.edibleFlowers ? squareTwoDecorated : squareTwo)
      : (config.edibleFlowers ? squareOneDecorated : squareOne);
  }
  return config.tiers === 2 ? twoTiers : oneTier;
}

export function CakePreview({ config }: { config: CakeConfig }) {
  const square = config.shape === 'Quadrado';
  const dimensions = square ? `${config.size} × ${config.size} cm` : `Ø ${config.size} cm`;
  return <div className="cake-studio" aria-label="Prévia do bolo personalizado">
    <div className="studio-heading"><span className="eyebrow">Ateliê Maison</span><span className="studio-live"><span />Sua criação</span></div>
    <div className={`cake-stage cake-size-${config.size} cake-tiers-${config.tiers ?? 1}`}>
      <div className="cake-composition">
        <img key={cakePreviewImage(config)} className="cake-render" src={cakePreviewImage(config)} alt={`Bolo ${square ? 'quadrado Red Velvet com cobertura branca, doce de leite e morango' : 'redondo de chocolate com creme de baunilha'}, ${config.tiers ?? 1} andar${config.tiers === 2 ? 'es' : ''}${square && config.edibleFlowers ? ', decorado com rosas, lisianthus, morangos, mirtilos e pérolas de açúcar' : ''}`} width={1024} height={1024}/>
        {!square && config.edibleFlowers && <img className="cake-flower-decoration" src={flowers} alt="Decoração de flores comestíveis rosas" width={992} height={672}/>}
      </div>
      <div className="cake-measure"><span /> <p>{dimensions}</p> <span /></div>
      <div className="cake-height"><span />{config.tiers ?? 1} {config.tiers === 2 ? 'andares' : 'andar'}<span /></div>
    </div>
    <div className="studio-caption"><span className="eyebrow text-primary">Feito para celebrar</span><h2>Uma doce obra-prima.</h2><p>{config.dough} · {config.fillings.join(' + ') || 'Sem recheio selecionado'}</p></div>
    <div className="studio-specs"><span><Layers3 size={14}/>{config.tiers ?? 1} {config.tiers === 2 ? 'andares' : 'andar'}</span><span><Ruler size={14}/>{dimensions}</span>{config.edibleFlowers && <span><Flower2 size={14}/>Flores e frutas</span>}</div>
    <p className="studio-disclaimer">{square ? 'Inspiração de Red Velvet, doce de leite e morango.' : 'Inspiração de chocolate e baunilha.'} Outros sabores e o formato coração são ilustrativos.</p>
  </div>;
}