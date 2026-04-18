# CLAUDE.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) para trabalhar com código neste repositório.

## Visão Geral do Projeto

**Lígia Flauzino** é um website estático para uma escritora espiritual, analista comportamental e coach de vida. O site é construído com HTML, CSS e JavaScript vanilla — sem ferramentas de build ou frameworks.

- **Cliente**: Lígia Flauzino (ligiacoelhoflauzino@gmail.com | WhatsApp: 21 968791867)
- **Arquitetura**: Sistema de componentes JS vanilla + Anime.js v4 para animações
- **Entrega**: Arquivos estáticos diretos (sem bundler, sem etapa de build)
- **Subdiretório-chave**: `../posts-instagram/` — Editor de posts do Instagram com geração de copy assistida por IA (ver seção abaixo e README na pasta)

---

## Arquitetura e Arquivos-Chave

### Estrutura Principal

```
.
├── index.html                # Página inicial (hero, serviços, depoimentos, CTA)
├── sobre.html                # Página sobre
├── livros.html               # Vitrine de livros
├── contato.html              # Página de contato
├── style.css                 # Sistema de design (cores, tipografia, componentes)
├── website.css               # Estilos específicos do site (nav, layouts, utilidades)
├── components.js             # Nav, footer, modais, injeção de formulário
├── animations.js             # Timelines Anime.js v4 (módulo ES6)
├── assets/                   # Imagens, logos, fontes
├── servicos/                 # Páginas de serviços (analise-de-perfil, mentorias, palestras)
├── ../posts-instagram/       # Editor de posts do Instagram (app irmã de `site`)
└── entrega-mentoria/         # Entregáveis de marketing (docs de estratégia, copy)
```

### Componentes Críticos

**components.js** — Injeta elementos reutilizáveis:
- Navegação (`.site-nav`) — header sticky com hambúrguer mobile, injetado em `#nav-root`
- Footer (`.site-footer`) — injetado em `#footer-root`
- Modal de mentoria (`.mentoria-modal`) — formulário WhatsApp
- Funções: `renderTestimonials()`, `renderCTASection()`, `renderPageHero()`, `initMentoria()`
- Integração WhatsApp: dados do formulário codificados e enviados para `https://wa.me/5521968791867?text=...`

**animations.js** — Módulo ES6 importando Anime.js v4:
- `initHeroTimeline()` — stagger do hero da página inicial
- `initPageHeroAnimation()` — páginas internas
- `initScrollReveals()` — reveals ao scroll com stagger
- `initCardStagger()` — animações de grid
- `initButtonHover()` — efeitos de botão
- `initWhatsAppFloat()` — botão flutuante WhatsApp
- Respeita `prefers-reduced-motion` para acessibilidade

**style.css** — Sistema de design da marca:
- Propriedades customizadas CSS (ex: `--color-primary-gold: #C5A880`)
- Tipografia (Playfair Display, Work Sans, custom "Dream Avenue")
- Padrões de componentes (botões, cards, formulários)
- Sem framework (CSS puro)

**website.css** — Estilos específicos do site e layouts (nav sticky, hero, grid de serviços, etc.)

---

## Fluxo de Desenvolvimento

### Sem Ferramentas de Build
Os arquivos são servidos **diretamente** — não há webpack, Vite ou bundler. Toda mudança em HTML, CSS ou JS é refletida imediatamente ao recarregar o navegador.

### Desenvolvimento Local
```bash
# Opção 1: Servidor HTTP Python (Python 3)
python3 -m http.server 8000

# Opção 2: Node http-server
npx http-server

# Opção 3: Usar extensão de navegador (Live.js, Live Server, etc.)
```

Depois abra `http://localhost:8000` e navegue para qualquer página.

### Testes
- **DevTools do Navegador** — Abra `F12` / `⌘+Option+I` para debugar:
  - Console: verifique erros JS
  - Network: verifique carregamento de assets
  - Application → LocalStorage: verifique estado do formulário na ferramenta `../posts-instagram/`
- **Mobile**: Use emulação de dispositivo do navegador (iPhone/Android) para testes responsivos
- **Sem testes unitários** — validação é manual no navegador

---

## Arquitetura CSS

### Paleta de Cores (em `style.css`)
```css
--color-primary-gold: #C5A880        /* Cor principal da marca */
--color-primary-slate: #5D6D7E       /* Secundária */
--color-secondary-rose: #E8C4D0
--color-secondary-cream: #F5EBE0
--color-secondary-sage: #A8B8A8
--color-dark: #1A1A1A
--color-error: #E57373               /* Usado em validação de formulário */
```

### Classes de Componentes-Chave
- `.btn-hero-primary` / `.btn-hero-secondary` — Botões com efeitos hover
- `.service-card` — Cards no grid de serviços
- `.mentoria-modal` — Estilo do modal
- `.mentoria-form` — Layout do formulário e estados de validação
- `.reveal-on-scroll` — Elementos animados ao carregamento da página (via `initScrollReveals()`)
- `.site-nav` — Header sticky com backdrop blur

