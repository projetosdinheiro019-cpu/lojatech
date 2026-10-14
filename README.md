# NEXORA TECH — loja futurista

## Incluído
- Página responsiva preto/neon, catálogo, busca, filtros, ordenação e detalhes.
- Sacola com quantidades e total visual.
- Checkout ligado às rotas serverless `/api/create-payment` e `/api/payment-status`.
- QR Code PIX/copia-e-cola quando o provedor retornar esses campos.
- Chaves exclusivamente no backend.

## Atenção: integração PanteraPay
O endpoint-base conhecido no projeto anterior é `https://panterapay-production.up.railway.app`; as rotas `/transactions` e `/transactions/:id` e os campos de resposta são pistas recuperadas do código anterior. **O formato exato de autenticação, corpo de criação e assinatura de webhook ainda precisa ser confirmado na documentação da conta.** Não coloque a loja em produção nem receba pagamentos reais antes de validar isso.

### Configuração
1. Importe o projeto para Vercel.
2. Configure as variáveis do `.env.example` no painel da Vercel.
3. `PANTERAPAY_CREATE_BODY_TEMPLATE` deve ser o JSON exato exigido pela API. Os placeholders suportados são `{amount}` (centavos), `{orderId}`, `{name}`, `{email}`, `{phone}` e `{document}`. Não use o exemplo estrutural sem confirmar o contrato oficial.
4. `NEXORA_CATALOG_JSON` deve conter os IDs e preços confiáveis dos produtos, em reais. O backend recalcula o total com esse catálogo; não confia no total do navegador.
5. Faça testes com valores pequenos no ambiente de teste, confira o retorno real e ajuste os campos da resposta se necessário.

### Limitações que continuam bloqueadas
- O webhook retorna indisponível até implementar a verificação oficial de assinatura e persistência de pedidos. Não marca pedidos como pagos com base apenas no payload recebido.
- Os preços e especificações no catálogo visual são ilustrativos. Atualize frontend e catálogo seguro para refletirem os fornecedores reais.
- A criação de cobrança pode retornar erro de resposta inesperada se o provedor usar outros nomes de campos. Consulte o painel da PanteraPay antes de repetir uma tentativa para evitar cobranças duplicadas.

## Rodar localmente
Como há funções `/api`, use Vercel CLI (`vercel dev`) ou faça deploy de preview. Abrir o HTML diretamente não executa as rotas serverless.
