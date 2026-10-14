# NEXORA TECH — protótipo futurista

## Incluído
- Landing page responsiva em preto/neon.
- Catálogo com busca, filtros por categoria e ordenação.
- Modal de detalhes de produto.
- Sacola com alteração de quantidades e total estimado.
- Formulário de checkout demonstrativo.
- Esqueleto de funções serverless para criação de pagamento e webhook.

## Testar localmente
Abra `index.html` no navegador. Catálogo, busca, detalhes e sacola funcionam sem servidor.

## Antes de publicar
Os preços, especificações e imagens atuais são ilustrativos. Confirme os dados reais dos fornecedores, substitua os símbolos por imagens autorizadas e configure contato, frete, estoque, políticas de privacidade, termos e trocas.

## Pagamentos
O checkout **não cria cobranças reais**. O provedor é citado como Pantera Pay/Pantepay, mas a API exata, autenticação, payloads e assinatura do webhook precisam ser confirmados com a documentação da sua conta. Não invente endpoints e não exponha chaves no navegador.

As funções em `api/` ficam bloqueadas até a implementação do adaptador oficial. Configure segredos apenas em variáveis de ambiente no servidor/Vercel. Em produção, o servidor deve recalcular os preços com dados confiáveis, registrar pedidos pendentes, usar idempotência, validar autenticidade do webhook e conferir valor/status no provedor antes de marcar como pago.

## Deploy na Vercel
1. Crie um repositório GitHub somente para este projeto.
2. Envie os arquivos desta pasta para a raiz do repositório.
3. Importe o repositório na Vercel.
4. Adicione as variáveis do `.env.example` no painel da Vercel, quando tiver os dados oficiais.
5. Configure domínio e teste primeiro em ambiente de teste.
