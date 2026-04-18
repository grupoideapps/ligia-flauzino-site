# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Visão Geral

Editor de posts para Instagram com geração de copy assistida por IA. Aplicação web estática (HTML/CSS/JS vanilla) — sem bundler, sem framework, sem etapa de build.

- **Provedor de IA**: OpenRouter (não OpenAI direto) — qualquer modelo do `AI_MODELS` pode ser selecionado na UI
- **Persistência**: `localStorage` com chaves `posts-ig:{UUID}:*`
- **Exportação**: PNG via `html2canvas` (CDN em `viewer.html`). Download usa `canvas.toBlob()` + `URL.createObjectURL()` — não usar `toDataURL()`, pois `data:` URIs não disparam download no iOS Safari

### Estado Atual do Produto

O fluxo principal já está funcional ponta a ponta:

- Dashboard com seleção de post, gerenciamento de paletas, pacotes de fontes, modelo de IA e configurações do projeto
- Viewer com edição inline do conteúdo, zoom, exportação PNG e persistência por template
- Herança de paleta e tipografia entre dashboard e posts, com toggles independentes para a UI da plataforma
- Geração de copy do post e geração de legenda via IA, incluindo fluxo dedicado de legenda no viewer
- Sistema de identidade visual compartilhado entre os templates, com componentes comuns como `author-badge` e tokens globais em `main.css`
- Controles de visibilidade e enquadramento da foto do badge no viewer

---

## Desenvolvimento Local

```bash
python3 -m http.server 8000
# Abrir http://localhost:8000/clients/ligia-flauzino/website/apps/posts-instagram/
```

Sem reload automático — recarregue manualmente o navegador após edições.

---

## Arquitetura

### Fluxo de telas

```text
index.html  →  viewer.html?post=post-N.html
(dashboard)     (editor de post individual)
```

`index.html` exibe cards para cada post. Ao clicar, abre `viewer.html` na mesma aba passando `?post=post-N.html`.

`viewer.html` carrega o post em um `<iframe>` e injeta overrides de paleta/fonte via `contentDocument`. O zoom abre um segundo iframe (`zoomFrame`) — overrides precisam ser reaplicados após o iframe do zoom disparar o evento `load` (flag `dataset.loaded` controla isso).

### Padrão de Responsividade (oficial)

Diretriz aplicada neste projeto após ajustes do módulo `posts-instagram`:

- Estratégia **mobile-first** com breakpoints em `min-width` (`640`, `768`, `1024`, `1280`)
- Base com tokens fluidos (`clamp`) para spacing/tipografia e `100dvh` com fallback `100vh`
- Container queries quando útil, com fallback para media query via `@supports not (container-type: inline-size)`
- Evitar `width` rígido em blocos de UI; preferir `auto-fit/minmax` para grids

Regras práticas importantes:

- **Editor (`index.html`)**
  - `palette-bar`: no desktop, grupos lado a lado; em tablet/mobile mantém comportamento adaptativo
  - `theme-group`: não deve expandir 100% por padrão em desktop
  - grids específicas de formulário (`palette-grid`, `font-scale-grid`) podem ficar em 2 colunas, sem afetar outros formulários
- **Viewer (`viewer.html`)**
  - mobile: fluxo vertical (preview acima, edição abaixo)
  - desktop: split em colunas
  - preview 1080x1350 sempre por escala (não mudar dimensão do template)
- **Escala (JS)**
  - sempre recalcular em `resize`, `orientationchange`, `ResizeObserver` e `visualViewport` (quando houver)
  - aplicar clamp de escala para evitar clipping/escala inválida

### Ordem de carregamento de scripts (obrigatória)

```text
config.js  →  models.js  →  editor.js  (em index.html)
config.js  →  models.js  →  viewer.js  (em viewer.html)
```

Alterar essa ordem quebra o acesso a `PROJECT_UUID` e `AI_MODELS`.

### Arquivos centrais

