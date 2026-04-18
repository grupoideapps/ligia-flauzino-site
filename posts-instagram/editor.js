(() => {
  'use strict';

  const POST_W = 1080;

  const P = `posts-ig:${PROJECT_UUID}`;
  const LS = {
    cfg:                `${P}:config`,
    palette:            `${P}:palette`,
    palettes:           `${P}:palettes`,
    fontpack:           `${P}:fontpack`,
    fontpacks:          `${P}:fontpacks`,
    typo:               `${P}:typography`,
    apiKey:             `${P}:apikey`,
    aiModel:            `${P}:aimodel`,
    platformInherit:    `${P}:platform-inherit`,
    platformFontInherit:`${P}:platform-font-inherit`,
    uiTheme:            `${P}:ui-theme`,
    badgeName:          `${P}:badge-name`,
    badgeHandle:        `${P}:badge-handle`,
  };

  const UI_DEFAULT = {
    accent: '#C5A880',
    bg: '#f5ebe0',
    text: '#2a1f14',
    textMuted: '#5D6D7E',
    fontHeading: "'Playfair Display', serif",
    fontBody: "'Work Sans', sans-serif",
  };

  const PRESET_PALETTES = [
    { id: 'warm', name: 'Quente', accent: '#C5A880', bgDark: '#0f0a08', bgLight: '#f5ebe0', textOnDark: '#f5f0e8', textOnLight: '#1A1A1A', textMuted: '#5D6D7E' },
    { id: 'blue', name: 'Azul', accent: '#7BA7BC', bgDark: '#080f18', bgLight: '#e8f0f5', textOnDark: '#e8f4f8', textOnLight: '#1A2030', textMuted: '#6080A0' }
  ];

  const SVG_THEME_LIGHT = `
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="2.5"/>
      <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06"/>
    </svg>`;

  const SVG_THEME_DARK = `
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="M11 2.5a5.5 5.5 0 1 0 2.5 9.8A6 6 0 1 1 11 2.5z"/>
    </svg>`;

  const SVG_CONFIG = `
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="M3 4h10M5 8h6M6 12h4"/>
      <circle cx="3" cy="4" r="1"/>
      <circle cx="11" cy="8" r="1"/>
      <circle cx="8" cy="12" r="1"/>
    </svg>`;

  const PRESET_FONTPACKS = [
    { id: 'classic', name: 'Clássico', headingFamily: "'Playfair Display', serif", bodyFamily: "'Work Sans', sans-serif", scale: { ...FONT_SCALE_REFERENCE } },
    { id: 'editorial', name: 'Editorial', headingFamily: 'Georgia, serif', bodyFamily: 'Helvetica, Arial, sans-serif', scale: { h1: 82, h2: 44, h3: 28, kicker: 21, body: 28, block: 34, meta: 20, cta: 21 } },
    { id: 'clean', name: 'Clean', headingFamily: 'Arial, sans-serif', bodyFamily: 'Arial, sans-serif', scale: { h1: 78, h2: 40, h3: 25, kicker: 21, body: 28, block: 31, meta: 19, cta: 20 } },
  ];

  const TYPO_KEYS = ['h1', 'h2', 'h3', 'kicker', 'body', 'block', 'meta', 'cta'];
  const TYPO_LABELS = {
    h1: 'Título principal (h1)',
    h2: 'Título secundário (h2)',
    h3: 'Título de bloco (h3)',
    kicker: 'Kicker / badge',
    body: 'Texto corrido',
    block: 'Destaque / citação',
    meta: 'Meta / logo',
    cta: 'CTA',
  };

  const posts = [
    { file: 'post-1.html', label: 'Template 1' },
    { file: 'post-2.html', label: 'Template 2' },
    { file: 'post-3.html', label: 'Template 3' },
    { file: 'post-4.html', label: 'Template 4' },
    { file: 'post-5.html', label: 'Template 5' },
    { file: 'post-6.html', label: 'Template 6' },
    { file: 'post-7.html', label: 'Template 7' },
    { file: 'post-8.html', label: 'Template 8' },
    { file: 'post-9.html', label: 'Template 9 — CTA Final' },
  ];

  const grid = document.getElementById('grid');
  const nodes = {
    swatches: document.getElementById('swatches'),
    fontpackSwatches: document.getElementById('fontpackSwatches'),
    overlay: document.getElementById('modalOverlay'),
    editorModal: document.getElementById('editorModal'),
    editorModalTitle: document.getElementById('editorModalTitle'),
    editorModalListToggle: document.getElementById('editorModalListToggle'),
    editorModalBody: document.getElementById('editorModalBody'),
    editorInheritPaletteRow: document.getElementById('editorInheritPaletteRow'),
    editorInheritFontRow: document.getElementById('editorInheritFontRow'),
    editorInheritHint: document.getElementById('editorInheritHint'),
    editorPlatformInherit: document.getElementById('editorPlatformInherit'),
    editorPlatformFontInherit: document.getElementById('editorPlatformFontInherit'),
    editorModalActions: document.getElementById('editorModalActions'),
    cfgBadgeName: document.getElementById('cfgBadgeName'),
    cfgBadgeHandle: document.getElementById('cfgBadgeHandle'),
    cfgSystemPrompt: document.getElementById('cfgSystemPrompt'),
    cfgContext: document.getElementById('cfgContext'),
    btnConfig: document.getElementById('btnConfig'),
    btnThemeToggle: document.getElementById('btnThemeToggle'),
    btnCancel: document.getElementById('btnCancel'),
    btnSave: document.getElementById('btnSave'),
    btnNewPaletteQuick: document.getElementById('btnNewPaletteQuick'),
    btnNewFontpackQuick: document.getElementById('btnNewFontpackQuick'),
    btnEditorCancel: document.getElementById('btnEditorCancel'),
    btnEditorSave: document.getElementById('btnEditorSave'),
  };

  grid.innerHTML = posts.map(p => `
    <div class="card">
      <iframe src="${p.file}" scrolling="no" loading="lazy"></iframe>
      <div class="card-label">${p.label}</div>
      <a href="viewer.html?post=${p.file}"></a>
    </div>`).join('');

  const cards = Array.from(grid.querySelectorAll('.card'));
  let editorState = null;
  let editorView = 'form';

  function hexToRgb(hex) {
    const h = String(hex || '').replace('#', '');
    return [parseInt(h.slice(0, 2), 16) || 0, parseInt(h.slice(2, 4), 16) || 0, parseInt(h.slice(4, 6), 16) || 0];
  }

  function shadeHex(hex, amt) {
    const [r, g, b] = hexToRgb(hex);
    return `rgb(${Math.max(0, Math.min(255, r + amt))},${Math.max(0, Math.min(255, g + amt))},${Math.max(0, Math.min(255, b + amt))})`;
  }

  function escHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function normalizePalette(palette, fallback = PRESET_PALETTES[0]) {
    const base = fallback || PRESET_PALETTES[0];
    return {
      id: palette.id || `custom-${Date.now()}`,
      name: palette.name || base.name || 'Custom',
      accent: palette.accent || base.accent || UI_DEFAULT.accent,
      bgDark: palette.bgDark || base.bgDark || '#0f0a08',
      bgLight: palette.bgLight || base.bgLight || UI_DEFAULT.bg,
      textOnDark: palette.textOnDark || base.textOnDark || '#f5f0e8',
      textOnLight: palette.textOnLight || base.textOnLight || UI_DEFAULT.text,
      textMuted: palette.textMuted || base.textMuted || UI_DEFAULT.textMuted,
    };
  }

  function normalizeFontpack(fontpack, fallback = PRESET_FONTPACKS[0]) {
    const base = fallback || PRESET_FONTPACKS[0];
    const scale = Object.assign({}, base.scale || {}, fontpack.scale || {});
    const recommended = getRecommendedFontScale(fontpack);
    TYPO_KEYS.forEach(key => {
      const fallbackValue = (base.scale && base.scale[key]) || FONT_SCALE_REFERENCE[key] || (key === 'h1' ? 80 : 24);
      const minValue = recommended[key] || FONT_SCALE_REFERENCE[key] || 8;
      const parsed = parseInt(scale[key], 10);
      scale[key] = Number.isFinite(parsed) ? Math.max(parsed, minValue) : Math.max(fallbackValue, minValue);
    });
    return {
      id: fontpack.id || `custom-${Date.now()}`,
      name: fontpack.name || base.name || 'Custom',
      headingFamily: normalizeFontFamilyStack(fontpack.headingFamily || base.headingFamily || UI_DEFAULT.fontHeading, 'sans-serif'),
      bodyFamily: normalizeFontFamilyStack(fontpack.bodyFamily || base.bodyFamily || UI_DEFAULT.fontBody, 'sans-serif'),
      scale,
    };
  }

  function legacyTypographyToScale(typo = {}) {
    return {
      h1: parseInt(typo.h1, 10) || 80,
      h2: parseInt(typo.h2, 10) || 42,
      h3: parseInt(typo.h3, 10) || 26,
      kicker: parseInt(typo.kicker, 10) || 18,
      body: parseInt(typo.body, 10) || 28,
      block: parseInt(typo.block, 10) || 32,
      meta: parseInt(typo.meta, 10) || 20,
      cta: parseInt(typo.cta, 10) || 21,
    };
  }

  function scaleToLegacyTypography(scale = {}) {
    return {
      h1: parseInt(scale.h1, 10) || 80,
      h2: parseInt(scale.h2, 10) || 42,
      h3: parseInt(scale.h3, 10) || 26,
      kicker: parseInt(scale.kicker, 10) || 18,
      body: parseInt(scale.body, 10) || 28,
      block: parseInt(scale.block, 10) || 32,
    };
  }

  function getPlatformInherit() {
    const raw = localStorage.getItem(LS.platformInherit);
    return raw === null ? true : raw === '1';
  }

  function getPlatformFontInherit() {
    const raw = localStorage.getItem(LS.platformFontInherit);
    return raw === null ? true : raw === '1';
  }

  function setPlatformInherit(enabled) {
    localStorage.setItem(LS.platformInherit, enabled ? '1' : '0');
  }

  function setPlatformFontInherit(enabled) {
    localStorage.setItem(LS.platformFontInherit, enabled ? '1' : '0');
  }

  function getUITheme() {
    const raw = localStorage.getItem(LS.uiTheme);
    return raw === 'dark' ? 'dark' : 'light';
  }

  function setUITheme(theme) {
    localStorage.setItem(LS.uiTheme, theme === 'dark' ? 'dark' : 'light');
  }

  function toggleUITheme() {
    setUITheme(getUITheme() === 'dark' ? 'light' : 'dark');
  }

  function getCustomPalettes() {
    return readJSON(LS.palettes, []).map(p => normalizePalette(p, PRESET_PALETTES[0]));
  }

  function getAllPalettes() {
    const custom = getCustomPalettes();
    const customById = new Map(custom.map(p => [p.id, p]));
    const merged = PRESET_PALETTES.map(p => customById.get(p.id) ? { ...customById.get(p.id), __kind: 'custom' } : { ...p, __kind: 'preset' });
    custom.forEach(p => {
      if (!PRESET_PALETTES.some(x => x.id === p.id)) merged.push({ ...p, __kind: 'custom' });
    });
    return merged;
  }

  function getActivePalette() {
    return normalizePalette(readJSON(LS.palette, PRESET_PALETTES[0]), PRESET_PALETTES[0]);
  }

  function setActivePalette(palette) {
    writeJSON(LS.palette, normalizePalette(palette, PRESET_PALETTES[0]));
  }

  function getCustomFontpacks() {
    return readJSON(LS.fontpacks, []).map(fp => normalizeFontpack(fp, PRESET_FONTPACKS[0]));
  }

  function getAllFontpacks() {
    const custom = getCustomFontpacks();
    const customById = new Map(custom.map(fp => [fp.id, fp]));
    const merged = PRESET_FONTPACKS.map(fp => customById.get(fp.id) ? { ...customById.get(fp.id), __kind: 'custom' } : { ...fp, __kind: 'preset' });
    custom.forEach(fp => {
      if (!PRESET_FONTPACKS.some(x => x.id === fp.id)) merged.push({ ...fp, __kind: 'custom' });
    });
    return merged;
  }

  function getActiveFontpack() {
    return normalizeFontpack(readJSON(LS.fontpack, PRESET_FONTPACKS[0]), PRESET_FONTPACKS[0]);
  }

  function setActiveFontpack(fontpack) {
    const normalized = normalizeFontpack(fontpack, PRESET_FONTPACKS[0]);
    writeJSON(LS.fontpack, normalized);
    writeJSON(LS.typo, scaleToLegacyTypography(normalized.scale));
  }

  function ensureBootstrap() {
    if (!localStorage.getItem(LS.uiTheme)) setUITheme('light');
  }

  function applyUITheme() {
    const palette = getPlatformInherit() ? getActivePalette() : PRESET_PALETTES[0];
    const fontpack = getPlatformFontInherit() ? getActiveFontpack() : PRESET_FONTPACKS[0];
    const uiTheme = getUITheme();
    const root = document.documentElement.style;
    const [r, g, b] = hexToRgb(palette.accent);
    const baseBg = uiTheme === 'dark' ? (palette.bgDark || '#111111') : (palette.bgLight || UI_DEFAULT.bg);
    const basePanel = uiTheme === 'dark' ? shadeHex(baseBg, 10) : shadeHex(baseBg, -8);
    const fieldBg = basePanel;
    const baseText = uiTheme === 'dark' ? (palette.textOnDark || '#f5f0e8') : (palette.textOnLight || UI_DEFAULT.text);
    const baseMuted = uiTheme === 'dark' ? 'rgba(245,240,232,0.72)' : (palette.textMuted || UI_DEFAULT.textMuted);
    root.setProperty('--ui-accent', palette.accent);
    root.setProperty('--ui-bg', baseBg);
    root.setProperty('--ui-bg-panel', basePanel);
    root.setProperty('--ui-field-bg', fieldBg);
    root.setProperty('--ui-field-text', baseText);
    root.setProperty('--ui-field-border', `rgba(${r},${g},${b},0.30)`);
    root.setProperty('--ui-text', baseText);
    root.setProperty('--ui-text-muted', baseMuted);
    root.setProperty('--ui-border', `rgba(${r},${g},${b},0.2)`);
    root.setProperty('--ui-border-med', `rgba(${r},${g},${b},0.3)`);
    root.setProperty('--ui-font-heading', getPlatformFontInherit() ? fontpack.headingFamily : UI_DEFAULT.fontHeading);
    root.setProperty('--ui-font-body', getPlatformFontInherit() ? fontpack.bodyFamily : UI_DEFAULT.fontBody);
    ensureGoogleFontsLoaded(document, [fontpack.headingFamily, fontpack.bodyFamily, UI_DEFAULT.fontHeading, UI_DEFAULT.fontBody]);
  }

  function renderThemeToggle() {
    const theme = getUITheme();
    nodes.btnThemeToggle.innerHTML = theme === 'dark' ? SVG_THEME_DARK : SVG_THEME_LIGHT;
    nodes.btnThemeToggle.setAttribute('aria-label', theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
    nodes.btnThemeToggle.setAttribute('title', theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
    nodes.btnThemeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }

  function renderConfigButton() {
    nodes.btnConfig.innerHTML = `${SVG_CONFIG}<span>Configurações</span>`;
  }

  function getPaletteFieldNodes() {
    return {
      name: document.getElementById('editorPaletteName'),
      accent: document.getElementById('editorPaletteAccent'),
      bgDark: document.getElementById('editorPaletteBgDark'),
      bgLight: document.getElementById('editorPaletteBgLight'),
      textOnDark: document.getElementById('editorPaletteTextDark'),
      textOnLight: document.getElementById('editorPaletteTextLight'),
      textMuted: document.getElementById('editorPaletteTextMuted'),
    };
  }

  function setPaletteSuggestEnabled() {
    const nameInput = document.getElementById('editorPaletteName');
    const aiBtn = document.getElementById('btnPaletteSuggest');
    if (!nameInput || !aiBtn) return;
    const hasKey = !!localStorage.getItem(LS.apiKey);
    aiBtn.disabled = !(nameInput.value.trim() && hasKey);
    aiBtn.title = hasKey ? 'Use o nome da paleta como direção para a IA sugerir cores' : 'Configure a chave de API nas Configurações do Projeto';
  }

  function setPaletteSuggestBusy(busy) {
    const aiBtn = document.getElementById('btnPaletteSuggest');
    if (!aiBtn) return;
    aiBtn.disabled = busy;
    aiBtn.classList.toggle('busy', busy);
    aiBtn.textContent = busy ? 'Sugerindo...' : 'Sugerir cores com IA';
  }

  function applyPaletteSuggestion(suggestion) {
    const fields = getPaletteFieldNodes();
    if (suggestion.accent) fields.accent.value = suggestion.accent;
    if (suggestion.bgDark) fields.bgDark.value = suggestion.bgDark;
    if (suggestion.bgLight) fields.bgLight.value = suggestion.bgLight;
    if (suggestion.textOnDark) fields.textOnDark.value = suggestion.textOnDark;
    if (suggestion.textOnLight) fields.textOnLight.value = suggestion.textOnLight;
    if (suggestion.textMuted) fields.textMuted.value = suggestion.textMuted;
  }

  async function suggestPaletteColors() {
    const fields = getPaletteFieldNodes();
    const paletteName = fields.name?.value.trim();
    if (!paletteName) return;

    const apiKey = localStorage.getItem(LS.apiKey) || '';
    if (!apiKey) {
      alert('Adicione sua chave de API do OpenRouter nas Configurações do Projeto.');
      return;
    }

    const cfg = readJSON(LS.cfg, {});
    const systemPrompt = AI_PROMPTS.palette;
    const context = cfg.context || '';

    setPaletteSuggestBusy(true);

    try {
      const request = buildAIChatRequest({
        model: getActiveModel(),
        systemPrompt,
        userSections: [
          { title: 'Contexto do projeto', content: context || '(sem contexto adicional)' },
          { title: 'Nome da paleta', content: paletteName },
          { title: 'Tarefa', content: `Crie uma paleta de cores para o nome informado que seja coerente e harmoniosa para posts de redes sociais que o usuário irá usar e de acordo com o Contexto do Projeto.` },
          { title: 'Regras de saída', content: 'Use cores hex válidas. Retorne somente JSON com as chaves: accent, bgDark, bgLight, textOnDark, textOnLight, textMuted. A paleta deve ser harmoniosa e apropriada para uma interface/editor com contraste legível.' },
        ],
        responseFormat: { type: 'json_object' },
      });

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': location.origin,
        },
        body: JSON.stringify(request),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      logAICall('palette-suggest', {
        apiKey,
        url: 'https://openrouter.ai/api/v1/chat/completions',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': location.origin,
        },
        request,
        response: data,
      });
      const content = data.choices?.[0]?.message?.content || '';
      const jsonStr = content.match(/```json\s*([\s\S]*?)\s*```/)?.[1] || content.match(/\{[\s\S]*\}/)?.[0];
      if (!jsonStr) throw new Error('A IA não retornou um JSON válido.');

      const suggestion = JSON.parse(jsonStr);
      applyPaletteSuggestion(suggestion);
    } catch (err) {
      alert(`Erro ao sugerir paleta: ${err.message}`);
    } finally {
      setPaletteSuggestBusy(false);
      setPaletteSuggestEnabled();
    }
  }

  function getFontpackFieldNodes() {
    const fields = {
      name: document.getElementById('editorFontpackName'),
      headingFamily: document.getElementById('editorFontpackHeadingFamily'),
      bodyFamily: document.getElementById('editorFontpackBodyFamily'),
    };
    TYPO_KEYS.forEach(key => { fields[key] = document.getElementById(`editorFontpack_${key}`); });
    return fields;
  }

  function setFontpackSuggestEnabled() {
    const nameInput = document.getElementById('editorFontpackName');
    const aiBtn = document.getElementById('btnFontpackSuggest');
    if (!nameInput || !aiBtn) return;
    const hasKey = !!localStorage.getItem(LS.apiKey);
    aiBtn.disabled = !(nameInput.value.trim() && hasKey);
    aiBtn.title = hasKey ? 'Use o nome do pacote como direção para a IA sugerir fontes' : 'Configure a chave de API nas Configurações do Projeto';
  }

  function setFontpackSuggestBusy(busy) {
    const aiBtn = document.getElementById('btnFontpackSuggest');
    if (!aiBtn) return;
    aiBtn.disabled = busy;
    aiBtn.classList.toggle('busy', busy);
    aiBtn.textContent = busy ? 'Sugerindo...' : 'Sugerir fontes com IA';
  }

  function applyFontpackSuggestion(suggestion) {
    const fields = getFontpackFieldNodes();
    if (suggestion.headingFamily) fields.headingFamily.value = suggestion.headingFamily;
    if (suggestion.bodyFamily) fields.bodyFamily.value = suggestion.bodyFamily;
    TYPO_KEYS.forEach(key => {
      if (suggestion[key] != null && fields[key]) fields[key].value = suggestion[key];
    });
  }

  async function suggestFontpackFonts() {
    const fields = getFontpackFieldNodes();
    const fontpackName = fields.name?.value.trim();
    if (!fontpackName) return;

    const apiKey = localStorage.getItem(LS.apiKey) || '';
    if (!apiKey) {
      alert('Adicione sua chave de API do OpenRouter nas Configurações do Projeto.');
      return;
    }

    const cfg = readJSON(LS.cfg, {});
    const systemPrompt = AI_PROMPTS.fontpack;
    const context = cfg.context || '';

    setFontpackSuggestBusy(true);

    try {
      const request = buildAIChatRequest({
        model: getActiveModel(),
        systemPrompt,
        userSections: [
          { title: 'Contexto do projeto', content: context || '(sem contexto adicional)' },
          { title: 'Nome do pacote de fontes', content: fontpackName },
          { title: 'Tarefa', content: 'Crie um pacote tipográfico consistente para o nome informado.' },
          { title: 'Regras de saída', content: 'Use famílias populares do Google Fonts ou fallbacks confiáveis. Os valores h1..cta devem ser tamanhos de fonte em pixels inteiros entre 8 e 220. Retorne somente JSON com headingFamily, bodyFamily, h1, h2, h3, kicker, body, block, meta e cta.' },
        ],
        responseFormat: { type: 'json_object' },
      });

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': location.origin,
        },
        body: JSON.stringify(request),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      logAICall('fontpack-suggest', {
        apiKey,
        url: 'https://openrouter.ai/api/v1/chat/completions',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': location.origin,
        },
        request,
        response: data,
      });
      const content = data.choices?.[0]?.message?.content || '';
      const jsonStr = content.match(/```json\s*([\s\S]*?)\s*```/)?.[1] || content.match(/\{[\s\S]*\}/)?.[0];
      if (!jsonStr) throw new Error('A IA não retornou um JSON válido.');

      const suggestion = JSON.parse(jsonStr);
      applyFontpackSuggestion(suggestion);
    } catch (err) {
      alert(`Erro ao sugerir fontes: ${err.message}`);
    } finally {
      setFontpackSuggestBusy(false);
      setFontpackSuggestEnabled();
    }
  }

  function renderSwatches() {
    const active = getActivePalette();
    const all = getAllPalettes();
    nodes.swatches.innerHTML = all.map(p => `<div class="swatch${p.id === active.id ? ' active' : ''}" data-id="${escHtml(p.id)}" style="background:${escHtml(p.accent)}" title="${escHtml(p.name)}"></div>`).join('');
    nodes.swatches.querySelectorAll('.swatch').forEach(btn => {
      btn.addEventListener('click', () => {
        const palette = all.find(p => p.id === btn.dataset.id);
        if (!palette) return;
        setActivePalette(palette);
        applyUITheme();
        renderSwatches();
        renderPaletteManager();
        updatePreviewIframes();
      });
    });
  }

  function renderFontpackSwatches() {
    const active = getActiveFontpack();
    const all = getAllFontpacks();
    nodes.fontpackSwatches.innerHTML = all.map(fp => `
      <button type="button" class="fontpack-chip${fp.id === active.id ? ' active' : ''}" data-id="${escHtml(fp.id)}" title="${escHtml(fp.headingFamily)} / ${escHtml(fp.bodyFamily)}">${escHtml(fp.name)}</button>
    `).join('');

    nodes.fontpackSwatches.querySelectorAll('.fontpack-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const fontpack = all.find(fp => fp.id === btn.dataset.id);
        if (!fontpack) return;
        setActiveFontpack(fontpack);
        applyUITheme();
        renderFontpackSwatches();
        renderFontpackManager();
        updatePreviewIframes();
      });
    });
  }

  function renderPaletteManager(target = document.getElementById('paletteManagerEditor')) {
    if (!target) return;
    const active = getActivePalette();
    const all = getAllPalettes();
    target.innerHTML = all.map(p => {
      const isPreset = p.__kind === 'preset';
      const isActive = active.id === p.id;
      return `
        <div class="collection-item${isActive ? ' active' : ''}">
          <div class="collection-head">
            <div>
              <div class="collection-title">${escHtml(p.name)}</div>
              <div class="collection-meta">${escHtml(p.accent)} · ${escHtml(p.bgLight)} · ${escHtml(p.textOnLight)}</div>
            </div>
            ${isActive ? '<span class="btn-mini primary" style="pointer-events:none;">Ativa</span>' : ''}
          </div>
          <div class="collection-actions">
            <button class="btn-mini primary" data-action="select-palette" data-id="${escHtml(p.id)}">Selecionar</button>
            <button class="btn-mini" data-action="edit-palette" data-id="${escHtml(p.id)}">Editar</button>
            <button class="btn-mini danger" data-action="delete-palette" data-id="${escHtml(p.id)}" ${isPreset ? 'disabled' : ''}>Excluir</button>
          </div>
        </div>`;
    }).join('');

    target.querySelectorAll('[data-action="select-palette"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const palette = all.find(p => p.id === btn.dataset.id);
        if (!palette) return;
        setActivePalette(palette);
        applyUITheme();
        renderSwatches();
        renderPaletteManager();
        updatePreviewIframes();
      });
    });

    target.querySelectorAll('[data-action="edit-palette"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const palette = all.find(p => p.id === btn.dataset.id);
        if (palette) openEditor('palette', palette);
      });
    });

    target.querySelectorAll('[data-action="delete-palette"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const palette = all.find(p => p.id === btn.dataset.id);
        if (!palette || palette.__kind === 'preset') return;
        if (!confirm(`Excluir a paleta "${palette.name}"?`)) return;
        const next = getCustomPalettes().filter(p => p.id !== palette.id);
        writeJSON(LS.palettes, next);
        if (getActivePalette().id === palette.id) setActivePalette(PRESET_PALETTES[0]);
        applyUITheme();
        refreshAllManagers();
      });
    });
  }

  function renderFontpackManager(target = document.getElementById('fontpackManagerEditor')) {
    if (!target) return;
    const active = getActiveFontpack();
    const all = getAllFontpacks();
    target.innerHTML = all.map(fp => {
      const isPreset = fp.__kind === 'preset';
      const isActive = active.id === fp.id;
      return `
        <div class="collection-item${isActive ? ' active' : ''}">
          <div class="collection-head">
            <div>
              <div class="collection-title">${escHtml(fp.name)}</div>
              <div class="collection-meta">${escHtml(fp.headingFamily)} / ${escHtml(fp.bodyFamily)}</div>
              <div class="collection-meta">H1 ${escHtml(fp.scale.h1)}px · Body ${escHtml(fp.scale.body)}px · CTA ${escHtml(fp.scale.cta)}px</div>
            </div>
            ${isActive ? '<span class="btn-mini primary" style="pointer-events:none;">Ativo</span>' : ''}
          </div>
          <div class="collection-actions">
            <button class="btn-mini primary" data-action="select-fontpack" data-id="${escHtml(fp.id)}">Selecionar</button>
            <button class="btn-mini" data-action="edit-fontpack" data-id="${escHtml(fp.id)}">Editar</button>
            <button class="btn-mini danger" data-action="delete-fontpack" data-id="${escHtml(fp.id)}" ${isPreset ? 'disabled' : ''}>Excluir</button>
          </div>
        </div>`;
    }).join('');

    target.querySelectorAll('[data-action="select-fontpack"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const fontpack = all.find(fp => fp.id === btn.dataset.id);
        if (!fontpack) return;
        setActiveFontpack(fontpack);
        applyUITheme();
        renderFontpackManager();
        updatePreviewIframes();
      });
    });

    target.querySelectorAll('[data-action="edit-fontpack"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const fontpack = all.find(fp => fp.id === btn.dataset.id);
        if (fontpack) openEditor('fontpack', fontpack);
      });
    });

    target.querySelectorAll('[data-action="delete-fontpack"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const fontpack = all.find(fp => fp.id === btn.dataset.id);
        if (!fontpack || fontpack.__kind === 'preset') return;
        if (!confirm(`Excluir o pacote de fontes "${fontpack.name}"?`)) return;
        const next = getCustomFontpacks().filter(fp => fp.id !== fontpack.id);
        writeJSON(LS.fontpacks, next);
        if (getActiveFontpack().id === fontpack.id) setActiveFontpack(PRESET_FONTPACKS[0]);
        applyUITheme();
        refreshAllManagers();
      });
    });
  }

  function openEditor(kind, item = null) {
    editorState = { kind, originalId: item?.id || null };
    editorView = 'form';
    nodes.editorModal.classList.add('open');
    document.body.classList.add('has-modal-open');
    if (nodes.editorModalActions) nodes.editorModalActions.style.display = 'flex';
    nodes.editorModalTitle.textContent = kind === 'palette' ? 'Nova Paleta' : 'Novo Pacote';
    nodes.editorModalTitle.classList.add('active');
    nodes.editorModalListToggle.classList.remove('active');
    nodes.editorModalListToggle.textContent = 'Opções';
    const showInherit = kind === 'palette' || kind === 'fontpack';
    nodes.editorInheritPaletteRow.style.display = kind === 'palette' ? 'flex' : 'none';
    nodes.editorInheritFontRow.style.display = kind === 'fontpack' ? 'flex' : 'none';
    nodes.editorInheritHint.style.display = showInherit ? 'block' : 'none';
    nodes.editorPlatformInherit.checked = getPlatformInherit();
    nodes.editorPlatformFontInherit.checked = getPlatformFontInherit();

    if (kind === 'palette') {
      const palette = normalizePalette(item || PRESET_PALETTES[0], PRESET_PALETTES[0]);
      nodes.editorModalBody.innerHTML = `
        <div id="editorPaletteForm" class="editor-panel active">
          <div class="name-row">
            <div class="modal-field">
              <label>Nome</label>
              <input type="text" id="editorPaletteName" value="${escHtml(palette.name)}" placeholder="Minha paleta">
            </div>
            <button type="button" class="btn-mini primary btn-ai-suggest" id="btnPaletteSuggest" disabled title="Use o nome da paleta como direção para a IA sugerir cores">Sugerir cores com IA</button>
          </div>
          <div class="form-grid palette-grid">
            <div class="modal-field"><label>Cor de destaque</label><div class="color-input-row"><input type="color" id="editorPaletteAccent" value="${escHtml(palette.accent)}"><input type="text" class="hex-input" data-for="editorPaletteAccent" value="${escHtml(palette.accent)}" maxlength="7" spellcheck="false"></div></div>
            <div class="modal-field"><label>Fundo escuro</label><div class="color-input-row"><input type="color" id="editorPaletteBgDark" value="${escHtml(palette.bgDark)}"><input type="text" class="hex-input" data-for="editorPaletteBgDark" value="${escHtml(palette.bgDark)}" maxlength="7" spellcheck="false"></div></div>
            <div class="modal-field"><label>Fundo claro</label><div class="color-input-row"><input type="color" id="editorPaletteBgLight" value="${escHtml(palette.bgLight)}"><input type="text" class="hex-input" data-for="editorPaletteBgLight" value="${escHtml(palette.bgLight)}" maxlength="7" spellcheck="false"></div></div>
            <div class="modal-field"><label>Texto no fundo escuro</label><div class="color-input-row"><input type="color" id="editorPaletteTextDark" value="${escHtml(palette.textOnDark)}"><input type="text" class="hex-input" data-for="editorPaletteTextDark" value="${escHtml(palette.textOnDark)}" maxlength="7" spellcheck="false"></div></div>
            <div class="modal-field"><label>Texto no fundo claro</label><div class="color-input-row"><input type="color" id="editorPaletteTextLight" value="${escHtml(palette.textOnLight)}"><input type="text" class="hex-input" data-for="editorPaletteTextLight" value="${escHtml(palette.textOnLight)}" maxlength="7" spellcheck="false"></div></div>
            <div class="modal-field"><label>Texto secundário</label><div class="color-input-row"><input type="color" id="editorPaletteTextMuted" value="${escHtml(palette.textMuted)}"><input type="text" class="hex-input" data-for="editorPaletteTextMuted" value="${escHtml(palette.textMuted)}" maxlength="7" spellcheck="false"></div></div>
          </div>
        </div>
        <div id="editorPaletteList" class="editor-panel">
          <div id="paletteManagerEditor" class="collection-list"></div>
        </div>`;
      const nameInput = document.getElementById('editorPaletteName');
      const aiBtn = document.getElementById('btnPaletteSuggest');
      if (nameInput) nameInput.addEventListener('input', setPaletteSuggestEnabled);
      if (aiBtn) aiBtn.addEventListener('click', suggestPaletteColors);
      setPaletteSuggestEnabled();
      // Sync color pickers ↔ hex inputs
      nodes.editorModalBody.querySelectorAll('.hex-input').forEach(hexIn => {
        hexIn.value = hexIn.value.toUpperCase();
        const colorIn = document.getElementById(hexIn.dataset.for);
        if (!colorIn) return;
        colorIn.addEventListener('input', () => {
          hexIn.value = colorIn.value.toUpperCase();
          hexIn.classList.remove('invalid');
        });
        hexIn.addEventListener('input', () => {
          const v = hexIn.value.trim();
          if (/^#[0-9a-fA-F]{6}$/.test(v)) {
            colorIn.value = v;
            hexIn.classList.remove('invalid');
          } else {
            hexIn.classList.toggle('invalid', v.length > 1);
          }
        });
        hexIn.addEventListener('blur', () => {
          if (!/^#[0-9a-fA-F]{6}$/.test(hexIn.value.trim())) {
            hexIn.value = colorIn.value.toUpperCase();
            hexIn.classList.remove('invalid');
          }
        });
      });
      renderPaletteManager(document.getElementById('paletteManagerEditor'));
      bindEditorTabs();
      bindInheritToggles();
      return;
    }

    const fontpack = normalizeFontpack(item || PRESET_FONTPACKS[0], PRESET_FONTPACKS[0]);
    nodes.editorModalBody.innerHTML = `
      <div id="editorFontpackForm" class="editor-panel active">
        <div class="name-row">
          <div class="modal-field">
            <label>Nome</label>
            <input type="text" id="editorFontpackName" value="${escHtml(fontpack.name)}" placeholder="Meu pacote">
          </div>
          <button type="button" class="btn-mini primary btn-ai-suggest" id="btnFontpackSuggest" disabled title="Use o nome do pacote como direção para a IA sugerir fontes">Sugerir fontes com IA</button>
        </div>
        <div class="form-grid">
          <div class="modal-field"><label>Família de títulos</label><input type="text" id="editorFontpackHeadingFamily" value="${escHtml(fontpack.headingFamily)}" placeholder="'Playfair Display', serif"></div>
          <div class="modal-field"><label>Família de corpo</label><input type="text" id="editorFontpackBodyFamily" value="${escHtml(fontpack.bodyFamily)}" placeholder="'Work Sans', sans-serif"></div>
        </div>
        <p class="modal-hint">A escala abaixo alimenta os tokens globais usados pelos posts e pela interface da plataforma quando a herança estiver ativa.</p>
        <div class="form-grid font-scale-grid">
          ${TYPO_KEYS.map(key => `
            <div class="modal-field">
              <label>${escHtml(TYPO_LABELS[key])}</label>
              <input type="number" id="editorFontpack_${key}" min="8" max="220" step="1" value="${escHtml(fontpack.scale[key])}">
            </div>`).join('')}
        </div>
      </div>
      <div id="editorFontpackList" class="editor-panel">
        <div id="fontpackManagerEditor" class="collection-list"></div>
      </div>`;
    const fpNameInput = document.getElementById('editorFontpackName');
    const fpAiBtn = document.getElementById('btnFontpackSuggest');
    if (fpNameInput) fpNameInput.addEventListener('input', setFontpackSuggestEnabled);
    if (fpAiBtn) fpAiBtn.addEventListener('click', suggestFontpackFonts);
    setFontpackSuggestEnabled();
    renderFontpackManager(document.getElementById('fontpackManagerEditor'));
    bindEditorTabs();
    bindInheritToggles();
  }

  function bindEditorTabs() {
    const panels = nodes.editorModalBody.querySelectorAll('.editor-panel');
    if (!panels.length) return;

    const showForm = () => {
      editorView = 'form';
      nodes.editorModalTitle.classList.add('active');
      nodes.editorModalListToggle.classList.remove('active');
      if (nodes.editorModalActions) nodes.editorModalActions.style.display = 'flex';
      panels.forEach(panel => panel.classList.toggle('active', /Form$/.test(panel.id || '')));
    };
    const showList = () => {
      editorView = 'list';
      nodes.editorModalTitle.classList.remove('active');
      nodes.editorModalListToggle.classList.add('active');
      if (nodes.editorModalActions) nodes.editorModalActions.style.display = 'none';
      panels.forEach(panel => panel.classList.toggle('active', /List$/.test(panel.id || '')));
    };

    nodes.editorModalTitle.onclick = showForm;
    nodes.editorModalListToggle.onclick = showList;
  }

  function bindInheritToggles() {
    nodes.editorPlatformInherit.onchange = () => setPlatformInherit(nodes.editorPlatformInherit.checked);
    nodes.editorPlatformFontInherit.onchange = () => setPlatformFontInherit(nodes.editorPlatformFontInherit.checked);
  }

  function closeEditor() {
    nodes.editorModal.classList.remove('open');
    document.body.classList.remove('has-modal-open');
    editorState = null;
    editorView = 'form';
    if (nodes.editorModalActions) nodes.editorModalActions.style.display = 'flex';
  }

  function saveEditor() {
    if (!editorState || editorView !== 'form') return;

    if (editorState.kind === 'palette') {
      const palette = normalizePalette({
        id: editorState.originalId || `custom-${Date.now()}`,
        name: document.getElementById('editorPaletteName').value.trim() || 'Custom',
        accent: document.getElementById('editorPaletteAccent').value,
        bgDark: document.getElementById('editorPaletteBgDark').value,
        bgLight: document.getElementById('editorPaletteBgLight').value,
        textOnDark: document.getElementById('editorPaletteTextDark').value,
        textOnLight: document.getElementById('editorPaletteTextLight').value,
        textMuted: document.getElementById('editorPaletteTextMuted').value,
      }, PRESET_PALETTES[0]);
      const next = getCustomPalettes().filter(p => p.id !== palette.id);
      next.push(palette);
      writeJSON(LS.palettes, next);
      setActivePalette(palette);
      applyUITheme();
      refreshAllManagers();
      closeEditor();
      return;
    }

    const scale = {};
    TYPO_KEYS.forEach(key => {
      const input = document.getElementById(`editorFontpack_${key}`);
      scale[key] = parseInt(input?.value, 10) || (PRESET_FONTPACKS[0].scale[key] || 24);
    });
    const fontpack = normalizeFontpack({
      id: editorState.originalId || `custom-${Date.now()}`,
      name: document.getElementById('editorFontpackName').value.trim() || 'Custom',
      headingFamily: document.getElementById('editorFontpackHeadingFamily').value.trim() || UI_DEFAULT.fontHeading,
      bodyFamily: document.getElementById('editorFontpackBodyFamily').value.trim() || UI_DEFAULT.fontBody,
      scale,
    }, PRESET_FONTPACKS[0]);

    const next = getCustomFontpacks().filter(fp => fp.id !== fontpack.id);
    next.push(fontpack);
    writeJSON(LS.fontpacks, next);
    setActiveFontpack(fontpack);
    applyUITheme();
    refreshAllManagers();
    closeEditor();
  }

  function injectOverridesIntoDoc(iDoc) {
    try {
      const palette = getActivePalette();
      const fontpack = getActiveFontpack();
      const [ar, ag, ab] = hexToRgb(palette.accent);
      const [dr, dg, db] = hexToRgb(palette.textOnDark);
      const [lr, lg, lb] = hexToRgb(palette.textOnLight);
      const [mr, mg, mb] = hexToRgb(palette.textMuted);
      const scale = fontpack.scale || PRESET_FONTPACKS[0].scale;
      const headingFamily = normalizeFontFamilyStack(fontpack.headingFamily, 'sans-serif');
      const bodyFamily = normalizeFontFamilyStack(fontpack.bodyFamily, 'sans-serif');
      ensureGoogleFontsLoaded(iDoc, [headingFamily, bodyFamily]);

      const css = `:root {
  --c-accent: ${palette.accent};
  --c-accent-rgb:${ar}, ${ag}, ${ab};
  --c-accent-10: rgba(${ar},${ag},${ab},0.10);
  --c-accent-12: rgba(${ar},${ag},${ab},0.12);
  --c-accent-15: rgba(${ar},${ag},${ab},0.15);
  --c-accent-18: rgba(${ar},${ag},${ab},0.18);
  --c-accent-20: rgba(${ar},${ag},${ab},0.20);
  --c-accent-25: rgba(${ar},${ag},${ab},0.25);
  --c-accent-30: rgba(${ar},${ag},${ab},0.30);
  --c-accent-40: rgba(${ar},${ag},${ab},0.40);
  --c-bg-dark: ${palette.bgDark};
  --c-bg-dark-2: ${palette.bgDark};
  --c-bg-dark-3: ${shadeHex(palette.bgDark, -4)};
  --c-bg-light: ${palette.bgLight};
  --c-bg-light-2: ${shadeHex(palette.bgLight, 4)};
  --c-text-on-dark: ${palette.textOnDark};
  --c-text-on-dark-rgb:${dr}, ${dg}, ${db};
  --c-text-on-dark-50: rgba(${dr},${dg},${db},0.50);
  --c-text-on-dark-70: rgba(${dr},${dg},${db},0.70);
  --c-text-on-dark-75: rgba(${dr},${dg},${db},0.75);
  --c-text-on-dark-80: rgba(${dr},${dg},${db},0.80);
  --c-text-on-light: ${palette.textOnLight};
  --c-text-on-light-rgb:${lr}, ${lg}, ${lb};
  --c-text-muted: ${palette.textMuted};
  --c-text-muted-rgb:${mr}, ${mg}, ${mb};
  --c-text-muted-20: rgba(${mr},${mg},${mb},0.20);
  --c-border-soft: rgba(${ar},${ag},${ab},0.20);
  --c-border-med: rgba(${ar},${ag},${ab},0.30);
  /* surface colors follow the active palette */
  --c-surface: ${palette.bgLight};
  --c-surface-soft: rgba(${ar},${ag},${ab},0.06);
  --ff-heading: ${headingFamily};
  --ff-body: ${bodyFamily};
  --fs-h1: ${scale.h1}px;
  --fs-h2: ${scale.h2}px;
  --fs-h3: ${scale.h3}px;
  --fs-kicker: ${scale.kicker}px;
  --fs-body: ${scale.body}px;
  --fs-meta: ${scale.meta}px;
  --fs-cta: ${scale.cta}px;
  --fs-block: ${scale.block}px;
}`;
      let style = iDoc.getElementById('pg-overrides');
      if (!style) {
        style = iDoc.createElement('style');
        style.id = 'pg-overrides';
        iDoc.head.appendChild(style);
      }
      style.textContent = css;
      // Also set critical palette variables inline on the root element to
      // ensure they take precedence over external stylesheets.
      try {
        iDoc.documentElement.style.setProperty('--c-accent', palette.accent);
        iDoc.documentElement.style.setProperty('--c-accent-rgb', `${ar}, ${ag}, ${ab}`);
        iDoc.documentElement.style.setProperty('--c-surface', palette.bgLight);
        iDoc.documentElement.style.setProperty('--c-surface-soft', `rgba(${ar},${ag},${ab},0.06)`);
      } catch (e) {
        // ignore if setting inline styles fails
      }
    } catch {
      // ignore
    }
  }

  function updatePreviewIframes() {
    document.querySelectorAll('.card iframe').forEach(iframe => {
      try {
        const doc = iframe.contentDocument;
        if (doc && doc.head) injectOverridesIntoDoc(doc);
      } catch {
        // ignore
      }
    });
  }

  function clampScale(value, min = 0.12, max = 1) {
    return Math.max(min, Math.min(max, value || min));
  }

  function scaleIframes() {
    cards.forEach(card => {
      const iframe = card.querySelector('iframe');
      if (!iframe) return;
      const nextScale = clampScale(card.offsetWidth / POST_W);
      iframe.style.transform = `scale(${nextScale})`;
    });
  }

  let scaleRaf = null;
  function scheduleScaleIframes() {
    if (scaleRaf) cancelAnimationFrame(scaleRaf);
    scaleRaf = requestAnimationFrame(() => {
      scaleRaf = null;
      scaleIframes();
    });
  }

  function getActiveModel() {
    return localStorage.getItem(LS.aiModel) || 'openai/gpt-4o-mini';
  }

  function refreshApiKeyUI() {
    const hasKey = !!localStorage.getItem(LS.apiKey);
    document.getElementById('apiKeyStatusText').textContent = hasKey
      ? 'Chave configurada.'
      : 'Nenhuma chave configurada. Botões de IA ficam desabilitados.';
    document.getElementById('btnToggleApiKey').textContent = hasKey ? 'Editar chave' : 'Adicionar chave';
    document.getElementById('apiKeyInputWrap').style.display = 'none';
    setPaletteSuggestEnabled();
    setFontpackSuggestEnabled();
  }

  function loadConfig() {
    const cfg = readJSON(LS.cfg, {});
    nodes.cfgBadgeName.value   = localStorage.getItem(LS.badgeName)   || '';
    nodes.cfgBadgeHandle.value = localStorage.getItem(LS.badgeHandle) || '';
    nodes.cfgSystemPrompt.value = cfg.systemPrompt || '';
    nodes.cfgContext.value = cfg.context || '';
    refreshApiKeyUI();
    applyUITheme();
  }

  function refreshAllManagers() {
    renderSwatches();
    renderFontpackSwatches();
    renderPaletteManager();
    renderFontpackManager();
    renderThemeToggle();
    updatePreviewIframes();
  }

  function bootstrap() {
    ensureBootstrap();
    renderConfigButton();
    applyUITheme();
    renderSwatches();
    renderFontpackSwatches();
    renderThemeToggle();
    renderPaletteManager();
    renderFontpackManager();
    updatePreviewIframes();
    refreshApiKeyUI();
  }

  cards.forEach(card => {
    const iframe = card.querySelector('iframe');
    iframe.addEventListener('load', () => {
      try { injectOverridesIntoDoc(iframe.contentDocument); } catch {
        // ignore
      }
    });
    try {
      if (iframe.contentDocument && iframe.contentDocument.head) injectOverridesIntoDoc(iframe.contentDocument);
    } catch {
      // ignore
    }
  });

  scaleIframes();
  window.addEventListener('resize', scheduleScaleIframes);
  window.addEventListener('orientationchange', scheduleScaleIframes);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', scheduleScaleIframes);
  }
  if (typeof ResizeObserver !== 'undefined' && grid) {
    const observer = new ResizeObserver(() => scheduleScaleIframes());
    observer.observe(grid);
  }
  bootstrap();

  document.getElementById('btnToggleApiKey').addEventListener('click', () => {
    const wrap = document.getElementById('apiKeyInputWrap');
    const visible = wrap.style.display !== 'none';
    wrap.style.display = visible ? 'none' : 'flex';
    if (!visible) {
      const input = document.getElementById('cfgApiKey');
      input.value = localStorage.getItem(LS.apiKey) || '';
      input.focus();
    }
  });

  document.getElementById('btnSaveApiKey').addEventListener('click', () => {
    const val = document.getElementById('cfgApiKey').value.trim();
    if (val) localStorage.setItem(LS.apiKey, val);
    else localStorage.removeItem(LS.apiKey);
    refreshApiKeyUI();
  });

  document.getElementById('btnCancelApiKey').addEventListener('click', () => {
    document.getElementById('apiKeyInputWrap').style.display = 'none';
  });

  nodes.btnNewPaletteQuick.addEventListener('click', () => openEditor('palette', null));
  nodes.btnNewFontpackQuick.addEventListener('click', () => openEditor('fontpack', null));
  nodes.btnThemeToggle.addEventListener('click', () => {
    toggleUITheme();
    applyUITheme();
    renderThemeToggle();
    refreshAllManagers();
  });
  nodes.btnConfig.addEventListener('click', () => {
    loadConfig();
    refreshAllManagers();
    nodes.overlay.classList.add('open');
  });
  nodes.btnCancel.addEventListener('click', () => nodes.overlay.classList.remove('open'));
  nodes.overlay.addEventListener('click', e => { if (e.target === nodes.overlay) nodes.overlay.classList.remove('open'); });
  nodes.btnEditorCancel.addEventListener('click', closeEditor);
  nodes.btnEditorSave.addEventListener('click', saveEditor);
  nodes.editorModal.addEventListener('click', e => { if (e.target === nodes.editorModal) closeEditor(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      nodes.overlay.classList.remove('open');
      nodes.editorModal.classList.remove('open');
    }
  });

  nodes.btnSave.addEventListener('click', () => {
    const badgeName   = nodes.cfgBadgeName.value.trim();
    const badgeHandle = nodes.cfgBadgeHandle.value.trim();
    if (badgeName)   localStorage.setItem(LS.badgeName, badgeName);
    else             localStorage.removeItem(LS.badgeName);
    if (badgeHandle) localStorage.setItem(LS.badgeHandle, badgeHandle);
    else             localStorage.removeItem(LS.badgeHandle);
    writeJSON(LS.cfg, {
      systemPrompt: nodes.cfgSystemPrompt.value.trim(),
      context: nodes.cfgContext.value.trim(),
    });
    applyUITheme();
    refreshAllManagers();
    nodes.overlay.classList.remove('open');
  });

  window.addEventListener('storage', e => {
    if ([LS.palette, LS.palettes, LS.fontpack, LS.fontpacks, LS.typo, LS.platformInherit, LS.platformFontInherit, LS.uiTheme].includes(e.key)) {
      ensureBootstrap();
      applyUITheme();
      refreshAllManagers();
    }
  });
})();
