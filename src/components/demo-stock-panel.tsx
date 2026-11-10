import {useState} from 'react';
import {toast} from 'sonner';
import {useBakery} from './bakery-store';
import {branches,products} from '@/lib/bakery';
import {stockStatuses} from '@/lib/store-catalog';
import type {DemoProductSetting} from '@/lib/demo-catalog';
/** Employee view: stock status for the employee's own branch only. */
export function DemoStockPanel(){
 const store=useBakery();const [search,setSearch]=useState('');const account=store.demoAccount;
 if(account?.role!=='employee')return null;
 const branch=branches.find(b=>b.id===account.branchId);
 return <section className="mt-10 border-t pt-8"><div className="flex flex-wrap justify-between gap-4 items-end"><div><h2 className="text-3xl">Estoque da loja</h2><p className="text-sm text-muted-foreground mt-1">Maison {branch?.name}</p></div><label className="text-xs">Buscar item<input className="form-field mt-1" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Nome do produto"/></label></div>
 <div className="divide-y mt-6">{products.filter(p=>p.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())).map(p=>{const row=store.demoCatalog.products.find(r=>r.productId===p.id&&r.branchId===account.branchId);return <div key={p.id} className="py-3 flex items-center gap-3"><img src={p.image} alt={p.name} width={48} height={48} loading="lazy" className="size-12 object-cover rounded-md"/><div className="flex-1"><h3 className="font-sans text-sm font-semibold">{p.name}</h3><p className="text-xs text-muted-foreground">{p.category}</p></div><select aria-label={`Estoque de ${p.name}`} className="form-field w-44" value={row?.stock_status??'DISPONIVEL'} onChange={e=>{try{store.saveDemoStock(p.id,account.branchId,e.target.value as DemoProductSetting['stock_status']);toast.success(`${p.name}: estoque atualizado.`);}catch(err){toast.error(err instanceof Error?err.message:'Não foi possível salvar.');}}}>{Object.entries(stockStatuses).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></div>;})}</div></section>;
}
