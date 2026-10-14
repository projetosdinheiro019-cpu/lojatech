// Esqueleto de webhook. Não marcar pedidos como pagos sem verificar a
// assinatura/autenticidade conforme o mecanismo oficial do provedor.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }

  // TODO: verificar assinatura, timestamp e prevenção de replay conforme docs oficiais.
  // TODO: validar o ID do pedido, valor, moeda e status consultando o provedor.
  // TODO: atualizar pedido de forma idempotente no banco.
  // Enquanto a validação oficial não estiver implementada, não aprovar pagamentos.
  return res.status(501).json({
    received: false,
    message: "Webhook desativado até a integração e validação oficial serem configuradas."
  });
}