| Arquivo | Responsabilidade |
| --- | --- |
| `config.js` | `PROJECT_UUID`, `AI_PROMPTS`, helpers de tipografia, `buildAIChatRequest()`, `logAICall()`, migração de chaves localStorage |
| `models.js` | `AI_MODELS` — lista de modelos OpenRouter disponíveis; não é específico do cliente |
| `editor.js` | Lógica do dashboard: CRUD de paletas, CRUD de pacotes de fontes, seleção de modelo, configurações do projeto |
| `viewer.js` | Lógica do viewer: injeção de overrides no iframe, edição inline de texto, geração de copy por IA, streaming/cancelamento de legenda, exportação PNG |
| `main.css` | Tokens globais de cor (`--c-*`), tipografia (`--ff-*`, `--fs-*`) e componentes compartilhados como `author-badge` |
| `post-N.html` | Templates dos posts (1080×1350px fixo) — consomem apenas variáveis CSS de `main.css` |

### Isolamento de projeto via UUID

Todas as chaves de `localStorage` seguem `posts-ig:{UUID}:*`.

- `PROJECT_UUID` está hardcoded em `config.js` como placeholder — substituir pelo UUID real gerado pelo back-end quando houver autenticação.
- Na primeira abertura, `config.js` migra automaticamente chaves antigas (`posts-ig:<chave>` sem UUID) para o novo formato e remove as antigas. Executa uma única vez por UUID (flag `posts-ig:{UUID}:migrated-v1`).

### Paleta e tipografia global

Posts **sempre** herdam paleta e fontes. A UI da plataforma herda condicionalmente:

| Toggle | Chave localStorage |
| --- | --- |
| Plataforma herda paleta | `posts-ig:{UUID}:platform-inherit` |
| Plataforma herda tipografia | `posts-ig:{UUID}:platform-font-inherit` |

A injeção de overrides nos iframes ocorre em `viewer.js` via `injectOverrides()` → `applyVars(saved)`. O `storage` event no viewer reage a mudanças externas feitas no dashboard.

### Tipografia dinâmica

- Fontes sugeridas pela IA são carregadas via `<link>` dinâmico no `<head>` pelo `ensureGoogleFontsLoaded()` em `config.js`.
- Fontes de sistema funcionam sem CDN.
- `normalizeFontpack()` em `config.js` garante stacks CSS válidas e ajusta escala por tipo de fonte (ver `FONT_SCALE_TONE_BIAS`).
- Regra crítica: `headingFamily`/`bodyFamily` não podem conter palavras de peso (`bold`, `regular`, etc.) — apenas o nome da família e o generic fallback.

### Integração com IA

- Toda chamada usa `buildAIChatRequest({ model, systemPrompt, userSections, responseFormat, stream })` de `config.js`.
- `systemPrompt` = prompt fixo por finalidade; o usuário pode sobrescrever apenas o de conteúdo via "Configurações do Projeto".
- `userSections` = array de `{ title, content }` com o contexto variável da chamada.
- `stream` é opcional e hoje é usado apenas na geração de legenda do viewer.
- Logger: `logAICall(feature, details)` imprime `curl` equivalente + retorno bruto da API. Desabilitável via `posts-ig:{UUID}:ai-debug = '0'`.
- API key salva em `posts-ig:{UUID}:apikey`. Sem chave: todos os botões de IA ficam desabilitados.

### Modelos de IA

- `models.js` centraliza o catálogo exibido na UI e os helpers de seleção/sugestão.
- Modelos gratuitos continuam sujeitos a indisponibilidade temporária, fila compartilhada e rate limit do provider.

**Tipos de prompt em `AI_PROMPTS`:**

| Chave | Finalidade | Editável pelo usuário? |
| --- | --- | --- |
| `content` | Copy de post e legenda | Sim — via "Configurações do Projeto" |
| `palette` | Sugestão de paleta de cores | Não |
| `fontpack` | Sugestão de pacote de fontes | Não |
| `research` | Pesquisa editorial de conteúdo (usa scripts Python como ferramentas) | Não |

### Templates de post (`post-N.html`)

