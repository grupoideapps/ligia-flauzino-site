// models.js — edite aqui para adicionar, remover ou ajustar modelos e descrições
// Cada modelo tem: id (OpenRouter), company, name, tier (powerful/balanced/fast), label (PT), description


// models.js — edite aqui para adicionar, remover ou ajustar modelos e descrições
// Cada modelo tem: id (OpenRouter), company, name, tier (powerful/balanced/fast), label (PT), description

// models.js — Lista completa de modelos OpenRouter
// Propriedades: id, company, name, tier, label, description, isFree

// models.js — Lista completa com indicadores de latência
// Novas propriedades: latencyTier ('fast'|'medium'|'slow'), latencyNote (texto para UI)

const AI_MODELS = [
  // ==================== OPENAI ====================
  {
    id: 'openai/gpt-4o',
    company: 'OpenAI',
    name: 'GPT-4o',
    tier: 'powerful',
    label: 'Poderoso',
    description: 'Versátil e inteligente. Ideal para análise de documentos, criação de conteúdo rico, legendas detalhadas e tarefas que exigem raciocínio.',
    isFree: false,
    latencyTier: 'fast',
    latencyNote: 'Respostas geralmente em 1-2 segundos.'
  },
  {
    id: 'openai/gpt-4o-mini',
    company: 'OpenAI',
    name: 'GPT-4o Mini',
    tier: 'balanced',
    label: 'Equilibrado',
    description: 'Ótimo custo-benefício. Perfeito para respostas do dia a dia, resumos, e-mails e tarefas rápidas com boa qualidade.',
    isFree: false,
    latencyTier: 'fast',
    latencyNote: 'Respostas geralmente em 1-2 segundos.'
  },
  {
    id: 'openai/gpt-4.1-nano',
    company: 'OpenAI',
    name: 'GPT-4.1 Nano',
    tier: 'fast',
    label: 'Rápido',
    description: 'Super rápido e econômico. Use para correções simples, classificações e tarefas repetitivas que não exigem profundidade.',
    isFree: false,
    latencyTier: 'fast',
    latencyNote: 'Respostas quase instantâneas.'
  },

  // ==================== ANTHROPIC ====================
  {
    id: 'anthropic/claude-opus-4',
    company: 'Anthropic',
    name: 'Claude Opus 4',
    tier: 'powerful',
    label: 'Poderoso',
    description: 'O mais inteligente da Anthropic. Excelente para projetos complexos, análise técnica, escrita profissional e tarefas que exigem muita precisão.',
    isFree: false,
    latencyTier: 'medium',
    latencyNote: 'Pode levar alguns segundos a mais para respostas mais elaboradas.'
  },
  {
    id: 'anthropic/claude-sonnet-4-5',
    company: 'Anthropic',
    name: 'Claude Sonnet 4.5',
    tier: 'balanced',
    label: 'Equilibrado',
    description: 'Equilíbrio perfeito. Ótimo para programação, redação criativa, revisão de textos e tarefas que precisam de qualidade sem gastar muito.',
    isFree: false,
    latencyTier: 'fast',
    latencyNote: 'Respostas geralmente em 1-3 segundos.'
  },
  {
    id: 'anthropic/claude-haiku-4-5',
    company: 'Anthropic',
    name: 'Claude Haiku 4.5',
    tier: 'fast',
    label: 'Rápido',
    description: 'Veloz e eficiente. Ideal para respostas instantâneas, geração de legendas curtas e tarefas simples em grande volume.',
    isFree: false,
    latencyTier: 'fast',
    latencyNote: 'Respostas quase instantâneas.'
  },

  // ==================== GOOGLE ====================
  {
    id: 'google/gemini-2.5-pro',
    company: 'Google',
    name: 'Gemini 2.5 Pro',
    tier: 'powerful',
    label: 'Poderoso',
    description: 'O topo do Google. Brilha em contextos longos, análise de vídeos/imagens, pesquisas profundas e tarefas multimodais complexas.',
    isFree: false,
    latencyTier: 'medium',
    latencyNote: 'Pode levar alguns segundos a mais para processar contextos longos.'
  },
  {
    id: 'google/gemini-2.0-flash',
    company: 'Google',
    name: 'Gemini 2.0 Flash',
    tier: 'balanced',
    label: 'Equilibrado',
    description: 'Rápido e capaz. Boa opção para chat, resumos, tradução e tarefas gerais com bom desempenho e preço acessível.',
    isFree: false,
    latencyTier: 'fast',
    latencyNote: 'Respostas geralmente em 1-2 segundos.'
  },
  {
    id: 'google/gemini-flash-1.5-8b',
    company: 'Google',
    name: 'Gemini Flash 1.5 8B',
    tier: 'fast',
    label: 'Rápido',
    description: 'Leve e ágil. Perfeito para tarefas simples, alto volume de requisições e quando a velocidade é prioridade.',
    isFree: false,
    latencyTier: 'fast',
    latencyNote: 'Respostas quase instantâneas.'
  },

  // ==================== DEEPSEEK ====================
  {
    id: 'deepseek/deepseek-r1',
    company: 'DeepSeek',
    name: 'DeepSeek R1',
    tier: 'powerful',
    label: 'Poderoso',
    description: 'Especialista em raciocínio. Ideal para matemática, lógica, análise de dados e tarefas que exigem pensamento passo a passo.',
    isFree: false,
    latencyTier: 'slow',
    latencyNote: 'Modelo de raciocínio profundo: respostas podem levar 10-30 segundos.'
  },
  {
    id: 'deepseek/deepseek-chat-v3-0324',
    company: 'DeepSeek',
    name: 'DeepSeek Chat V3',
    tier: 'balanced',
    label: 'Equilibrado',
    description: 'Qualidade premium com preço acessível. Excelente para programação, escrita técnica e tarefas gerais do dia a dia.',
    isFree: false,
    latencyTier: 'medium',
    latencyNote: 'Respostas geralmente em 2-5 segundos.'
  },
  {
    id: 'deepseek/deepseek-chat',
    company: 'DeepSeek',
    name: 'DeepSeek Chat',
    tier: 'fast',
    label: 'Rápido',
    description: 'Eficiente e econômico. Bom para conversas rápidas, geração de ideias e tarefas simples que não exigem raciocínio profundo.',
    isFree: false,
    latencyTier: 'fast',
    latencyNote: 'Respostas geralmente em 1-3 segundos.'
  },

  // ==================== QWEN ====================
  {
    id: 'qwen/qwen3-235b-a22b',
    company: 'Qwen',
    name: 'Qwen3 235B',
    tier: 'powerful',
    label: 'Poderoso',
    description: 'Modelo massivo com alta capacidade. Ideal para tarefas complexas, criação criativa avançada e análise de contextos muito longos.',
    isFree: false,
    latencyTier: 'medium',
    latencyNote: 'Pode levar alguns segundos a mais devido ao tamanho do modelo.'
  },
  {
    id: 'qwen/qwen3-32b',
    company: 'Qwen',
    name: 'Qwen3 32B',
    tier: 'balanced',
    label: 'Equilibrado',
    description: 'Sólido e acessível. Boa opção geral para programação, escrita e tarefas do dia a dia com ótimo custo-benefício.',
    isFree: false,
    latencyTier: 'fast',
    latencyNote: 'Respostas geralmente em 1-3 segundos.'
  },
  {
    id: 'qwen/qwen3-8b',
    company: 'Qwen',
    name: 'Qwen3 8B',
    tier: 'fast',
    label: 'Rápido',
    description: 'Leve e veloz. Perfeito para edições rápidas, geração de conteúdo em massa e tarefas que priorizam velocidade.',
    isFree: false,
    latencyTier: 'fast',
    latencyNote: 'Respostas quase instantâneas.'
  },

  // ==================== MODELOS GRATUITOS (:free) ====================
  // ⚠️ Limite: 20 req/min e 200 req/dia por modelo. Latência geralmente maior por infraestrutura compartilhada.

  // --- Melhores para Código ---
  {
    id: 'qwen/qwen3-coder:free',
    company: 'Qwen',
    name: 'Qwen3 Coder 480B (Free)',
    tier: 'powerful',
    label: 'Poderoso',
    description: 'Melhor modelo gratuito para programação. Gera, corrige e explica código com alta precisão. Ideal para devs.',
    isFree: true,
    latencyTier: 'medium',
    latencyNote: 'Grátis: respostas podem levar 3-8 segundos devido à fila compartilhada.'
  },
  {
    id: 'nvidia/nemotron-3-super-120b-a12b:free',
    company: 'NVIDIA',
    name: 'Nemotron 3 Super (Free)',
    tier: 'powerful',
    label: 'Poderoso',
    description: 'Excelente para código e raciocínio lógico. Contexto longo (262K) e ótimo para tarefas complexas sem custo.',
    isFree: true,
    latencyTier: 'medium',
    latencyNote: 'Grátis: respostas podem levar 3-8 segundos devido à fila compartilhada.'
  },
  {
    id: 'meta-llama/llama-3.3-70b-instruct:free',
    company: 'Meta',
    name: 'Llama 3.3 70B (Free)',
    tier: 'balanced',
    label: 'Equilibrado',
    description: 'Versátil e confiável. Bom para código, escrita e tarefas gerais. Ótimo ponto de partida gratuito.',
    isFree: true,
    latencyTier: 'medium',
    latencyNote: 'Grátis: respostas podem levar 3-8 segundos devido à fila compartilhada.'
  },

  // --- Melhores para Escrita ---
  {
    id: 'google/gemma-4-31b-it:free',
    company: 'Google',
    name: 'Gemma 4 31B (Free)',
    tier: 'balanced',
    label: 'Equilibrado',
    description: 'Escrita natural e multimodal. Bom para textos, resumos, tradução e compreensão de documentos.',
    isFree: true,
    latencyTier: 'medium',
    latencyNote: 'Grátis: respostas podem levar 3-8 segundos devido à fila compartilhada.'
  },
  {
    id: 'minimax/minimax-m2.5:free',
    company: 'MiniMax',
    name: 'MiniMax M2.5 (Free)',
    tier: 'balanced',
    label: 'Equilibrado',
    description: 'Produtividade geral: escreve e-mails, relatórios, planilhas e ajuda com código. Ótimo custo zero.',
    isFree: true,
    latencyTier: 'medium',
    latencyNote: 'Grátis: respostas podem levar 3-8 segundos devido à fila compartilhada.'
  },

  // --- Rápidos / Leves ---
  {
    id: 'google/gemma-3-12b-it:free',
    company: 'Google',
    name: 'Gemma 3 12B (Free)',
    tier: 'fast',
    label: 'Rápido',
    description: 'Leve e ágil para tarefas simples: correções, ideias rápidas e respostas curtas sem gastar nada.',
    isFree: true,
    latencyTier: 'fast',
    latencyNote: 'Grátis: respostas geralmente em 2-5 segundos.'
  },
  {
    id: 'meta-llama/llama-3.2-3b-instruct:free',
    company: 'Meta',
    name: 'Llama 3.2 3B (Free)',
    tier: 'fast',
    label: 'Rápido',
    description: 'Ultra-leve para prototipação e testes. Respostas básicas rápidas quando a prioridade é velocidade.',
    isFree: true,
    latencyTier: 'fast',
    latencyNote: 'Grátis: respostas geralmente em 2-5 segundos.'
  },

  // --- Raciocínio / Análise ---
  {
    id: 'qwen/qwen3-next-80b-a3b-instruct:free',
    company: 'Qwen',
    name: 'Qwen3 Next 80B (Free)',
    tier: 'powerful',
    label: 'Poderoso',
    description: 'Raciocínio avançado gratuito. Ideal para análise, planejamento e tarefas que exigem lógica complexa.',
    isFree: true,
    latencyTier: 'slow',
    latencyNote: 'Grátis + raciocínio: respostas podem levar 15-40 segundos.'
  },
];

