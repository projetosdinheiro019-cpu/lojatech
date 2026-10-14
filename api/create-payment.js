// Vercel Serverless Function — ponto de partida para o checkout.
// NÃO cria cobranças até que o contrato oficial da API Pantera Pay/Pantepay
// seja confirmado. Nunca envie a chave secreta para o navegador.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Configure uma origem específica em produção, por exemplo NEXORA_ORIGIN.
  const origin = req.headers.origin;
  if (process.env.NEXORA_ORIGIN && origin && origin !== process.env.NEXORA_ORIGIN) {
    return res.status(403).json({ error: "Origin not allowed" });
  }

  // Integração bloqueada de propósito até confirmar documentação e credenciais.
  // Próximas etapas:
  // 1. Validar os campos do cliente e limitar tamanho/frequência da requisição.
  // 2. Recalcular preços e total usando um catálogo confiável no servidor.
  // 3. Criar pedido pendente no banco com idempotency key.
  // 4. Chamar o endpoint oficial com process.env.PANTERAPAY_API_KEY.
  // 5. Devolver apenas os dados públicos de pagamento.
  // 6. Confirmar o pagamento no webhook, nunca pelo retorno do navegador.
  if (!process.env.PANTERAPAY_API_BASE || !process.env.PANTERAPAY_API_KEY) {
    return res.status(503).json({
      error: "Payment provider is not configured",
      message: "O checkout está em modo de demonstração. Nenhuma cobrança foi criada."
    });
  }

  return res.status(501).json({
    error: "Provider adapter not implemented",
    message: "Configure o adaptador com a documentação oficial da sua conta antes de ativar pagamentos."
  });
}
