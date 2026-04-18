// config.js — configuração específica do projeto/cliente
// ⚠️ Placeholder: PROJECT_UUID deve ser substituído pelo UUID real gerado
// pelo back-end no onboarding. Quando houver autenticação, virá da sessão
// do usuário (user.currentProjectId).
const PROJECT_UUID = 'b9f3e2a1-4c7d-4e8f-9a2b-1d6e3f7c0b5a';

// Prompts de IA centralizados por finalidade.
// O prompt `content` é o único que o usuário edita na UI do projeto.
const AI_PROMPTS = Object.freeze({
  content: [
    'ROLE:',
    'Você é um copywriter sênior especializado em Instagram para um projeto de saúde emocional e fé.',
    '',
    'TASK:',
    'Crie textos claros, humanos e persuasivos para posts e legendas do Instagram, sempre adaptando a resposta ao contexto do projeto e ao conteúdo do post.',
    '',
    'CONTEXT:',
    'O conteúdo será usado em posts visuais com tom acolhedor, profundo e confiável.',
    'Quando houver texto do post, respeite a mensagem, o ritmo e a intenção do layout.',
    '',
    'SPECIFICS:',
    'Use linguagem natural em português do Brasil.',
    'Priorize legibilidade, ritmo de leitura e conexão emocional.',
    'Se a tarefa pedir legenda, produza uma legenda pronta para publicação.',
    'Quando gerar legenda, entregue somente texto puro, sem caracteres adicionais de formatação como *, _, **, __, hashtags decorativas ou marcações semelhantes.',
    'Se a tarefa pedir conteúdo para o layout, produza texto curto, direto e alinhado ao espaço visual disponível.',
    '',
    'NOTES:',
    'Não invente fatos, promessas ou dados não fornecidos.',
    'Evite linguagem genérica de marketing e exageros artificiais.',
    'Mantenha coerência com o contexto do projeto informado pelo usuário.',
  ].join('\n'),
  palette: [
    'ROLE:',
    'Você é um designer de identidade visual especializado em paletas de cores para interfaces e social media.',
    '',
    'TASK:',
    'Gere uma paleta de cores coesa, funcional e legível a partir do nome informado.',
    '',
    'CONTEXT:',
    'A paleta será usada em um editor de posts com foco em estética elegante e contraste confiável.',
    '',
    'SPECIFICS:',
    'Retorne somente cores hex válidas nas chaves accent, bgDark, bgLight, textOnDark, textOnLight e textMuted.',
    'Busque harmonia, contraste legível e aplicação prática em UI e cards de conteúdo.',
    'Evite cores muito saturadas ou combinações com baixo contraste.',
    '',
    'NOTES:',
    'Não explique o raciocínio.',
    'Não inclua texto fora do JSON final.',
  ].join('\n'),
  fontpack: [
    'ROLE:',
    'Você é um designer tipográfico especializado em sistemas de fonte para posts e interfaces editoriais.',
    '',
    'TASK:',
    'Crie um pacote tipográfico consistente, com famílias de título e corpo e uma escala harmônica em pixels.',
    '',
    'CONTEXT:',
    'O pacote será aplicado em templates visuais de Instagram e na interface do editor quando a herança estiver ativa.',
    '',
    'SPECIFICS:',
    'Retorne somente JSON com headingFamily, bodyFamily, h1, h2, h3, kicker, body, block, meta e cta.',
    'Use famílias populares do Google Fonts ou fallbacks confiáveis. headingFamily e bodyFamily devem vir como stacks CSS válidas, por exemplo: "Bebas Neue, sans-serif" ou "Montserrat, sans-serif".',
    'Não use palavras de peso como bold, regular ou light dentro do valor de headingFamily/bodyFamily; peso é aplicado por CSS, não dentro do nome da família.',
    'Mantenha a hierarquia clara e adequada para leitura em telas pequenas.',
    'Use como referência base: h1 80, h2 42, h3 26, kicker 21, body 28, block 32, meta 20, cta 21.',
    'Adapte a escala ao tipo de fonte escolhida: serif/display pede títulos mais generosos; sans/clean pode ser um pouco mais contida; condensadas pedem um pouco mais de corpo para não perder leitura.',
    'Quando houver dúvida, mantenha kicker entre 21 e 24 px e body em torno de 27 a 29 px para não cair em tamanhos pequenos demais.',
    'Os tamanhos devem ser inteiros entre 8 e 220 px.',
    '',
    'NOTES:',
    'Não explique o raciocínio.',
    'Não inclua texto fora do JSON final.',
  ].join('\n'),
  research: [
    'ROLE:',
    'Você é um pesquisador sênior de conteúdo e estratégia editorial para Instagram, com foco em relevância, contexto e precisão.',
    '',
    'TASK:',
    'Realize uma pesquisa de conteúdo profunda a partir do prompt do usuário e do contexto do projeto, levantando temas, ângulos, referências, termos-chave e oportunidades editoriais acionáveis.',
    '',
    'TOOLS:',
    'Ferramentas disponíveis:',
    '  - skills.md: guia o comportamento especializado da pesquisa e a forma de usar os recursos disponíveis.',
    '    - Entradas: contexto do projeto, objetivo da pesquisa, prompt do usuário, restrições e sinais de intenção.',
    '    - Saídas: plano de pesquisa, critérios de busca, instruções operacionais e formato esperado de síntese.',
    '    - Use quando: for necessário orientar o raciocínio, dividir a busca em etapas ou adaptar a pesquisa ao projeto.',
    '    - Não use quando: a tarefa for puramente criativa e não exigir investigação.',
    '  - Scripts Python (.py): executam a pesquisa, coleta, organização, normalização e síntese dos resultados.',
    '    - Entradas: consultas derivadas do contexto do projeto e do prompt do usuário, fontes-alvo, filtros e palavras-chave.',
    '    - Saídas: achados estruturados, evidências, listas priorizadas, lacunas e recomendações editoriais.',
    '    - Use quando: houver necessidade de buscar, varrer, comparar, extrair ou consolidar informações em múltiplas fontes.',
    '    - Não use quando: o resultado puder ser entregue sem consulta externa ou sem processamento técnico.',
    'Regras de uso:',
    '  - Nunca invente resultados de ferramentas ou fontes não consultadas.',
    '  - Sempre use o contexto do projeto como variável de busca, junto com o prompt do usuário.',
    '  - Se houver conflito entre o prompt do usuário e o contexto do projeto, sinalize a divergência e priorize a coerência editorial.',
    '  - Se uma ferramenta falhar ou retornar pouco sinal, declare a limitação e refine a estratégia antes de concluir.',
    'Ordem de execução:',
    '  1. Ler o contexto do projeto e o prompt do usuário.',
    '  2. Extrair intenção editorial, público, tema, tom e restrições.',
    '  3. Gerar termos de busca, variações semânticas e subtemas prováveis.',
    '  4. Executar os scripts Python de pesquisa e consolidação.',
    '  5. Sintetizar os achados em recomendações práticas e evidências úteis.',
    '',
    'INPUTS / DADOS:',
    'Dados fornecidos:',
    '  - Prompt do usuário.',
    '  - Contexto do projeto.',
    '  - Tom de voz, público, objetivo e restrições editoriais disponíveis.',
    'Restrições objetivas:',
    '  - Respeitar idioma, nicho e posicionamento do projeto.',
    '  - Priorizar dados verificáveis e fontes relevantes ao tema.',
    '  - Evitar generalizações sem suporte factual.',
    'Dados ausentes:',
    '  - Fontes específicas, recorte temporal e profundidade exata da pesquisa, se não forem informados.',
    '',
    'CONTEXT:',
    'A pesquisa será usada para orientar criação de conteúdo, identificar oportunidades editoriais e melhorar a qualidade das decisões de pauta do projeto.',
    'O contexto do projeto deve funcionar como lente de busca, refinando o que procurar, como interpretar e o que priorizar.',
    '',
    'SPECIFICS:',
    'Processo:',
    '  1. Interpretar o pedido e transformar a necessidade em eixos de pesquisa.',
    '  2. Combinar o contexto do projeto com o prompt do usuário para gerar consultas e hipóteses.',
    '  3. Buscar, comparar e filtrar informações relevantes com foco em utilidade editorial.',
    '  4. Organizar os achados por prioridade, oportunidade e aplicabilidade prática.',
    'Formato de saída:',
    '  - Estrutura: resumo executivo, achados principais, temas recomendados, ângulos sugeridos, lacunas e próximos passos.',
    '  - Tamanho: direto, mas completo o suficiente para guiar a próxima etapa de conteúdo.',
    '  - Idioma: português do Brasil.',
    'Critérios de qualidade:',
    '  - Usa o contexto do projeto explicitamente como variável de busca.',
    '  - Separa fato, inferência e recomendação.',
    '  - Explicita sinais de força e limitações da pesquisa.',
    '  - Entrega material acionável para criação de conteúdo.',
    '',
    'NOTES:',
    'Restrições:',
    '  - Não inventar fontes, dados ou conclusões.',
    '  - Não tratar hipótese como fato.',
    '  - Não ignorar o contexto do projeto ao formular buscas ou sínteses.',
    'Protocolo de incerteza:',
    '  - Se faltarem dados críticos, faça até 7 perguntas essenciais antes de concluir.',
    '  - Se houver múltiplas leituras possíveis, apresente as opções mais prováveis e marque a ambiguidade.',
    '  - Se a pesquisa não puder ser concluída com segurança, declare o que falta e proponha o melhor caminho alternativo.',
    'Validação final:',
    '  - Confirme que os achados respondem ao prompt do usuário.',
    '  - Confirme que o contexto do projeto foi usado na busca e na interpretação.',
    '  - Confirme que o formato final é adequado para orientar conteúdo.',
  ].join('\n'),
});

