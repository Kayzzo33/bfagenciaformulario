export const questions = [
  {
    id: 'welcome_1',
    type: 'text',
    messages: [
      'Olá! Seja muito bem-vindo à BF Agência.'
    ],
    next: 'welcome_2'
  },
  {
    id: 'welcome_2',
    type: 'options',
    messages: [
      'Para começar, gostaríamos de entender um pouco mais sobre a sua empresa, assim conseguimos direcioná-lo ao consultor ideal, tudo bem?'
    ],
    options: [
      { label: 'OK! Clique para começar...', value: 'start', icon: 'Check' }
    ],
    field: 'start_consent',
    next: 'identificacao_nome'
  },
  {
    id: 'identificacao_nome',
    type: 'input',
    label: 'Nome completo e cargo',
    placeholder: 'Qual o seu nome?',
    messages: ['Qual o seu nome?'],
    field: 'nome_cargo',
    next: 'identificacao_empresa'
  },
  {
    id: 'identificacao_empresa',
    type: 'input',
    label: 'Nome da empresa',
    placeholder: 'Nome da sua empresa',
    messages: ['Qual o nome da sua empresa?'],
    field: 'nome_empresa',
    next: 'identificacao_site'
  },
  {
    id: 'identificacao_site',
    type: 'input',
    label: 'Link do site ou rede social',
    placeholder: 'https://suaempresa.com.br',
    messages: ['Qual o link do site ou rede social?'],
    field: 'site_rede_social',
    next: 'contato_dados'
  },
  {
    id: 'contato_dados',
    type: 'input',
    label: 'E-mail e WhatsApp',
    placeholder: 'seu@email.com - (00) 00000-0000',
    messages: ['Qual o seu melhor e-mail e número para contato?'],
    field: 'email_telefone',
    next: 'segmento'
  },
  {
    id: 'segmento',
    type: 'input',
    label: 'Segmento de atuação',
    placeholder: 'Ex: E-commerce, Saúde, Imobiliário...',
    messages: ['Em qual segmento vocês atuam?'],
    field: 'segmento_atuacao',
    next: 'faturamento_medio'
  },
  {
    id: 'faturamento_medio',
    type: 'options',
    label: 'Faturamento médio mensal',
    messages: ['Qual o faturamento médio mensal da sua empresa?'],
    options: [
      { label: 'Entre R$ 1.000 e R$ 19.000', value: '1k_19k', icon: 'Wallet' },
      { label: 'Entre R$ 20.000 e R$ 49.000', value: '20k_49k', icon: 'Coins' },
      { label: 'Entre R$ 50.000 e R$ 99.000', value: '50k_99k', icon: 'Banknote' },
      { label: 'Entre R$ 100.000 e R$ 299.000', value: '100k_299k', icon: 'Briefcase' },
      { label: 'Acima de R$ 300.000', value: 'acima_300k', icon: 'Crown' }
    ],
    field: 'faturamento_mensal',
    next: 'investe_trafego'
  },
  {
    id: 'investe_trafego',
    type: 'options',
    label: 'Você já investe em tráfego pago?',
    messages: ['Você já investe ou já investiu em tráfego pago?'],
    options: [
      { label: 'Sim, ativamente', value: 'sim_ativo', icon: 'CheckCircle2' },
      { label: 'Tive, mas pausei', value: 'tive_pausei', icon: 'PauseCircle' },
      { label: 'Nunca investi', value: 'nunca_investi', icon: 'XCircle' }
    ],
    field: 'investimento_status',
    next: 'investimento_valor'
  },
  {
    id: 'investimento_valor',
    type: 'options',
    label: 'Valor investido mensalmente',
    messages: ['Investe quanto mensalmente em tráfego pago (anúncios)?'],
    options: [
      { label: 'Não invisto', value: 'nao_invisto', icon: 'X' },
      { label: 'Até R$ 1.500', value: 'ate_1_5k', icon: 'DollarSign' },
      { label: 'Entre R$ 1.501 a R$ 5.000', value: '1_5k_5k', icon: 'BarChart' },
      { label: 'Entre R$ 5.001 a R$ 10.000', value: '5k_10k', icon: 'TrendingUp' },
      { label: 'Acima de R$ 10.001', value: 'acima_10k', icon: 'Zap' }
    ],
    field: 'investimento_valor_mensal',
    next: 'objetivo_foco'
  },
  {
    id: 'objetivo_foco',
    type: 'input',
    label: 'Maior foco agora',
    placeholder: 'Ex: Gerar mais leads qualificados, aumentar vendas...',
    messages: ['Qual é o seu maior foco com tráfego pago agora?'],
    field: 'objetivo_principal',
    next: 'decisao_investimento'
  },
  {
    id: 'decisao_investimento',
    type: 'options',
    label: 'Decisão de investimento',
    messages: [
      'Perfeito! Recebemos suas informações.',
      'Desde 2023, ajudamos mais de 50 negócios locais a crescer de verdade através de anúncios online, muitos deles chegando a dobrar o faturamento.',
      'Hoje, pra conseguir gerar resultado consistente com dados suficientes pra testar, ajustar e escalar. Trabalhamos com uma base mínima de R$ 2.000 por mês (investimento em anúncios online + nosso serviço de gestão).',
      'Esse número não é aleatório: é o mínimo que, com base na nossa experiência com mais de 50 negócios, R$200 mil/ano investidos em tráfego e mais de R$500 mil/ano faturados para nossos clientes, permite ter dados reais para tomar decisões mais assertivas e crescer com consistência.',
      'Dito isso, olhando pro seu momento: faz sentido pra você investir nesse nível pelos próximos 6 meses?'
    ],
    options: [
      { label: 'Sim, quero investir', value: 'sim', icon: 'CheckCircle' },
      { label: 'Não, não é um momento', value: 'nao', icon: 'Clock' }
    ],
    field: 'decisao_investimento_6meses',
    next: null
  },
  {
    id: 'conclusao_sim',
    type: 'text',
    messages: [
      'Excelente! Você está no caminho certo para escalar suas vendas.',
      'Clique no botão abaixo para concluir o envio via WhatsApp e falar com um consultor.'
    ],
    next: null
  },
  {
    id: 'conclusao_nao',
    type: 'text',
    messages: [
      'Entendido!',
      'Obrigado pelo seu tempo.',
      'Caso tenha condições no futuro ficaremos felizes em receber-te.'
    ],
    next: null
  }
];
