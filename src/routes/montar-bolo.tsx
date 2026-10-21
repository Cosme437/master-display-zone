import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Circle, Flower2, Heart, Layers3, RotateCcw, ShoppingBag, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { CakePreview, cakePreviewImage } from '@/components/cake-preview';
import { useBakery } from '@/components/bakery-store';
import { cakePrice, cakeSizes, money, pageHead, toggleFilling, type CakeConfig } from '@/lib/bakery';
import { toast } from 'sonner';

export const Route = createFileRoute('/montar-bolo')({ head: () => pageHead('Monte seu bolo', 'Crie seu bolo Maison: escolha andares, massa, recheios e flores comestíveis em um ateliê de sabores.'), component: CakeBuilder });
const showcase: CakeConfig = { shape: 'Redondo', size: 20, dough: 'Chocolate', fillings: ['Creme de Baunilha'], note: '', tiers: 2, edibleFlowers: true };

function CakeBuilder() {
  const [config, setConfig] = useState<CakeConfig>(showcase);
  const store = useBakery();
  const set = <K extends keyof CakeConfig>(key: K, value: CakeConfig[K]) => setConfig(c => ({ ...c, [key]: value }));
  const fill = (flavor: string) => {
    if (!config.fillings.includes(flavor) && config.fillings.length === 2) toast.error('Escolha até 2 recheios. Remova um para trocar.');
    set('fillings', toggleFilling(config.fillings, flavor));
  };
  const addCake = () => {
    store.add({ id: `cake-${Date.now()}`, name: 'Bolo personalizado', description: `${config.tiers} andares · ${config.shape} · ${config.size} cm · ${config.dough} · ${config.fillings.join(' + ')}${config.edibleFlowers ? ' · Flores comestíveis' : ''}`, image: cakePreviewImage(config), price: cakePrice(config), cake: config });
    toast.success('Seu bolo foi adicionado ao carrinho!');
  };
  return <main className="cake-builder reveal">
    <div className="page-width builder-intro">
      <Link to="/" className="inline-flex items-center gap-2 text-xs text-muted-foreground"><ArrowLeft size={13}/>Nossa vitrine</Link>
      <div className="builder-title"><div><p className="eyebrow text-primary mb-2">Seu momento. Seu bolo.</p><h1>Monte seu bolo<span className="text-primary">.</span></h1><p className="text-sm text-muted-foreground mt-2">Camadas de carinho, do seu jeito.</p></div><span className="builder-step"><span>01</span> Personalize <ArrowRight size={13}/> <span>02</span> Celebre</span></div>
    </div>
    <div className="page-width builder-layout">
      <div className="builder-controls">
        <div className="flex justify-between items-center mb-7"><h2 className="text-2xl">Os detalhes fazem a diferença</h2><Button variant="ghost" size="icon" aria-label="Restaurar escolhas" title="Restaurar escolhas" onClick={() => setConfig(showcase)}><RotateCcw size={16}/></Button></div>
        <section className="builder-section"><h3><span>01</span>Andares</h3><div className="grid grid-cols-2 gap-3">{([1, 2] as const).map(tier => <Button key={tier} variant="outline" className="choice tier-choice" aria-pressed={config.tiers === tier} onClick={() => set('tiers', tier)}><Layers3 size={20}/>{tier} {tier === 1 ? 'andar' : 'andares'}{config.tiers === tier && <Check size={14}/>}</Button>)}</div></section>
        <section className="builder-section"><div className="flex justify-between items-center"><h3><span>02</span>Massa</h3><span className="text-[10px] text-muted-foreground">Red Velvet + R$ 15</span></div><div className="grid grid-cols-3 gap-2">{['Baunilha', 'Chocolate', 'Red Velvet'].map(dough => <Button key={dough} variant="outline" className="choice flavor-choice" aria-pressed={config.dough === dough} onClick={() => set('dough', dough)}><span className={`flavor-swatch swatch-${dough === 'Chocolate' ? 'chocolate' : dough === 'Baunilha' ? 'vanilla' : 'velvet'}`}/>{dough}</Button>)}</div></section>
        <section className="builder-section"><div className="flex justify-between items-center"><h3><span>03</span>Recheio</h3><span className="text-[10px] text-muted-foreground">{config.fillings.length}/2 · + R$ 10 por sabor</span></div><div className="grid grid-cols-2 gap-2">{['Creme de Baunilha', 'Brigadeiro', 'Doce de Leite', 'Morango'].map(flavor => <Button key={flavor} variant="outline" className="choice filling-choice" aria-pressed={config.fillings.includes(flavor)} onClick={() => fill(flavor)}><span>{flavor}</span><span className="selection-dot">{config.fillings.includes(flavor) && <Check size={11}/>}</span></Button>)}</div></section>
        <section className="builder-section"><div className="flex items-center justify-between"><h3><span>04</span>Tamanho</h3><span className="text-sm font-semibold text-primary">{config.size} cm <span className="font-normal text-muted-foreground text-xs">· {cakeSizes.find(s => s.size === config.size)?.slices} fatias</span></span></div><Slider aria-label="Tamanho do bolo" min={15} max={25} step={5} value={[config.size]} onValueChange={([value]) => { if (value === 15 || value === 20 || value === 25) set('size', value); }} className="my-5"/><div className="flex justify-between text-[11px] text-muted-foreground"><span>15 cm</span><span>20 cm</span><span>25 cm</span></div></section>
        <section className="builder-section"><h3><span>05</span>O toque final</h3><Button variant="outline" className="choice flower-choice w-full" aria-pressed={config.edibleFlowers} onClick={() => set('edibleFlowers', !config.edibleFlowers)}><span className="flower-icon"><Flower2 size={22}/></span><span className="text-left flex-1"><span className="block">Flores comestíveis</span><span className="block text-[10px] font-normal text-muted-foreground mt-1">Delicadas, naturais, especiais</span></span><span className="selection-dot">{config.edibleFlowers && <Check size={12}/>}</span></Button></section>
        <details className="builder-more"><summary>Formato e mensagem <ChevronDown size={14}/></summary><div className="grid grid-cols-3 gap-2 mt-4">{[{name:'Redondo',icon:Circle},{name:'Quadrado',icon:Square},{name:'Coração',icon:Heart}].map(o => <Button key={o.name} variant="outline" className="choice h-auto py-3 flex-col text-xs" aria-pressed={config.shape === o.name} onClick={() => set('shape', o.name)}><o.icon size={18}/>{o.name}{o.name === 'Coração' && <span className="text-[9px]">+ R$ 20</span>}</Button>)}</div><label htmlFor="cake-note" className="block text-xs mt-4 mb-2">Mensagem ou observação</label><textarea id="cake-note" className="form-field min-h-20" maxLength={300} value={config.note} onChange={e => set('note', e.target.value)} placeholder="Uma mensagem para um dia especial…"/></details>
        <div className="builder-checkout"><div className="flex justify-between items-center"><div><p className="text-xs text-muted-foreground">Seu bolo personalizado</p><p className="text-[10px] text-muted-foreground mt-1">Feito sob encomenda</p></div><span className="text-2xl font-semibold text-primary" aria-live="polite">{money(cakePrice(config))}</span></div><Button variant="bakery" className="w-full h-12 mt-4" disabled={!config.fillings.length} onClick={addCake}><ShoppingBag size={17}/>Adicionar ao carrinho<ArrowRight size={16}/></Button><p className="text-[10px] text-muted-foreground text-center mt-3">{config.fillings.length ? 'Andares e flores ilustrativos, sem acréscimo nesta demonstração.' : 'Escolha pelo menos um recheio para continuar.'}</p></div>
      </div>
      <aside className="builder-preview"><CakePreview config={config}/></aside>
    </div>
  </main>;
}
