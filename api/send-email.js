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
    <div style="background-color: #000000; padding: 40px 20px; font-family: sans-serif; color: #ffffff;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #111111; border: 1px solid #333; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #f5c317; padding: 25px; text-align: center;">
          <h1 style="margin: 0; color: #000; font-size: 20px; text-transform: uppercase; letter-spacing: 2px; font-weight: 900;">Novo Lead Capturado</h1>
        </div>
        <div style="padding: 35px 25px;">
          <p style="color: #a3a3a3; font-size: 15px; margin-bottom: 25px; text-align: center;">Um novo lead acaba de completar o formulário da <strong>BF Agência</strong>.</p>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 15px 0; border-bottom: 1px solid #222;">
                <span style="color: #f5c317; font-size: 11px; font-weight: bold; text-transform: uppercase; display: block; margin-bottom: 4px;">Nome e Cargo</span>
                <span style="color: #fff; font-size: 17px; font-weight: 500;">${leadsData.nome_cargo || 'N/A'}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 15px 0; border-bottom: 1px solid #222;">
                <span style="color: #f5c317; font-size: 11px; font-weight: bold; text-transform: uppercase; display: block; margin-bottom: 4px;">Empresa</span>
                <span style="color: #fff; font-size: 17px; font-weight: 500;">${leadsData.nome_empresa || 'N/A'}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 15px 0; border-bottom: 1px solid #222;">
                <span style="color: #f5c317; font-size: 11px; font-weight: bold; text-transform: uppercase; display: block; margin-bottom: 4px;">Site / Rede Social</span>
                <span style="color: #fff; font-size: 17px; font-weight: 500;">${leadsData.site_rede_social || 'N/A'}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 15px 0; border-bottom: 1px solid #222;">
                <span style="color: #f5c317; font-size: 11px; font-weight: bold; text-transform: uppercase; display: block; margin-bottom: 4px;">E-mail / Telefone</span>
                <span style="color: #fff; font-size: 17px; font-weight: 500;">${leadsData.email_telefone || 'N/A'}</span>
              </td>
            </tr>
          </table>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 15px 0; border-bottom: 1px solid #222; width: 50%;">
                <span style="color: #f5c317; font-size: 11px; font-weight: bold; text-transform: uppercase; display: block; margin-bottom: 4px;">Segmento</span>
                <span style="color: #fff; font-size: 15px;">${leadsData.segmento_atuacao || 'N/A'}</span>
              </td>
              <td style="padding: 15px 0; border-bottom: 1px solid #222; width: 50%;">
                <span style="color: #f5c317; font-size: 11px; font-weight: bold; text-transform: uppercase; display: block; margin-bottom: 4px;">Faturamento</span>
                <span style="color: #fff; font-size: 15px;">${leadsData.faturamento_mensal || 'N/A'}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 15px 0; border-bottom: 1px solid #222; width: 50%;">
                <span style="color: #f5c317; font-size: 11px; font-weight: bold; text-transform: uppercase; display: block; margin-bottom: 4px;">Status Inv.</span>
                <span style="color: #fff; font-size: 15px;">${leadsData.investimento_status || 'N/A'}</span>
              </td>
              <td style="padding: 15px 0; border-bottom: 1px solid #222; width: 50%;">
                <span style="color: #f5c317; font-size: 11px; font-weight: bold; text-transform: uppercase; display: block; margin-bottom: 4px;">Valor Inv.</span>
                <span style="color: #fff; font-size: 15px;">${leadsData.investimento_valor_mensal || 'N/A'}</span>
              </td>
            </tr>
          </table>

          <div style="padding: 20px 0; border-bottom: 1px solid #222;">
            <span style="color: #f5c317; font-size: 11px; font-weight: bold; text-transform: uppercase; display: block; margin-bottom: 4px;">Objetivo Principal</span>
            <span style="color: #fff; font-size: 15px; font-style: italic;">"${leadsData.objetivo_principal || 'N/A'}"</span>
          </div>

          <div style="padding: 20px 0;">
            <span style="color: #f5c317; font-size: 11px; font-weight: bold; text-transform: uppercase; display: block; margin-bottom: 4px;">Quer investir nos próximos 6 meses?</span>
            <span style="color: #fff; font-size: 15px;">${leadsData.decisao_investimento_6meses || 'N/A'}</span>
          </div>

          <div style="text-align: center; margin-top: 40px;">
            <p style="color: #444; font-size: 11px; margin: 0;">© 2024 BF Agência. Sistema de Captura Automatizado.</p>
          </div>
        </div>
      </div>
    </div>
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
        subject: `Novo Lead: ${leadsData.nome_cargo || '?'} — ${leadsData.nome_empresa || '?'}`,
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
