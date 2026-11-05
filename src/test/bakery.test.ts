import { describe, expect, it } from 'vitest';
import { cakePrice, cakeSizes, defaultCake, toggleFilling, supportsRoseFrosting } from '@/lib/bakery';
describe('Cake requirements',()=>{
 it('preserves the established price with frosting',()=>{expect(cakePrice({...defaultCake,size:20,dough:'Red Velvet',shape:'Coração',fillings:['Doce de Leite','Morango'],frosting:'rose'})).toBe(235);});
 it('offers photographed pink frosting for two-tier floral berry cakes',()=>{const config={...defaultCake,tiers:2 as const,fillings:['Doce de Leite','Morango'],edibleFlowers:true,redBerries:true}; expect(supportsRoseFrosting(config)).toBe(true); expect(supportsRoseFrosting({...config,tiers:1})).toBe(false); expect(supportsRoseFrosting({...config,fillings:['Brigadeiro','Morango']})).toBe(false);});
 it('limits fillings to two flavors',()=>{ expect(toggleFilling(['Brigadeiro','Morango'],'Doce de Leite')).toEqual(['Brigadeiro','Morango']); });
 it('allows deselecting a filling and choosing a replacement',()=>{expect(toggleFilling(toggleFilling(['Brigadeiro','Morango'],'Morango'),'Doce de Leite')).toEqual(['Brigadeiro','Doce de Leite']);});
 it('serves ten slices at 15cm',()=>{expect(cakeSizes.find(s=>s.size===15)?.slices).toBe(10);});
 it('serves twenty slices at 20cm',()=>{expect(cakeSizes.find(s=>s.size===20)?.slices).toBe(20);});
 it('updates price for selected and removed fillings',()=>{expect(cakePrice({...defaultCake,fillings:['Brigadeiro','Morango']})-cakePrice({...defaultCake,fillings:['Brigadeiro']})).toBe(10);});
 it('preserves pricing with illustrative tiers',()=>{expect(cakePrice({...defaultCake,size:20,dough:'Chocolate',fillings:['Creme de Baunilha'],tiers:2})).toBe(190);});
 it('preserves pricing with illustrative edible flowers',()=>{expect(cakePrice({...defaultCake,size:20,dough:'Chocolate',fillings:['Creme de Baunilha'],edibleFlowers:true})).toBe(190);});
 it('preserves pricing with independent berry decorations',()=>{expect(cakePrice({...defaultCake,size:20,dough:'Chocolate',fillings:['Creme de Baunilha'],redBerries:true,edibleFlowers:false})).toBe(190);});
});import { supportsFrosting, effectiveFrosting, catalogKey } from '@/lib/bakery';
describe('catalog frostings',()=>{
 const base={...defaultCake,shape:'Coração',tiers:2 as const,dough:'Chocolate',fillings:['Creme de Baunilha'],edibleFlowers:true,redBerries:true};
 it('offers white, chocolate and naked frosting for every combination',()=>{expect(supportsFrosting({...base,dough:'Baunilha'},'chocolate')).toBe(true);expect(supportsFrosting({...base,dough:'Baunilha'},'naked')).toBe(true);expect(effectiveFrosting({...base,frosting:'naked'})).toBe('naked');});
 it('keeps photographed frosting when decorations change',()=>{expect(catalogKey({...base,edibleFlowers:false},'chocolate')).toBe('heart-2-chocolate-0-chocolate');});
 it('keeps price unchanged by frosting',()=>{expect(cakePrice({...base,frosting:'naked'})).toBe(cakePrice({...base,frosting:'chocolate'}));});
});
