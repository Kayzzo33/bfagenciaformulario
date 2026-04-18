// O frontend chama a Vercel Serverless Function em /api/send-email
// A chave Resend NÃO existe aqui — fica 100% no servidor da Vercel

export const sendEmail = async (leadsData) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadsData),
    });

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    if (!response.ok) {
      if (isJson) {
        const error = await response.json();
        throw new Error(error.error || `Erro ${response.status}: Falha no envio`);
      } else {
        // Se cair aqui no localhost, é porque a rota /api não existe no Vite
        if (window.location.hostname === 'localhost') {
          console.warn('API de e-mail não disponível no localhost (npm run dev). Use "npx vercel dev" para testar funções.');
          return { success: false, mode: 'localhost_mock' };
        }
        throw new Error(`Erro ${response.status}: Resposta não pôde ser processada`);
      }
    }

    return isJson ? await response.json() : { success: true };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw error;
  }
};
