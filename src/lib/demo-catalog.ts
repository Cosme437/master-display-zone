import {z} from 'zod';
import type {CartItem} from './bakery';
import {campaignSchema,emptyCatalog,productAvailability,type CatalogSettings} from './store-catalog';
import type {DemoAccount} from './demo-accounts';
export type DemoProductSetting={productId:string;branchId:string;price:number;hidden:boolean;stock_status:'DISPONIVEL'|'ESGOTADO'|'EM_PRODUCAO';campaign_id:string|null};
export type DemoCatalog={products:DemoProductSetting[];campaigns:CatalogSettings['campaigns']};
export const emptyDemoCatalog:DemoCatalog={products:[],campaigns:[]};
export const demoProductSchema=z.object({productId:z.string().min(1),branchId:z.enum(['jardins','pinheiros','moema']),price:z.number().finite().positive().max(1000000).refine(n=>Math.abs(n*100-Math.round(n*100))<0.000001,'Use no máximo duas casas decimais.'),hidden:z.boolean(),stock_status:z.enum(['DISPONIVEL','ESGOTADO','EM_PRODUCAO']),campaign_id:z.string().nullable()});
export function saveDemoProduct(account:DemoAccount|null,catalog:DemoCatalog,input:DemoProductSetting):DemoCatalog {
 if(account?.role!=='admin')throw new Error('Somente o administrador de teste pode alterar o catálogo.');
 const row=demoProductSchema.parse(input);
 if(row.campaign_id&&!catalog.campaigns.some(c=>c.id===row.campaign_id))throw new Error('Escolha uma campanha existente.');
 return {...catalog,products:[...catalog.products.filter(p=>p.productId!==row.productId||p.branchId!==row.branchId),row]};
}
export function saveDemoCampaign(account:DemoAccount|null,catalog:DemoCatalog,input:CatalogSettings['campaigns'][number]):DemoCatalog {
 if(account?.role!=='admin')throw new Error('Somente o administrador de teste pode alterar campanhas.');
 const row=campaignSchema.parse(input);if(!row.id)throw new Error('Campanha sem identificação.');
 return {...catalog,campaigns:[...catalog.campaigns.filter(c=>c.id!==row.id),{...row,id:row.id}]};
}
export function demoSettings(catalog:DemoCatalog):CatalogSettings {return {campaigns:catalog.campaigns,settings:catalog.products.map(p=>({product_id:p.productId,branch_id:p.branchId,stock_status:p.stock_status,campaign_id:p.campaign_id}))};}
export function demoAvailability(id:string,branch:string,catalog:DemoCatalog,day:string){const result=productAvailability(id,branch,demoSettings(catalog),day);const hidden=catalog.products.find(p=>p.productId===id&&p.branchId===branch)?.hidden??false;return {...result,visible:result.visible&&!hidden,available:result.available&&!hidden};}
export function demoPrice(id:string,branch:string,catalog:DemoCatalog,base:number){return catalog.products.find(p=>p.productId===id&&p.branchId===branch)?.price??base;}
export function priceDemoCart(items:CartItem[],branch:string,catalog:DemoCatalog):CartItem[]{return items.map(i=>i.cake?i:{...i,price:demoPrice(i.productId??i.id,branch,catalog,i.price)});}
export function demoCartBlocker(items:CartItem[],branch:string,catalog:DemoCatalog,day:string){if(items.some(i=>!i.cake&&!demoAvailability(i.productId??i.id,branch,catalog,day).available))return 'Há itens indisponíveis na sua loja. Remova-os para continuar.';if(items.some(i=>i.requiresPreparation&&!i.preparation))return 'Escolha o preparo de cada combo antes de finalizar.';return null;}