### Notas de Performance
- Animações limitadas a **< 300ms** (conforme diretrizes da marca)
- Lazy load de imagens com `loading="lazy"` em assets não críticos
- CSS transitions preferíveis a animações JS quando possível
- Minificar CSS/JS para produção (não feito atualmente — adicione se servir da CDN)

---

## Padrões JavaScript

### Injeção de Componentes
Componentes são injetados via `innerHTML` em divs placeholder:
```html
<div id="nav-root"></div>  <!-- Nav injetada aqui -->
<script>
    // components.js roda imediatamente (IIFE)
    // chama document.getElementById('nav-root').innerHTML = buildNav()
</script>
```

**Padrão:** `components.js` é uma função auto-executável. Não modifique sua estrutura IIFE ou a injeção quebra.

### Manipulação de Formulário
O formulário de mentoria (`#mentoriaForm`) usa:
- **Validação em tempo real** — campos atualizam classe `.is-valid` / `.is-invalid` ao input
- **Botão desabilitado** — botão submit desabilitado até todos os campos passarem na validação
- **Sem backend** — dados do formulário enviados diretamente para WhatsApp via `window.open(wa_url)`
- **localStorage** — estado do formulário NÃO persistido (apenas editor de posts Instagram usa localStorage)

### Animações
Todas as animações da página estão em `animations.js` e são disparadas em `DOMContentLoaded`:
```js
document.addEventListener('DOMContentLoaded', () => {
    initHeroTimeline();
    initScrollReveals();
    // ... etc
});
```

**Anime.js v4 importado via CDN:**
```js
import { createTimeline, animate, stagger }
    from 'https://cdn.jsdelivr.net/npm/animejs@4.0.2/lib/anime.esm.min.js';
```

---

## Tarefas Comuns

### Adicionar Nova Página
1. Crie `new-page.html` na raiz
2. Adicione link em `components.js` → array de links de `buildNav()`
3. Injete nav e footer:
   ```html
   <div id="nav-root"></div>
   <div id="footer-root"></div>
   <script src="./components.js"></script>
   ```
4. Importe módulo de animações e chame funções de inicialização:
   ```html
   <script type="module">
       import { initPageHeroAnimation, initScrollReveals } from './animations.js';
       document.addEventListener('DOMContentLoaded', () => {
           initPageHeroAnimation();
           initScrollReveals();
       });
   </script>
   ```

### Modificar a Navegação
- Edite `buildNav()` em `components.js` (linhas 43–99)
- Altere links, branding ou estilo
- Sem rebuild necessário — recarregue o navegador para ver mudanças

### Adicionar Validação de Formulário
- Validadores do formulário definidos em `initMentoria()` (linhas 183–190 em `components.js`)
- Validadores retornam booleano; campos recebem classes `.is-valid` ou `.is-invalid`
- Estilo em `website.css` (procure por `.mentoria-field.is-valid`)

### Mudanças de Estilo
- Estilos globais → `style.css` (sistema de design)
- Específicos da página → `website.css`
- Timing de animações → `animations.js` (durações e delays do Anime.js)

### Adicionar Animações
1. Crie elementos com seletor compartilhado (ex: `.my-elements`)
2. Adicione função a `animations.js`:
   ```js
   export function initMyAnimation() {
       if (prefersReduced) return; // respeite a11y
       const tl = createTimeline({ defaults: { ease: 'outQuart' } });
       tl.add('.my-elements', { opacity: [0, 1], duration: 600 }, 0);
   }
   ```
3. Chame na função `DOMContentLoaded` da página

---

## Diretrizes de Performance e Otimização

1. **Mantenha animações abaixo de 300ms** — padrão da marca
2. **Sem delays JavaScript** — `setTimeout` raramente necessário para interações do usuário
3. **Use CSS transitions para hover states** — evite efeitos hover acionados por JS
4. **Lazy load de imagens** → `<img loading="lazy" />`
5. **Minifique para produção** — atualmente arquivos não estão minificados; considere adicionar etapa de build se necessário
6. **Teste em mobile** — breakpoints responsivos definidos em CSS

---

## Acessibilidade

