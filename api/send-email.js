// Vercel Serverless Function — roda no SERVIDOR da Vercel
// A chave Resend fica aqui, nunca chega ao browser do usuário

export default async function handler(req, res) {
  // Só aceita POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const leadsData = req.body;

  if (!leadsData) {
    return res.status(400).json({ error: 'Nenhum dado recebido' });
  }

  // Esta variável existe APENAS no servidor da Vercel
  // Configure em: vercel.com → Projeto → Settings → Environment Variables
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.RESEND_EMAIL_TO || 'bfagencia1@gmail.com';
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  if (!apiKey) {
    console.error('RESEND_API_KEY não configurada nas variáveis de ambiente da Vercel');
    return res.status(500).json({ error: 'Configuração de email ausente no servidor' });
  }

  const emailBody = `
    <h2 style="color:#111;">Novo Lead Capturado — BF Agência</h2>
    <table style="border-collapse:collapse;width:100%;font-family:sans-serif;">
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Nome/Cargo</td><td style="padding:8px;border:1px solid #ddd;">${leadsData.nome_cargo || 'N/A'}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Empresa/Site</td><td style="padding:8px;border:1px solid #ddd;">${leadsData.empresa_site || 'N/A'}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Segmento</td><td style="padding:8px;border:1px solid #ddd;">${leadsData.segmento_atuacao || 'N/A'}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Faturamento</td><td style="padding:8px;border:1px solid #ddd;">${leadsData.faturamento_mensal || 'N/A'}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Status Investimento</td><td style="padding:8px;border:1px solid #ddd;">${leadsData.investimento_status || 'N/A'}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Valor Investimento</td><td style="padding:8px;border:1px solid #ddd;">${leadsData.investimento_valor_mensal || 'N/A'}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Objetivo</td><td style="padding:8px;border:1px solid #ddd;">${leadsData.objetivo_principal || 'N/A'}</td></tr>
    </table>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: toEmail,
        subject: `Novo Lead: ${leadsData.nome_cargo || '?'} — ${leadsData.empresa_site || '?'}`,
        html: emailBody,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro Resend:', error);
      return res.status(500).json({ error: error.message });
    }

    const result = await response.json();
    return res.status(200).json({ success: true, id: result.id });

  } catch (error) {
    console.error('Erro na function:', error);
    return res.status(500).json({ error: error.message });
  }
}
