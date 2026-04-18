# IMPLEMENTATION.md — Pendências e Specs Abertas

> Decisões arquiteturais e contexto geral estão em `CLAUDE.md`.
> Este arquivo existe enquanto houver specs ou pendências não implementadas.
> **Deletar quando todas as seções estiverem concluídas.**

---

## QA — Status (11 abr 2026)

| Item | Status |
|---|---|
| Troca de paleta | ✅ |
| Troca de pacote de fontes | ✅ |
| Herança na UI da plataforma (cores e tipografia) | ✅ |
| Zoom do viewer com paleta e fontes na primeira abertura | ✅ |
| Exportação PNG (desktop) | ✅ |
| Exportação PNG (mobile — iOS Safari) | ✅ fix 11 abr 2026 |
| Sub-tab Legenda (geração, textarea, copiar e salvar) | ✅ |
| Chaves órfãs sem UUID (`vars:`, `thread:`, `caption:`) | ✅ migração v2 corrigida |
| Componente `author-badge` (--sm em posts 1–8, --lg em post-9) | ✅ |
| `author-badge` sem chip/fundo, com contraste por tema do template | ✅ |
| Toggle de visibilidade do badge no viewer | ✅ |
| Sliders de foto (zoom, Y, X) para badge --lg | ✅ |
| Responsividade v2 (editor + viewer, mobile-first, scale robusto) | ✅ |

---

## Registro Técnico — Responsividade v2 (aplicado)

Resumo do que foi consolidado no módulo `posts-instagram`:

- Escopo: somente `posts-instagram/*` (sem alterar conteúdo dos `post-1..9`)
- Base mobile-first com tokens fluidos (`clamp`) e `dvh` fallback
- Editor com grid responsivo e modais adaptáveis em altura/largura
- Viewer com layout adaptativo (vertical no mobile, split no desktop)
- Scale do preview/zoom reforçado por `ResizeObserver` + `resize` + `orientationchange` + `visualViewport`

Padrões de UI adotados:

- `palette-bar` no desktop com grupos lado a lado (sem ocupar 100% cada)
- campos de paleta em `2 colunas` (`.palette-grid`)
- campos de escala tipográfica em `2 colunas` (`.font-scale-grid`)

Lição principal:

- Para barras com chips/swatches, o resultado estável vem de combinar:
  - `layout desktop explícito`
  - `largura por conteúdo nos grupos`
  - `regras de não quebra apenas onde necessário`
  - fallback de overflow horizontal quando a largura de janela for limítrofe

---

## Roadmap Imediato (próximas features, em ordem de prioridade)

### R1) Novos formatos de canvas (Stories, 1:1, Landscape)

A arquitetura atual já é um sistema de "canvas + template" — posts são arquivos HTML com dimensões fixas (1080×1350) consumindo CSS vars. Basta generalizar:

- **Registro de formatos** em `config.js`: `CANVAS_FORMATS = { feed: {w:1080,h:1350}, stories: {w:1080,h:1920}, square: {w:1080,h:1080}, landscape: {w:1080,h:608} }`
- **Templates por formato**: `post-N-stories.html`, `post-N-square.html` — mesma estrutura de `data-var`, CSS vars herdadas
- **Seletor de formato** no viewer ou no dashboard: troca as dimensões do iframe e carrega o template correspondente
- **Exportação PNG** já funciona; só precisa ajustar as dimensões do frame

### R2) Onboarding de contexto do usuário

Antes de criar qualquer conteúdo, o app coleta o contexto do usuário para alimentar todos os prompts de IA:

- **Fluxo**: modal wizard em `index.html` na primeira abertura (ou via botão "Configurar projeto")
- **Campos**: nicho/produto, CTA principal (mentoria, e-book, empresa), tom de voz, nome, handle, site
- **Persistência**: `posts-ig:{UUID}:onboarding` em localStorage (futuramente Supabase)
- **Impacto nos prompts**: `AI_PROMPTS.content` e `AI_PROMPTS.research` recebem o contexto do onboarding como `userSection` automático em cada chamada
- **Exibição**: badge de contexto no header do dashboard ("Projeto: Mentoria · Nicho: Fé & Coaching")

