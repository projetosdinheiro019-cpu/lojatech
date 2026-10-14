const json=(res,code,body)=>res.status(code).setHeader('Content-Type','application/json').json(body);
export default async function handler(req,res){
 if(req.method!=='GET'){res.setHeader('Allow','GET');return json(res,405,{error:'Método não permitido.'});}
 if(!process.env.PANTERAPAY_API_BASE||!process.env.PANTERAPAY_API_KEY)return json(res,503,{error:'Consulta de pagamento não configurada.'});
 const id=String(req.query?.id||'').trim();if(!id||id.length>180)return json(res,400,{error:'ID da transação inválido.'});
 const mode=(process.env.PANTERAPAY_AUTH_MODE||'Bearer').toLowerCase();const headers={Accept:'application/json'};if(mode==='x-api-key')headers['x-api-key']=process.env.PANTERAPAY_API_KEY;else headers.Authorization=mode==='raw'?process.env.PANTERAPAY_API_KEY:`Bearer ${process.env.PANTERAPAY_API_KEY}`;
 try{const base=process.env.PANTERAPAY_API_BASE.replace(/\/$/,'');const r=await fetch(`${base}/transactions/${encodeURIComponent(id)}`,{headers,signal:AbortSignal.timeout(10000)});const d=await r.json().catch(()=>({}));if(!r.ok)return json(res,502,{error:'Não foi possível consultar o status no provedor.'});return json(res,200,{id:d.id||d.transaction?.id||id,status:d.status||d.transaction?.status||'pending',orderId:d.orderId||d.externalId||null});}catch{return json(res,502,{error:'Falha ao consultar o pagamento.'});}
}