- Dimensões fixas: **1080×1350px** (portrait Instagram).
- Consomem apenas variáveis CSS de `main.css` — sem estilos hardcoded de cor ou fonte.
- Papel tipográfico: `h1`, `h2`, `h3`, `kicker`, `body`, `block`, `meta`, `cta` — cada post mapeia seus seletores locais para esses papéis via variáveis `--ff-*` e `--fs-*`.
- `author-badge` é o principal componente compartilhado entre os templates, com variações de tamanho e contraste adaptadas ao contexto visual de cada layout.

---

## Sistema de IA — Prompts

Os prompts em `AI_PROMPTS` seguem a estrutura **ROLE / TASK / TOOLS / CONTEXT / SPECIFICS / NOTES**. Nunca misturar prompt fixo (system) com dados variáveis (user sections).

O arquivo `commands/prompt-creator.md` é uma skill de engenharia de prompts para uso no Claude Code — não é carregado pela aplicação.

### Viewer — Fluxo de legenda

- A aba "Legenda" em `viewer.html`/`viewer.js` é um fluxo separado da edição do post.
- A geração de legenda já suporta streaming, cancelamento e fallback quando o provider/modelo não entrega stream útil.
- O tratamento de erro deve continuar amigável na UI, especialmente em indisponibilidade de modelos gratuitos ou rate limit.

### Modais de paleta e pacote de fontes

Cada modal tem duas views internas: **formulário** (criar/editar) e **lista** (todos os itens). Regras críticas:

- O rodapé com `Cancelar / Salvar` é **ocultado automaticamente** ao entrar na view de lista.
- `saveEditor()` só executa quando o modal está na view de formulário — impede que uma exclusão feita na lista seja seguida por um `Salvar` que recria o item com os valores pré-preenchidos.
- Os toggles de herança ("Plataforma herda…") ficam no **final de cada modal**, não no modal de Configurações.

---

## Mapa de chaves localStorage (objeto `LS`)

Ambos `editor.js` e `viewer.js` definem um objeto `LS` local com o mesmo shape — prefixo `posts-ig:{UUID}`. Ao adicionar novas chaves, adicionar nas duas definições:

| Chave LS | Padrão | Descrição |
| --- | --- | --- |
| `vars(f)` | função | Variáveis CSS do post `f` (paleta + tipografia aplicadas) |
| `caption(f)` | função | Legenda salva do post `f` |
| `thread(f)` | função | Histórico de mensagens de IA do post `f` |
| `photo(f)` | função | Foto do badge no post `f` (base64) |
| `palette` | string | Paleta ativa (JSON serializado) |
| `palettes` | string | Array de paletas salvas |
| `fontpack` | string | Pacote tipográfico ativo |
| `fontpacks` | string | Array de pacotes salvos |
| `apikey` | string | API key OpenRouter |
| `aimodel` | string | Modelo de IA selecionado |
| `platform-inherit` | string | Toggle: plataforma herda paleta |
| `platform-font-inherit` | string | Toggle: plataforma herda tipografia |
| `ui-theme` | string | Tema da UI da plataforma |
| `badge-name` / `badge-handle` | string | Dados do autor do badge |
| `model-filter` | string | Filtro de modelos na UI |

---

## Roadmap e Pendências

Ver `IMPLEMENTATION.md` para o roadmap priorizado (R1–R6) e o status de QA. As próximas features em ordem de prioridade são:

1. **R1** — Novos formatos de canvas (Stories 9:16, Square 1:1, Landscape)
2. **R2** — Onboarding de contexto do usuário (nicho, CTA, tom de voz)
3. **R3** — Criador de seções de site / landing pages
4. **R4** — Dashboard unificado com abas por tipo de conteúdo
5. **R5** — CRUD de system prompts na UI
6. **R6** — Exportar/importar configuração completa como JSON

**Direção SaaS**: `PROJECT_UUID` hardcoded migrará para sessão autenticada; `localStorage` migrará para banco em nuvem (stack cogitada: Supabase + Vercel).