- **Labels ARIA** em elementos interativos (veja nav e modal em `components.js`)
- **HTML Semântico** — `<nav>`, `<footer>`, `<section>`, `role="menuitem"`, etc.
- **Suporte a Teclado** — ordem de Tab, Escape para fechar modais
- **Contraste de Cores** — Dourado (#C5A880) em fundos escuros atende WCAG AA
- **Movimento Reduzido** — Anime.js verifica `prefers-reduced-motion` e pula animações se habilitado

---

## Limitações e Peculiaridades Conhecidas

1. **Sem backend** — Todos os envios de formulário vão para WhatsApp. Sem encaminhamento de email ou armazenamento em banco de dados.
2. **localStorage apenas para editor de posts Instagram** — Site principal não usa armazenamento do navegador.
3. **Dependência de CDN** — Anime.js carregado do jsDelivr. Se CDN cair, animações falham silenciosamente.
4. **Menu mobile** — Animações do hambúrguer usam stroke-dasharray; teste em múltiplos navegadores se alterar.
5. **z-index da nav sticky** — Definido como `1100` para ficar acima de modais (`z-index: 1000`).

---

## Ferramentas e Recursos

- **Fontes**: Google Fonts (Playfair Display, Work Sans) + custom Dream Avenue (em `/assets/`)
- **Ícones**: SVG sprite inline em `components.js` (sem biblioteca de ícones, todos desenhados customizados)
- **Animações**: Anime.js v4 (módulo ES6 via CDN)
- **Deployment**: Arquivos estáticos — podem ser servidos por qualquer host web (Vercel, Netlify, GitHub Pages, hosting tradicional)

---

## Notas Importantes para Desenvolvedores Futuros

- **Não adicione ferramentas de build a menos que necessário** — este é um site estático de baixa manutenção
- **Mantenha component.js como uma IIFE** — é projetado para auto-executar ao carregar a página
- **Teste validação de formulário** em navegadores diferentes (Chrome, Safari, Firefox) — validação de email HTML5 se comporta diferentemente
- **Editor de posts Instagram é auto-contido** — veja `../posts-instagram/README.md` para detalhes desse subsistema
- **Faça backup de dados `localStorage`** se trabalhar no editor de posts — é o único armazenamento persistente no projeto

---

## Editor de Posts Instagram (`../posts-instagram/`)

### Arquitetura de Scripts

Ordem de carregamento obrigatória em `index.html` e `viewer.html`:
```
config.js → models.js → editor.js / viewer.js
```

| Arquivo | Responsabilidade |
|---|---|
| `config.js` | `PROJECT_UUID` + migração de chaves localStorage + helpers de tipografia + logger de IA |
| `models.js` | `AI_MODELS` — global, não muda por projeto |
| `editor.js` | Dashboard (index.html) — paletas, fontes, IA |
| `viewer.js` | Viewer de post — overrides de iframe, zoom, edição inline |

### Isolamento de Configurações por UUID

Todas as chaves de `localStorage` seguem o padrão `posts-ig:{UUID}:*` (ex: `posts-ig:{UUID}:palette`).

- `PROJECT_UUID` está hardcoded em `config.js` como placeholder temporário — substituir pelo UUID real gerado pelo back-end quando o SaaS for implementado.
- Na primeira abertura após a mudança, `config.js` migra automaticamente chaves antigas (`posts-ig:*` sem UUID) para o novo formato e remove as antigas.

### Integração com IA (OpenRouter)

- Provedor: **OpenRouter** (não OpenAI direto) — modelo `openai/gpt-4o-mini`
- API key salva em `localStorage` via modal "Configurações do Projeto" (`index.html`)
- Sem API key: todos os botões de IA ficam desabilitados
- Padrão de chamada: `buildAIChatRequest(system, user)` definido em `config.js`
- Logger: imprime `curl` equivalente + retorno bruto da API (sem estado intermediário)
- Prompts separados por finalidade: `AI_PROMPTS.content`, `AI_PROMPTS.palette`, `AI_PROMPTS.fontpack`

### Herança Visual (Posts × Plataforma)

- **Posts**: sempre herdam paleta e fontes globais
- **Plataforma** (index/viewer): herança separada por toggle:
  - cores: `posts-ig:{UUID}:platform-inherit`
  - fontes: `posts-ig:{UUID}:platform-font-inherit`

### Tipografia Dinâmica

- Fontes sugeridas pela IA são carregadas dinamicamente via `<link>` no `<head>` (Google Fonts)
- Fontes de sistema funcionam sem CDN com fallback
- `normalizeFontpack()` em `config.js` ajusta escala tipográfica por tipo de fonte (display/serif = títulos maiores; sans/clean = mais contido; condensadas = corpo maior)

### Direção SaaS (Próximo Grande Passo)

O projeto será publicado como SaaS multi-tenant. Decisões atuais foram tomadas considerando essa migração:
- `PROJECT_UUID` hardcoded → virá da sessão autenticada (`user.currentProjectId`)
- Configs em `localStorage` → migrarão para banco em nuvem (Supabase/Postgres)
- Stack cogitada: Node/Bun + Hono ou Next.js API routes; Supabase Auth; deploy Vercel + Supabase

### Pendências Conhecidas

- Testes manuais de QA ainda não executados (troca de paleta, fontes, zoom, exportação PNG)
- Sub-tab "Legenda" na aba IA do viewer ainda não implementada (ver `IMPLEMENTATION.md` seção E para spec completa)