// ==================== UTILITÁRIOS ====================

// Filtrar apenas modelos gratuitos
const getFreeModels = () => AI_MODELS.filter(m => m.isFree);

// Filtrar apenas modelos pagos
const getPaidModels = () => AI_MODELS.filter(m => !m.isFree);

// Filtrar modelos por velocidade (latencyTier)
const getModelsByLatency = (tier) => AI_MODELS.filter(m => m.latencyTier === tier);

// Obter mensagem de latência formatada para UI (PT-BR)
const formatLatencyNote = (model) => {
  if (!model) return '';
  const tier = model.latencyTier || '';
  // Prefer explicit note when available
  if (model.latencyNote && String(model.latencyNote).trim()) {
    const icon = tier === 'slow' ? '⏱️ ' : (tier === 'fast' ? '⚡ ' : '⏱️ ');
    let note = `${icon}${model.latencyNote}`;
    if (tier === 'slow') note += ' • Paciência é virtude ✨';
    return note;
  }

  // Fallbacks by tier (PT-BR)
  if (tier === 'fast') return `⚡ Rápido: respostas geralmente em 1-3 segundos.`;
  if (tier === 'medium') return `⏱️ Médio: respostas geralmente em 3-8 segundos.`;
  if (tier === 'slow') return `⏱️ Lento: respostas podem levar vários segundos. • Paciência é virtude ✨`;
  return '';
};

