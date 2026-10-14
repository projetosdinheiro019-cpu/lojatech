// Vercel Serverless Function — PanteraPay adapter with explicit contract config.
// The provider's exact request schema must be set in PANTERAPAY_CREATE_BODY_TEMPLATE.
const json = (res, code, body) => res.status(code).setHeader('Content-Type','application/json').json(body);
function safeEqual(a,b){ if(typeof a!=='string'||typeof b!=='string'||a.length!==b.length)return false; let x=0; for(let i=0;i<a.length;i++)x|=a.charCodeAt(i)^b.charCodeAt(i); return x===0; }
export default async function handler(req,res){
  if(req.method!=='POST'){res.setHeader('Allow','POST');return json(res,405,{error:'Método não permitido.'});}
  const origin=req.headers.origin;
  if(process.env.NEXORA_ORIGIN && origin && !safeEqual(origin,process.env.NEXORA_ORIGIN)) return json(res,403,{error:'Origem não autorizada.'});
  if(!process.env.PANTERAPAY_API_BASE||!process.env.PANTERAPAY_API_KEY||!process.env.PANTERAPAY_CREATE_BODY_TEMPLATE){
    return json(res,503,{error:'Pagamento ainda não configurado.',message:'Configure as variáveis da PanteraPay no servidor. Nenhuma cobrança foi criada.'});
  }
  const body=req.body||{};
  if(!Array.isArray(body.items)||!body.items.length||!body.customer||!body.customer.name||!body.customer.email) return json(res,400,{error:'Informe os produtos e os dados obrigatórios do comprador.'});
  // Never trust a total sent by the browser. Server-side product catalog must be configured before live sales.
  // Until then, reject rather than charging an amount supplied by the client.
  if(!process.env.NEXORA_CATALOG_JSON) return json(res,503,{error:'Catálogo seguro não configurado.',message:'Defina o catálogo de preços no servidor antes de aceitar pagamentos.'});
  let catalog; try{catalog=JSON.parse(process.env.NEXORA_CATALOG_JSON)}catch{return json(res,500,{error:'Catálogo de preços inválido no servidor.'})}
  let totalCents=0;
  for(const item of body.items){const p=catalog[item.id];const q=Number(item.quantity);if(!p||!Number.isInteger(q)||q<1||q>20)return json(res,400,{error:'Produto ou quantidade inválida.'});totalCents+=Math.round(Number(p.price)*100)*q;}
  if(!Number.isSafeInteger(totalCents)||totalCents<100)return json(res,400,{error:'Valor do pedido inválido.'});
  let template;try{template=JSON.parse(process.env.PANTERAPAY_CREATE_BODY_TEMPLATE)}catch{return json(res,500,{error:'Template de cobrança inválido.'})}
  const replacements={amount:totalCents,orderId:`NX-${Date.now().toString(36).toUpperCase()}`,name:String(body.customer.name).slice(0,120),email:String(body.customer.email).slice(0,180),phone:String(body.customer.phone||'').slice(0,30),document:String(body.customer.document||'').replace(/\D/g,'').slice(0,14)};
  const replace=(v)=>{if(typeof v==='string')return v.replace(/\{(amount|orderId|name|email|phone|document)\}/g,(_,k)=>String(replacements[k]));if(Array.isArray(v))return v.map(replace);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,val])=>[k,replace(val)]));return v};
  const authMode=(process.env.PANTERAPAY_AUTH_MODE||'Bearer').toLowerCase();
  const authValue=authMode==='raw'?process.env.PANTERAPAY_API_KEY:authMode==='x-api-key'?null:`Bearer ${process.env.PANTERAPAY_API_KEY}`;
  const headers={'Content-Type':'application/json','Accept':'application/json'};
  if(authMode==='x-api-key')headers['x-api-key']=process.env.PANTERAPAY_API_KEY;else headers.Authorization=authValue;
  try{
    const base=process.env.PANTERAPAY_API_BASE.replace(/\/$/,'');
    const response=await fetch(`${base}/transactions`,{method:'POST',headers,body:JSON.stringify(replace(template)),signal:AbortSignal.timeout(12000)});
    const data=await response.json().catch(()=>({}));
    if(!response.ok){console.error('PanteraPay create transaction failed:',response.status);return json(res,502,{error:'O provedor não aceitou a cobrança. Verifique o contrato da API e os logs do servidor.'});}
    const id=data.id||data.transactionId||data.transaction?.id;
    const copyPaste=data.copyPaste||data.pix?.copyPaste||data.qrCodeText||data.copy_paste;
    let qrCodeBase64=data.qrCodeBase64||data.pix?.qrCodeBase64||data.qr_code_base64;
    if(qrCodeBase64&&!String(qrCodeBase64).startsWith('data:'))qrCodeBase64=`data:image/png;base64,${qrCodeBase64}`;
    if(!id||(!copyPaste&&!qrCodeBase64))return json(res,502,{error:'Resposta inesperada da PanteraPay. A cobrança pode ter sido criada; confira o painel antes de tentar novamente.'});
    return json(res,200,{id,status:data.status||'pending',amount:totalCents,copyPaste:copyPaste||'',qrCodeBase64:qrCodeBase64||'',expiresAt:data.expiresAt||data.expires_at||null,orderId:replacements.orderId});
  }catch(err){console.error('PanteraPay request failed:',err.name);return json(res,502,{error:'Não foi possível conectar ao provedor de pagamento.'});}
}
