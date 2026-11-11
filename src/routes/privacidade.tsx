import { createFileRoute, Link } from '@tanstack/react-router';
import { pageHead } from '@/lib/bakery';

export const Route = createFileRoute('/privacidade')({ head: () => pageHead('Política de Privacidade e Termos de Uso', 'Como a Maison Padaria trata seus dados pessoais conforme a LGPD e as regras de uso da plataforma.'), component: Privacy });

function Privacy() {
  return <main className="page-width py-10 max-w-3xl reveal space-y-5 text-sm leading-7">
    <Link to="/" className="text-xs text-muted-foreground">← Nossa vitrine</Link>
    <p className="eyebrow text-primary">LGPD</p>
    <h1 className="text-4xl">Política de Privacidade e Termos de Uso</h1>
    <p className="text-xs text-muted-foreground">Texto de exemplo — substitua pela versão revisada pelo jurídico da Maison.</p>
    <h2 className="text-2xl">1. Dados que coletamos</h2><p>Nome, e-mail, telefone, CPF ou CNPJ, endereço de entrega e as informações dos pedidos, incluindo restrições alimentares e alergias informadas por você.</p>
    <h2 className="text-2xl">2. Para que usamos</h2><p>Para criar sua conta, preparar e entregar encomendas, prestar atendimento e cumprir obrigações legais. Dados de alergia são usados apenas para preparar seu pedido com segurança.</p>
    <h2 className="text-2xl">3. Compartilhamento</h2><p>Somente com a loja que prepara o pedido e com prestadores necessários à operação. Não vendemos seus dados.</p>
    <h2 className="text-2xl">4. Seus direitos</h2><p>Você pode pedir acesso, correção, portabilidade ou exclusão dos seus dados e revogar o consentimento a qualquer momento pelo atendimento.</p>
    <h2 className="text-2xl">5. Termos de uso</h2><p>Os pedidos dependem de disponibilidade e confirmação da loja. Fotos são ilustrativas. Ao criar a conta você confirma que as informações fornecidas são verdadeiras.</p>
  </main>;
}