### R3) Criador de Páginas de Sites e Landing Pages

**Visão**: o mesmo paradigma do criador de posts — canvas + template + editor de vars + exportação — aplicado a páginas web e seções de LP. Posts são templates de conteúdo; seções de site são templates de layout. A diferença é só o tamanho do canvas e o tipo de output (PNG + HTML vs. só HTML).

**Arquitetura proposta** (a confirmar no brainstorm):

```
/sites-creator/
├── index.html          # Dashboard de projetos de site
├── viewer.html         # Editor de seção (igual ao viewer de posts)
├── config.js           # Compartilha PROJECT_UUID e AI_PROMPTS com posts
├── main.css            # Tokens globais (reutilizar os mesmos de posts)
├── sections/
│   ├── hero-1.html     # Template de seção Hero (variante 1)
│   ├── hero-2.html     # Template de seção Hero (variante 2)
│   ├── features-1.html # Grade de features/benefícios
│   ├── testimonials-1.html
│   ├── cta-1.html
│   └── ...             # Um arquivo por template de seção
└── pages/
    ├── lp-mentoria-1.html  # LP completa = composição de seções
    └── ...
```

**Componentes compartilhados com posts-instagram**:
- `author-badge` (via `main.css`) — já pronto; sem fundo/chip e com contraste controlado por `--c-author-badge-text` / `--c-author-badge-muted` em cada template
- Design tokens CSS vars (`--c-*`, `--ff-*`, `--fs-*`) — já pronto
- Sistema de paleta e tipografia — já pronto
- Integração com IA (OpenRouter) — já pronto
- `awesome-design-md/` como referência de design systems — já clonado

**Flow do usuário**:
1. Onboarding → contexto do projeto (R2)
2. Dashboard unificado → abas "Posts" / "Stories" / "Site"
3. Aba "Site" → galeria de templates de seção → abre viewer
4. Viewer de seção → editar vars → copiar HTML limpo ou exportar como PNG para preview

**Output da seção**: HTML limpo (sem o viewer, sem a UI de edição) — pronto para copiar em qualquer site.

**Referência de design systems**: `awesome-design-md/` contém os padrões de Airbnb, Apple, Figma, Linear, Notion, Framer e outros — usar como referência ao criar os templates de seção.

### R4) Dashboard unificado com abas por tipo de conteúdo

- Aba **Posts** (feed Instagram — atual)
- Aba **Stories** (9:16 — após R1)
- Aba **Site** (seções e LPs — após R3)
- Header fixo com: logo, abas, botão de Configurações (onboarding + paleta + fontes + API key)

### R5) CRUD de system prompts na UI

- Registry atual tem `content`, `palette`, `fontpack`, `research`
- Próximo passo: permitir CRUD de novos prompts na UI sem expor os de paleta/fontpack por padrão

### R6) Exportar / importar configuração completa

- Botão em Configurações que exporta todas as chaves `posts-ig:{UUID}:*` relevantes como `.json`
- Importação: upload do arquivo → sobrescreve chaves no `localStorage` → recarrega a UI
- Na fase SaaS, vira sync entre dispositivos

---

## Direção SaaS (próximo grande passo)

O projeto será publicado como SaaS multi-tenant. Decisões atuais foram tomadas considerando essa migração:

- `PROJECT_UUID` hardcoded → virá da sessão autenticada (`user.currentProjectId`)
- Configs em `localStorage` → migrarão para banco em nuvem (Supabase/Postgres)
- Stack cogitada: Node/Bun + Hono ou Next.js API routes; Supabase Auth; deploy Vercel + Supabase

---

**Última atualização:** 11 de abril de 2026