const FONT_SCALE_REFERENCE = Object.freeze({
  h1: 80,
  h2: 42,
  h3: 26,
  kicker: 21,
  body: 28,
  block: 32,
  meta: 20,
  cta: 21,
});

const FONT_SCALE_TONE_BIAS = Object.freeze({
  display: { h1: 4, h2: 2, h3: 2, kicker: 1, body: 0, block: 2, meta: 0, cta: 0 },
  serif: { h1: 0, h2: 0, h3: 0, kicker: 0, body: 0, block: 0, meta: 0, cta: 0 },
  sans: { h1: -2, h2: -2, h3: -1, kicker: 0, body: 0, block: -1, meta: -1, cta: -1 },
  condensed: { h1: 2, h2: 2, h3: 1, kicker: 1, body: 1, block: 2, meta: 0, cta: 0 },
  mono: { h1: -2, h2: -2, h3: -1, kicker: 0, body: 0, block: -1, meta: -1, cta: -1 },
  mixed: { h1: 0, h2: 0, h3: 0, kicker: 0, body: 0, block: 0, meta: 0, cta: 0 },
});

const GENERIC_FONT_FAMILIES = new Set(['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-serif', 'ui-sans-serif', 'ui-monospace', 'ui-rounded', 'math', 'emoji', 'fangsong']);
const SYSTEM_FONT_FAMILIES = new Set([
  'arial', 'helvetica', 'georgia', 'times', 'times new roman', 'verdana', 'tahoma', 'trebuchet ms',
  'palatino', 'garamond', 'baskerville', 'book antiqua', 'cambria', 'candara', 'calibri', 'constantia',
  'corbel', 'segoe ui', 'segoe ui light', 'segoe ui semibold', 'lucida grande', 'lucida sans unicode',
  'comic sans ms', 'courier', 'courier new', 'consolas', 'monaco', 'menlo', 'andale mono', 'impact',
]);

