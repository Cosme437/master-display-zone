import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Cherry, ChevronDown, Circle, Flower2, Heart, Layers3, RotateCcw, ShoppingBag, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { CakePreview, cakePreviewImage, cakeCatalogImage, cakeDimensions } from '@/components/cake-preview';
import { useBakery } from '@/components/bakery-store';
import { cakePrice, cakeSizes, cakeFrostings, cakeFrostingName, supportsRoseFrosting, supportsFrosting, effectiveFrosting, money, pageHead, catalogCakes, catalogConfig, toggleFilling, type CakeConfig } from '@/lib/bakery';
import { toast } from 'sonner';

export const Route = createFileRoute('/montar-bolo')({ head: () => pageHead('Monte seu bolo', 'Crie seu bolo Maison: escolha formato, andares, massa, recheios, cobertura, flores e frutas em um ateliê de sabores.'), component: CakeBuilder });
const showcase: CakeConfig = { shape: 'Coração', size: 20, dough: 'Red Velvet', fillings: ['Doce de Leite', 'Morango'], note: '', tiers: 2, edibleFlowers: true, redBerries: true, frosting: 'ivory' };

function CakeBuilder() {
  const [config, setConfig] = useState<CakeConfig>(showcase);
  const store = useBakery();
  const set = <K extends keyof CakeConfig>(key: K, value: CakeConfig[K]) => setConfig(c => {
    const next = { ...c, [key]: value };
    return next.frosting && !supportsFrosting(next, next.frosting) ? { ...next, frosting: 'ivory' } : next;
  });
  const fill = (flavor: string) => {
    if (!config.fillings.includes(flavor) && config.fillings.length === 2) toast.error('Escolha até 2 recheios. Remova um para trocar.');
    set('fillings', toggleFilling(config.fillings, flavor));
  };
  const addCake = () => {
    store.add({ id: `cake-${Date.now()}`, name: 'Bolo personalizado', description: `${config.tiers} ${config.tiers === 2 ? 'andares' : 'andar'} · ${config.shape} · ${cakeDimensions(config)} · ${config.dough} · ${config.fillings.join(' + ')} · Cobertura ${cakeFrostingName(config)}${config.edibleFlowers ? ' · Flores' : ''}${config.redBerries ? ' · Frutas vermelhas' : ''}`, image: cakePreviewImage(config), price: cakePrice(config), cake: config });
    toast.success('Seu bolo foi adicionado ao carrinho!');
  };
  return <main className="cake-builder reveal">
    <div className="page-width builder-intro">
      <Link to="/" className="inline-flex items-center gap-2 text-xs text-muted-foreground"><ArrowLeft size={13}/>Nossa vitrine</Link>
      <div className="builder-title"><div><p className="eyebrow text-primary mb-2">Seu momento. Seu bolo.</p><h1>Monte seu bolo<span className="text-primary">.</span></h1><p className="text-sm text-muted-foreground mt-2">Camadas de carinho, do seu jeito.</p></div><span className="builder-step"><span>01</span> Personalize <ArrowRight size={13}/> <span>02</span> Celebre</span></div>
    </div>
    <div className="page-width builder-layout">
      <div className="builder-controls">
        <div className="builder-controls-heading"><h2>Os detalhes fazem a diferença</h2><Button variant="ghost" size="icon" aria-label="Restaurar escolhas" title="Restaurar escolhas" onClick={() => setConfig(showcase)}><RotateCcw size={16}/></Button></div>
        <section className="builder-section"><h3><span>01</span>Andares</h3><div className="grid grid-cols-2 gap-3">{([1, 2] as const).map(tier => <Button key={tier} variant="outline" className="choice tier-choice" aria-pressed={config.tiers === tier} onClick={() => set('tiers', tier)}><Layers3 size={20}/>{tier} {tier === 1 ? 'andar' : 'andares'}{config.tiers === tier && <Check size={14}/>}</Button>)}</div></section>
        <section className="builder-section"><div className="flex justify-between items-center"><h3><span>02</span>Massa</h3><span className="text-[10px] text-muted-foreground">Red Velvet + R$ 15</span></div><div className="grid grid-cols-3 gap-2">{['Baunilha', 'Chocolate', 'Red Velvet'].map(dough => <Button key={dough} variant="outline" className="choice flavor-choice" aria-pressed={config.dough === dough} onClick={() => set('dough', dough)}><span className={`flavor-swatch swatch-${dough === 'Chocolate' ? 'chocolate' : dough === 'Baunilha' ? 'vanilla' : 'velvet'}`}/>{dough}</Button>)}</div></section>
        <section className="builder-section"><div className="flex justify-between items-center"><h3><span>03</span>Recheio</h3><span className="text-[10px] text-muted-foreground">{config.fillings.length}/2 · + R$ 10 por sabor</span></div><div className="grid grid-cols-2 gap-2">{['Creme de Baunilha', 'Brigadeiro', 'Doce de Leite', 'Morango'].map(flavor => <Button key={flavor} variant="outline" className="choice filling-choice" aria-pressed={config.fillings.includes(flavor)} onClick={() => fill(flavor)}><span>{flavor}</span><span className="selection-dot">{config.fillings.includes(flavor) && <Check size={11}/>}</span></Button>)}</div></section>
        <section className="builder-section"><h3><span>04</span>Formato</h3><div className="grid grid-cols-3 gap-2">{[{name:'Redondo',icon:Circle},{name:'Quadrado',icon:Square},{name:'Coração',icon:Heart}].map(o => <Button key={o.name} variant="outline" className="choice h-auto py-3 flex-col text-xs" aria-pressed={config.shape === o.name} onClick={() => set('shape', o.name)}><o.icon size={18}/>{o.name}{o.name === 'Coração' && <span className="text-[9px]">+ R$ 20</span>}</Button>)}</div></section>
        <section className="builder-section"><h3><span>05</span>Cobertura</h3><div className="grid grid-cols-2 gap-2">{cakeFrostings.map(option => <Button key={option.id} variant="outline" className="choice frosting-choice" aria-pressed={effectiveFrosting(config) === option.id} disabled={!supportsFrosting(config, option.id)} title={!supportsFrosting(config, option.id) ? 'Ainda não fotografada para esta combinação.' : option.name} onClick={() => set('frosting', option.id)}><span className={`flavor-swatch ${option.swatch}`}/><span>{option.name}</span>{effectiveFrosting(config) === option.id && <Check size={13}/>}</Button>)}</div></section>
        <section className="builder-section"><div className="size-heading"><h3><span>06</span>Tamanho</h3><span className="text-xs font-semibold text-primary">{cakeDimensions(config)} <span className="font-normal text-muted-foreground">· {cakeSizes.find(s => s.size === config.size)?.slices} fatias</span></span></div><Slider aria-label="Tamanho do bolo" min={15} max={25} step={5} value={[config.size]} onValueChange={([value]) => { if (value === 15 || value === 20 || value === 25) set('size', value); }} className="my-4"/><div className="flex justify-between text-[11px] text-muted-foreground"><span>15 cm</span><span>20 cm</span><span>25 cm</span></div></section>
        <section className="builder-section"><h3><span>07</span>Decoração</h3><div className="grid grid-cols-2 gap-2">{([{key:'edibleFlowers',name:'Flores',icon:Flower2},{key:'redBerries',name:'Frutas Vermelhas',icon:Cherry}] as const).map(o => <Button key={o.key} variant="outline" className="choice decoration-choice" aria-pressed={Boolean(config[o.key])} onClick={() => set(o.key, !config[o.key])}><o.icon size={17}/><span>{o.name}</span><span className="selection-dot">{config[o.key] && <Check size={11}/>}</span></Button>)}</div></section>
        <details className="builder-more"><summary>Uma mensagem especial <ChevronDown size={14}/></summary><label htmlFor="cake-note" className="block text-xs mt-4 mb-2">Mensagem ou observação</label><textarea id="cake-note" className="form-field min-h-20" maxLength={300} value={config.note} onChange={e => set('note', e.target.value)} placeholder="Uma mensagem para um dia especial…"/></details>
        <div className="builder-checkout"><div className="flex justify-between items-center"><div><p className="text-xs text-muted-foreground">Seu bolo personalizado</p><p className="text-[10px] text-muted-foreground mt-1">Feito sob encomenda</p></div><span className="text-2xl font-semibold text-primary" aria-live="polite">{money(cakePrice(config))}</span></div><Button variant="bakery" className="w-full h-12 mt-4" disabled={!config.fillings.length} onClick={addCake}><ShoppingBag size={17}/>Adicionar ao carrinho<ArrowRight size={16}/></Button>{!config.fillings.length && <p className="text-[10px] text-muted-foreground text-center mt-3">Escolha pelo menos um recheio para continuar.</p>}</div>
      </div>
      <aside className="builder-preview"><CakePreview config={config}/></aside>
    </div>
    <section className="page-width mt-12 mb-16" aria-labelledby="catalogo-bolos"><h2 id="catalogo-bolos" className="text-2xl font-semibold mb-1">Nosso catálogo de bolos</h2><p className="text-sm text-muted-foreground mb-6">Toque em um bolo para montá-lo acima.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">{catalogCakes.map(key => { const c = catalogConfig(key); return <button key={key} type="button" className="rounded-2xl border border-border bg-card p-3 text-left transition hover:border-primary" onClick={() => { setConfig(c); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><img src={cakeCatalogImage(key)} alt={`Bolo ${c.shape}, ${c.dough}, ${c.fillings.join(' e ')}`} loading="lazy" className="w-full aspect-square object-contain"/><span className="block text-xs font-medium mt-2">{c.tiers} {c.tiers===2?'andares':'andar'} · {c.shape}</span><span className="block text-[11px] text-muted-foreground">{c.dough} · {c.fillings.join(' + ')} · {cakeFrostings.find(f=>f.id===c.frosting)?.name}</span></button>; })}</div>
    </section>
  </main>;
}
