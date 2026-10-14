// Webhook intentionally does not mark orders as paid until the provider's
// official signature-verification method and persistent order store are configured.
export default async function handler(req,res){
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).end();}
 if(!process.env.PANTERAPAY_WEBHOOK_SECRET||!process.env.PANTERAPAY_WEBHOOK_SIGNATURE_HEADER){return res.status(503).json({received:false,error:'Validação oficial do webhook ainda não configurada.'});}
 // Do not trust event payload alone. Implement the exact signature algorithm from provider docs.
 return res.status(501).json({received:false,error:'O algoritmo de assinatura da conta precisa ser configurado antes de processar eventos.'});
}