function escapeFontFamilyName(value) {
  return String(value ?? '').trim().replace(/^['"]|['"]$/g, '');
}

function quoteFontFamilyName(value) {
  const clean = escapeFontFamilyName(value);
  if (!clean) return '';
  return /[\s,]/.test(clean) ? `'${clean.replace(/'/g, "\\'")}'` : clean;
}

function getGenericFontFallback(fontFamily = '', fallback = 'sans-serif') {
  const text = String(fontFamily || '').toLowerCase();
  if (/(mono|courier|code|console)/.test(text)) return 'monospace';
  if (/(serif|georgia|times|garamond|bodoni|didot|baskerville|cormorant|playfair|abril|lora|merriweather|libre|news|slab)/.test(text)) return 'serif';
  if (/(display|condensed|narrow|bebas|impact|anton|oswald|archivo black|league spartan|bebas neue)/.test(text)) return 'sans-serif';
  return fallback || 'sans-serif';
}

function normalizeFontFamilyStack(value, fallback = 'sans-serif') {
  const raw = String(value ?? '').trim();
  if (!raw) return fallback;

  const parts = raw.split(',').map(part => escapeFontFamilyName(part)).filter(Boolean);
  const family = parts.find(part => !GENERIC_FONT_FAMILIES.has(part.toLowerCase()) && !/^(bold|normal|regular|light|medium|semibold|black|thin|italic|oblique)$/i.test(part));
  if (!family) return fallback;

  const generic = parts.find(part => GENERIC_FONT_FAMILIES.has(part.toLowerCase())) || getGenericFontFallback(family, fallback);
  return `${quoteFontFamilyName(family)}, ${generic}`;
}

function extractFontFamiliesForLoading(...stacks) {
  const families = [];
  stacks.flat().forEach(stack => {
    const raw = String(stack ?? '').trim();
    if (!raw) return;
    raw.split(',').map(part => escapeFontFamilyName(part)).forEach(part => {
      const lower = part.toLowerCase();
      if (!part || GENERIC_FONT_FAMILIES.has(lower) || SYSTEM_FONT_FAMILIES.has(lower) || /^(bold|normal|regular|light|medium|semibold|black|thin|italic|oblique)$/i.test(part)) return;
      if (!families.includes(part)) families.push(part);
    });
  });
  return families;
}

function buildGoogleFontsHref(families = []) {
  const unique = Array.from(new Set(families.map(name => escapeFontFamilyName(name)).filter(Boolean)));
  if (!unique.length) return '';
  const params = unique.map(name => `family=${encodeURIComponent(name).replace(/%20/g, '+')}:wght@400;500;700`);
  return `https://fonts.googleapis.com/css2?${params.join('&')}&display=swap`;
}

function ensureGoogleFontsLoaded(doc, families = []) {
  if (!doc || !doc.head) return;
  const href = buildGoogleFontsHref(extractFontFamiliesForLoading(families));
  const id = 'pg-dynamic-fonts';
  let link = doc.getElementById(id);
  if (!href) {
    if (link) link.remove();
    return;
  }
  if (!link) {
    link = doc.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    doc.head.appendChild(link);
  }
  if (link.getAttribute('href') !== href) link.setAttribute('href', href);
  if (doc.fonts?.load) {
    extractFontFamiliesForLoading(families).forEach(name => {
      void doc.fonts.load(`16px ${quoteFontFamilyName(name)}`);
    });
  }
}

function inferFontpackTone(fontpack = {}) {
  const familyText = `${fontpack.headingFamily || ''} ${fontpack.bodyFamily || ''}`.toLowerCase();
  if (/(condensed|narrow|compressed)/.test(familyText)) return 'condensed';
  if (/(display|playfair|cormorant|abril|bodoni|didot|baskerville|cinzel|merriweather|lora|libre)/.test(familyText)) return 'display';
  if (/(serif|georgia|times|garamond|bitter|domine|slab)/.test(familyText)) return 'serif';
  if (/(mono|courier|code|console)/.test(familyText)) return 'mono';
  if (/(sans|arial|helvetica|inter|roboto|open sans|lato|montserrat|poppins|source sans|nunito|dm sans|work sans|ubuntu|assistant)/.test(familyText)) return 'sans';
  return 'mixed';
}

function getRecommendedFontScale(fontpack = {}) {
  const tone = inferFontpackTone(fontpack);
  const bias = FONT_SCALE_TONE_BIAS[tone] || FONT_SCALE_TONE_BIAS.mixed;
  return Object.freeze({
    h1: FONT_SCALE_REFERENCE.h1 + (bias.h1 || 0),
    h2: FONT_SCALE_REFERENCE.h2 + (bias.h2 || 0),
    h3: FONT_SCALE_REFERENCE.h3 + (bias.h3 || 0),
    kicker: FONT_SCALE_REFERENCE.kicker + (bias.kicker || 0),
    body: FONT_SCALE_REFERENCE.body + (bias.body || 0),
    block: FONT_SCALE_REFERENCE.block + (bias.block || 0),
    meta: FONT_SCALE_REFERENCE.meta + (bias.meta || 0),
    cta: FONT_SCALE_REFERENCE.cta + (bias.cta || 0),
  });
}

function maskAISecret(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (raw.length <= 10) return '***';
  return `${raw.slice(0, 8)}…${raw.slice(-4)}`;
}

function escapeCurlSingleQuote(value) {
  return String(value ?? '').replace(/'/g, `'\\''`);
}

function buildCurlCommand(details = {}) {
  const request = details.request || {};
  const headers = details.headers || {};
  const url = details.url || 'https://openrouter.ai/api/v1/chat/completions';
  const method = request.method || 'POST';
  const body = JSON.stringify(request);
  const authValue = headers.Authorization ? `Bearer ${maskAISecret(details.apiKey)}` : null;

  const parts = [
    `curl -X ${method} '${escapeCurlSingleQuote(url)}'`,
    `-H 'Content-Type: application/json'`,
  ];

  if (authValue) parts.push(`-H 'Authorization: ${escapeCurlSingleQuote(authValue)}'`);
  if (headers['HTTP-Referer']) parts.push(`-H 'HTTP-Referer: ${escapeCurlSingleQuote(headers['HTTP-Referer'])}'`);
  if (headers['X-Title']) parts.push(`-H 'X-Title: ${escapeCurlSingleQuote(headers['X-Title'])}'`);
  if (body) parts.push(`--data-raw '${escapeCurlSingleQuote(body)}'`);

  return parts.join(' \\\n  ');
}

function buildAIChatRequest(options = {}) {
  const {
    model,
    systemPrompt = '',
    userSections = [],
    responseFormat = null,
    stream = false,
  } = options;

  const messages = [];
  const systemText = String(systemPrompt ?? '').trim();
  if (systemText) messages.push({ role: 'system', content: systemText });

  const sections = [];
  if (Array.isArray(userSections)) {
    userSections.forEach(section => {
      const title = String(section?.title ?? '').trim();
      const content = String(section?.content ?? '').trim();
      if (!title || !content) return;
      sections.push(`${title}:\n${content}`);
    });
  }

  const userText = sections.join('\n\n').trim();
  if (userText) messages.push({ role: 'user', content: userText });

  const request = { model, messages };
  if (responseFormat) request.response_format = responseFormat;
  if (stream) request.stream = true;
  return request;
}

function getAIDebugEnabled() {
  try {
    const raw = localStorage.getItem(`posts-ig:${PROJECT_UUID}:ai-debug`);
    return raw === null ? true : raw !== '0';
  } catch {
    return true;
  }
}

function logAICall(feature, details = {}) {
  if (!getAIDebugEnabled() || typeof console === 'undefined') return;

  const request = details.request || {};
  const title = `[AI][${feature}] ${request.model || details.model || 'unknown-model'}`;
  console.groupCollapsed(title);
  console.log('curl:', buildCurlCommand(details));
  if (details.response) console.log('response:', details.response);
  console.groupEnd();
}

// Migração v1: copia chaves estáticas posts-ig:<chave> → posts-ig:{UUID}:<chave>
// Executa apenas uma vez por UUID.
(function migrateLocalStorageV1() {
  const MIGRATION_KEY = `posts-ig:${PROJECT_UUID}:migrated-v1`;
  if (localStorage.getItem(MIGRATION_KEY)) return;
  const OLD_KEYS = [
    'config', 'palette', 'palettes', 'fontpack', 'fontpacks',
    'typography', 'apikey', 'aimodel', 'platform-inherit',
    'platform-font-inherit', 'ui-theme',
  ];
  OLD_KEYS.forEach(k => {
    const val = localStorage.getItem(`posts-ig:${k}`);
    if (val !== null) {
      localStorage.setItem(`posts-ig:${PROJECT_UUID}:${k}`, val);
      localStorage.removeItem(`posts-ig:${k}`);
    }
  });
  localStorage.setItem(MIGRATION_KEY, '1');
}());

// Migração v2: varre chaves dinâmicas órfãs posts-ig:<prefixo>:<arquivo>
// Cobre vars:, thread: e caption: que não foram incluídas na v1.
// Remove também chaves com nomes de arquivo antigos (sem UUID).
(function migrateLocalStorageV2() {
  const MIGRATION_KEY = `posts-ig:${PROJECT_UUID}:migrated-v2`;
  if (localStorage.getItem(MIGRATION_KEY)) return;
  const DYNAMIC_PREFIXES = ['vars', 'thread', 'caption'];
  const UUID_PREFIX = `posts-ig:${PROJECT_UUID}:`;
  Object.keys(localStorage).forEach(key => {
    if (!key.startsWith('posts-ig:')) return;
    if (key.startsWith(UUID_PREFIX)) return; // já tem UUID, ignorar
    const rest = key.slice('posts-ig:'.length); // ex: "vars:post-1.html"
    const isOrphan = DYNAMIC_PREFIXES.some(p => rest.startsWith(p + ':'));
    if (!isOrphan) return;
    const newKey = `${UUID_PREFIX}${rest}`;
    // Só copia se ainda não existe a versão com UUID
    if (localStorage.getItem(newKey) === null) {
      localStorage.setItem(newKey, localStorage.getItem(key));
    }
    localStorage.removeItem(key);
  });
  localStorage.setItem(MIGRATION_KEY, '1');
}());