// Sugerir modelo considerando latência como fator opcional
const suggestModelWithLatency = (taskType, preferFree = false, preferFast = false) => {
  let pool = preferFree ? getFreeModels() : AI_MODELS.slice();
  if (preferFast) pool = pool.filter(m => m.latencyTier !== 'slow');

  if (taskType === 'code') {
    return pool.find(m => m.id.includes('coder')) || pool.find(m => m.tier === 'powerful') || pool[0];
  }
  if (taskType === 'writing') {
    return pool.find(m => m.id.includes('gemma') || m.id.includes('minimax') || m.name.toLowerCase().includes('writing')) 
      || pool.find(m => m.tier === 'balanced') 
      || pool[0];
  }
  if (taskType === 'fast') {
    return pool.find(m => m.tier === 'fast') || pool[0];
  }
  if (taskType === 'reasoning') {
    return pool.find(m => m.id.includes('r1') || m.id.includes('nemotron') || m.id.includes('next')) 
      || pool.find(m => m.tier === 'powerful') 
      || pool[0];
  }
  return pool.find(m => m.tier === 'balanced') || pool[0];
};

// Buscar modelo por ID
const getModelById = (id) => AI_MODELS.find(m => m.id === id);

// Sugerir modelo por tarefa e preferência de custo
const suggestModel = (taskType, preferFree = false) => {
  const pool = preferFree ? getFreeModels() : AI_MODELS;
  
  if (taskType === 'code') {
    return pool.find(m => m.id.includes('coder') || m.name.toLowerCase().includes('coder')) 
      || pool.find(m => m.tier === 'powerful') 
      || pool[0];
  }
  if (taskType === 'writing') {
    return pool.find(m => m.id.includes('gemma') || m.id.includes('minimax') || m.name.toLowerCase().includes('writing')) 
      || pool.find(m => m.tier === 'balanced') 
      || pool[0];
  }
  if (taskType === 'fast') {
    return pool.find(m => m.tier === 'fast') || pool[0];
  }
  if (taskType === 'reasoning') {
    return pool.find(m => m.id.includes('r1') || m.id.includes('nemotron') || m.id.includes('next')) 
      || pool.find(m => m.tier === 'powerful') 
      || pool[0];
  }
  
  // Default: equilibrado ou primeiro disponível
  return pool.find(m => m.tier === 'balanced') || pool[0];
};

// Exportar para uso em outros módulos (Node.js/ESM)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AI_MODELS, getFreeModels, getPaidModels, getModelById, suggestModel, getModelsByLatency, formatLatencyNote, suggestModelWithLatency };
}
