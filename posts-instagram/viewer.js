(() => {
  'use strict';

  const POST = { W: 1080, H: 1350 };

  const P = `posts-ig:${PROJECT_UUID}`;
  const LS = {
    vars:               f => `${P}:vars:${f}`,
    cfg:                `${P}:config`,
    apiKey:             `${P}:apikey`,
    aiModel:            `${P}:aimodel`,
    caption:            f => `${P}:caption:${f}`,
    thread:             f => `${P}:thread:${f}`,
    palette:            `${P}:palette`,
    palettes:           `${P}:palettes`,
    fontpack:           `${P}:fontpack`,
    fontpacks:          `${P}:fontpacks`,
    typo:               `${P}:typography`,
    platformInherit:    `${P}:platform-inherit`,
    platformFontInherit:`${P}:platform-font-inherit`,
    uiTheme:            `${P}:ui-theme`,
    photo:              f => `${P}:photo:${f}`,
    badgeName:          `${P}:badge-name`,
    badgeHandle:        `${P}:badge-handle`,
    modelFilter:        `${P}:model-filter`,
  };

  const UI_DEFAULT = {
    accent: '#C5A880',
    bg: '#f5ebe0',
    text: '#2a1f14',
    textMuted: '#5D6D7E',
    fontHeading: "'Playfair Display', serif",
    fontBody: "'Work Sans', sans-serif",
  };

  const PRESET_FONTPACKS = [
    { id: 'classic', name: 'Clássico', headingFamily: "'Playfair Display', serif", bodyFamily: "'Work Sans', sans-serif", scale: { ...FONT_SCALE_REFERENCE } },
  ];

  const nodes = {
    frame: document.getElementById('postFrame'),
    zoomFrame: document.getElementById('zoomFrame'),
    zoomContainer: document.getElementById('zoomContainer'),
    zoomOverlay: document.getElementById('zoomOverlay'),
    postWrapper: document.getElementById('postWrapper'),
    btnDownload: document.getElementById('btnDownload'),
    btnGerar: document.getElementById('btnGerar'),
    btnGerarLegenda: document.getElementById('btnGerarLegenda'),
    btnCopiarLegenda: document.getElementById('btnCopiarLegenda'),
    btnZoomClose: document.getElementById('zoomClose'),
    iaPrompt: document.getElementById('iaPrompt'),
    iaStatus: document.getElementById('iaStatus'),
    legendaDirecao: document.getElementById('legendaDirecao'),
    legendaStatus: document.getElementById('legendaStatus'),
    legendaOutput: document.getElementById('legendaOutput'),
    legendaResultField: document.getElementById('legendaResultField'),
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabPanels: document.querySelectorAll('.tab-panel'),
    colLeft: document.querySelector('.col-left'),
    colRight: document.querySelector('.col-right'),
    actionsTop: document.querySelector('.actions-top'),
    actionsBottom: document.querySelector('.actions-bottom'),
  };

  const SVG_DOWNLOAD = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v8M5 7l3 3 3-3M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1"/></svg>`;
  const SVG_GENERATE = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h12M10 4l4 4-4 4"/></svg>`;
  let legendaAbortController = null;
  let legendaStreaming = false;

  const params = new URLSearchParams(location.search);
  const postFile = params.get('post');

  function hexToRgb(hex) {
    const h = String(hex || '').replace('#', '');
    return [parseInt(h.slice(0, 2), 16) || 0, parseInt(h.slice(2, 4), 16) || 0, parseInt(h.slice(4, 6), 16) || 0];
  }

  function shadeHex(hex, amt) {
    const [r, g, b] = hexToRgb(hex);
    return `rgb(${Math.max(0, Math.min(255, r + amt))},${Math.max(0, Math.min(255, g + amt))},${Math.max(0, Math.min(255, b + amt))})`;
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

  function normalizeFontpack(fontpack, fallback = PRESET_FONTPACKS[0]) {
    const base = fallback || PRESET_FONTPACKS[0];
    const scale = Object.assign({}, base.scale || {}, fontpack.scale || {});
    const recommended = getRecommendedFontScale(fontpack);
    ['h1', 'h2', 'h3', 'kicker', 'body', 'block', 'meta', 'cta'].forEach(key => {
      const fallbackValue = (base.scale && base.scale[key]) || FONT_SCALE_REFERENCE[key] || (key === 'h1' ? 80 : 24);
      const minValue = recommended[key] || FONT_SCALE_REFERENCE[key] || 8;
      const parsed = parseInt(scale[key], 10);
      scale[key] = Number.isFinite(parsed) ? Math.max(parsed, minValue) : Math.max(fallbackValue, minValue);
    });
    return {
      id: fontpack.id || base.id,
      name: fontpack.name || base.name,
      headingFamily: normalizeFontFamilyStack(fontpack.headingFamily || base.headingFamily, 'sans-serif'),
      bodyFamily: normalizeFontFamilyStack(fontpack.bodyFamily || base.bodyFamily, 'sans-serif'),
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

  function getPlatformInherit() {
    const raw = localStorage.getItem(LS.platformInherit);
    return raw === null ? true : raw === '1';
  }

  function getPlatformFontInherit() {
    const raw = localStorage.getItem(LS.platformFontInherit);
    return raw === null ? true : raw === '1';
  }

  function getUITheme() {
    const raw = localStorage.getItem(LS.uiTheme);
    return raw === 'dark' ? 'dark' : 'light';
  }

  function ensureBootstrap() {
    if (!localStorage.getItem(LS.uiTheme)) localStorage.setItem(LS.uiTheme, 'light');
    const currentFontpack = readJSON(LS.fontpack, null);
    if (!localStorage.getItem(LS.fontpack)) {
      const legacy = readJSON(LS.typo, null);
      const pack = normalizeFontpack({
        id: 'classic',
        name: 'Clássico',
        headingFamily: "'Playfair Display', serif",
        bodyFamily: "'Work Sans', sans-serif",
        scale: legacy ? legacyTypographyToScale(legacy) : PRESET_FONTPACKS[0].scale,
      });
      writeJSON(LS.fontpack, pack);
    }
    if (currentFontpack && currentFontpack.id === 'classic') {
      writeJSON(LS.fontpack, normalizeFontpack(PRESET_FONTPACKS[0], PRESET_FONTPACKS[0]));
    }
    if (localStorage.getItem(LS.fontpack) && !localStorage.getItem(LS.typo)) {
      writeJSON(LS.typo, normalizeFontpack(readJSON(LS.fontpack, PRESET_FONTPACKS[0])).scale);
    }
  }

  function getActivePalette() {
    return readJSON(LS.palette, {
      accent: UI_DEFAULT.accent,
      bgDark: '#0f0a08',
      bgLight: UI_DEFAULT.bg,
      textOnDark: '#f5f0e8',
      textOnLight: UI_DEFAULT.text,
      textMuted: UI_DEFAULT.textMuted,
    });
  }

  function getActiveFontpack() {
    return normalizeFontpack(readJSON(LS.fontpack, PRESET_FONTPACKS[0]), PRESET_FONTPACKS[0]);
  }

  function applyUITheme() {
    const palette = getPlatformInherit() ? getActivePalette() : {
      accent: UI_DEFAULT.accent,
      bgDark: '#0f0a08',
      bgLight: UI_DEFAULT.bg,
      textOnDark: '#f5f0e8',
      textOnLight: UI_DEFAULT.text,
      textMuted: UI_DEFAULT.textMuted,
    };
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
    root.setProperty('--ui-accent-rgb', `${r},${g},${b}`);
    root.setProperty('--ui-bg', baseBg);
    root.setProperty('--ui-bg-panel', basePanel);
    root.setProperty('--ui-field-bg', fieldBg);
    root.setProperty('--ui-field-text', baseText);
    root.setProperty('--ui-field-border', `rgba(${r},${g},${b},0.30)`);
    root.setProperty('--ui-text', baseText);
    root.setProperty('--ui-text-muted', baseMuted);
    root.setProperty('--ui-border', `rgba(${r},${g},${b},0.2)`);
    root.setProperty('--ui-border-med', `rgba(${r},${g},${b},0.3)`);
    const headingFamily = getPlatformFontInherit() ? fontpack.headingFamily : UI_DEFAULT.fontHeading;
    const bodyFamily = getPlatformFontInherit() ? fontpack.bodyFamily : UI_DEFAULT.fontBody;
    root.setProperty('--ui-font-heading', headingFamily);
    root.setProperty('--ui-font-body', bodyFamily);
    ensureGoogleFontsLoaded(document, [headingFamily, bodyFamily, UI_DEFAULT.fontHeading, UI_DEFAULT.fontBody]);
  }

  function accentLuminance(r, g, b) {
    const lin = v => { const s = v / 255; return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  }

  function injectOverrides(iDoc) {
    const palette = getActivePalette();
    const fontpack = getActiveFontpack();
    const [ar, ag, ab] = hexToRgb(palette.accent);
    const [dr, dg, db] = hexToRgb(palette.textOnDark || '#f5f0e8');
    const [lr, lg, lb] = hexToRgb(palette.textOnLight || UI_DEFAULT.text);
    const [mr, mg, mb] = hexToRgb(palette.textMuted || UI_DEFAULT.textMuted);
    const scale = fontpack.scale || PRESET_FONTPACKS[0].scale;
    const headingFamily = normalizeFontFamilyStack(fontpack.headingFamily || PRESET_FONTPACKS[0].headingFamily, 'sans-serif');
    const bodyFamily = normalizeFontFamilyStack(fontpack.bodyFamily || PRESET_FONTPACKS[0].bodyFamily, 'sans-serif');
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
  }

  function syncZoomVars() {
    const iDoc = nodes.frame.contentDocument;
    const zDoc = nodes.zoomFrame.contentDocument;
    if (!iDoc || !zDoc) return;
    iDoc.querySelectorAll('[data-var]').forEach(el => {
      const target = zDoc.querySelector(`[data-var="${el.dataset.var}"]`);
      if (target) target.innerHTML = el.innerHTML;
    });
    injectOverrides(zDoc);
    const savedPhoto = readJSON(LS.photo(postFile), PHOTO_DEFAULTS);
    applyPhotoSettings(savedPhoto);
    injectBadgeIdentity();
  }

  function syncZoomIfReady() {
    const zDoc = nodes.zoomFrame.contentDocument;
    if (!zDoc || !zDoc.head) return false;
    syncZoomVars();
    return true;
  }

  function getVarsFromDOM() {
    const data = {};
    nodes.frame.contentDocument.querySelectorAll('[data-var]').forEach(el => {
      data[el.dataset.var] = el.innerHTML;
    });
    return data;
  }

  function saveVars() {
    if (!postFile) return;
    writeJSON(LS.vars(postFile), getVarsFromDOM());
  }

  function applyVars(vars) {
    const iDoc = nodes.frame.contentDocument;
    Object.entries(vars).forEach(([key, value]) => {
      const el = iDoc.querySelector(`[data-var="${key}"]`);
      if (el) el.innerHTML = value;
      const ta = document.querySelector(`textarea[data-var-key="${key}"]`);
      if (ta) ta.value = value;
    });
    if (nodes.zoomOverlay.classList.contains('open')) syncZoomIfReady();
    saveVars();
  }

  const PHOTO_DEFAULTS = { badgeVisible: true, zoom: 1, x: 50, y: 30 };

  function injectBadgeIdentity() {
    const name   = localStorage.getItem(LS.badgeName)   || 'Lígia Flauzino';
    const handle = localStorage.getItem(LS.badgeHandle) || '@ligiaflauzino';
    [nodes.frame.contentDocument, nodes.zoomFrame?.contentDocument].forEach(doc => {
      if (!doc) return;
      doc.querySelectorAll('.badge-name').forEach(el => el.textContent = name);
      doc.querySelectorAll('.badge-handle').forEach(el => el.textContent = handle);
    });
  }

  function applyPhotoSettings(settings) {
    [nodes.frame.contentDocument, nodes.zoomFrame?.contentDocument].forEach(doc => {
      if (!doc) return;
      const badge = doc.querySelector('[data-badge]');
      if (!badge) return;
      badge.style.display = settings.badgeVisible ? '' : 'none';
      const bottom = badge.closest('.bottom');
      if (bottom) bottom.classList.toggle('badge-hidden', !settings.badgeVisible);
      const photo = doc.querySelector('[data-badge-photo]');
      if (photo) {
        photo.style.setProperty('--badge-photo-zoom', settings.zoom);
        photo.style.setProperty('--badge-photo-x', settings.x + '%');
        photo.style.setProperty('--badge-photo-y', settings.y + '%');
      }
    });
  }

  function buildPhotoSection() {
    const iDoc = nodes.frame.contentDocument;
    const badge = iDoc.querySelector('[data-badge]');
    if (!badge) return;

    const isLg = badge.dataset.badgeSize === 'lg';
    const saved = readJSON(LS.photo(postFile), PHOTO_DEFAULTS);
    const panel = document.getElementById('tab-editar');

    const section = document.createElement('div');
    section.className = 'photo-section';

    section.innerHTML = `
      <div class="photo-section-label">Foto do Autor</div>
      <div class="field field--toggle">
        <label>Exibir badge</label>
        <label class="toggle-switch">
          <input type="checkbox" id="badge-toggle" ${saved.badgeVisible ? 'checked' : ''}>
          <span class="toggle-track"></span>
        </label>
      </div>
    `;

    if (isLg) {
      section.innerHTML += `
        <div class="photo-sliders" ${saved.badgeVisible ? '' : 'style="opacity:.4;pointer-events:none"'}>
          <div class="field">
            <label>Zoom <span class="slider-val" id="val-zoom">${saved.zoom.toFixed(2)}×</span></label>
            <input type="range" id="sl-zoom" min="80" max="160" step="1" value="${Math.round(saved.zoom * 100)}">
          </div>
          <div class="field">
            <label>Posição Vertical <span class="slider-val" id="val-y">${saved.y}%</span></label>
            <input type="range" id="sl-y" min="0" max="100" step="1" value="${saved.y}">
            <div class="slider-hint">↑ sobe o rosto · ↓ desce</div>
          </div>
          <div class="field">
            <label>Posição Horizontal <span class="slider-val" id="val-x">${saved.x}%</span></label>
            <input type="range" id="sl-x" min="0" max="100" step="1" value="${saved.x}">
            <div class="slider-hint">← esquerda · → direita</div>
          </div>
        </div>
      `;
    }

    panel.appendChild(section);
    applyPhotoSettings(saved);

    section.querySelector('#badge-toggle').addEventListener('change', e => {
      const sliders = section.querySelector('.photo-sliders');
      if (sliders) { sliders.style.opacity = e.target.checked ? '' : '.4'; sliders.style.pointerEvents = e.target.checked ? '' : 'none'; }
      saveAndApplyPhoto();
    });

    ['zoom', 'y', 'x'].forEach(key => {
      const sl = section.querySelector(`#sl-${key}`);
      if (!sl) return;
      sl.addEventListener('input', () => {
        const v = parseInt(sl.value);
        section.querySelector(`#val-${key}`).textContent = key === 'zoom' ? (v / 100).toFixed(2) + '×' : v + '%';
        saveAndApplyPhoto();
      });
    });

    function saveAndApplyPhoto() {
      const toggle = section.querySelector('#badge-toggle');
      const settings = {
        badgeVisible: toggle.checked,
        zoom: isLg ? parseInt(section.querySelector('#sl-zoom').value) / 100 : saved.zoom,
        y:    isLg ? parseInt(section.querySelector('#sl-y').value)    : saved.y,
        x:    isLg ? parseInt(section.querySelector('#sl-x').value)    : saved.x,
      };
      writeJSON(LS.photo(postFile), settings);
      applyPhotoSettings(settings);
    }
  }

  function buildEditPanel() {
    const iDoc = nodes.frame.contentDocument;
    const saved = postFile ? readJSON(LS.vars(postFile), {}) : {};
    const elems = iDoc.querySelectorAll('[data-var]');
    const panel = document.getElementById('tab-editar');

    panel.innerHTML = '';
    if (!elems.length) {
      panel.innerHTML = '<p style="color:rgba(93,109,126,.6);font-size:.9rem;line-height:1.6;">Nenhuma variável encontrada neste template.</p>';
      return;
    }

    elems.forEach(el => {
      const key = el.dataset.var;
      if (saved[key] !== undefined) el.innerHTML = saved[key];

      const field = document.createElement('div');
      field.className = 'field';
      field.innerHTML = `
        <label>${el.dataset.varLabel || key}</label>
        <textarea data-var-key="${key}" rows="${Math.min(Math.max(el.innerHTML.split(/<br\s*\/?>/i).length + Math.floor(el.innerHTML.length / 80), 2), 8)}">${el.innerHTML}</textarea>`;

      const ta = field.querySelector('textarea');
      ta.addEventListener('input', () => {
        el.innerHTML = ta.value;
        saveVars();
      });

      panel.appendChild(field);
    });

    buildPhotoSection();
  }

  function refreshThemeFromStorage() {
    applyUITheme();
    if (nodes.frame.contentDocument && nodes.frame.contentDocument.head) injectOverrides(nodes.frame.contentDocument);
    if (nodes.zoomFrame.contentDocument && nodes.zoomFrame.contentDocument.head) injectOverrides(nodes.zoomFrame.contentDocument);
    if (nodes.zoomOverlay.classList.contains('open')) syncZoomIfReady();
  }

  function clampScale(value, min = 0.12, max = 1) {
    return Math.max(min, Math.min(max, value || min));
  }

  function getViewportSize() {
    const vv = window.visualViewport;
    if (vv && Number.isFinite(vv.width) && Number.isFinite(vv.height)) {
      return { width: vv.width, height: vv.height };
    }
    return { width: window.innerWidth, height: window.innerHeight };
  }

  function scalePost() {
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    const actionsH = (nodes.actionsTop?.offsetHeight || 0) + (nodes.actionsBottom?.offsetHeight || 0);
    const colPaddingX = isDesktop ? 48 : 24;
    const extraGapY = isDesktop ? 80 : 56;
    const availH = Math.max(120, (nodes.colLeft?.clientHeight || 0) - actionsH - extraGapY);
    const availW = Math.max(120, (nodes.colLeft?.clientWidth || 0) - colPaddingX);
    const scale = clampScale(Math.min(availH / POST.H, availW / POST.W));
    nodes.frame.style.transform = `scale(${scale})`;
    nodes.postWrapper.style.width = `${POST.W * scale}px`;
    nodes.postWrapper.style.height = `${POST.H * scale}px`;
  }

  function scaleZoom() {
    const viewport = getViewportSize();
    const maxH = viewport.height * 0.88;
    const maxW = viewport.width * 0.88;
    const scale = clampScale(Math.min(maxH / POST.H, maxW / POST.W));
    nodes.zoomFrame.style.transform = `scale(${scale})`;
    nodes.zoomContainer.style.width = `${POST.W * scale}px`;
    nodes.zoomContainer.style.height = `${POST.H * scale}px`;
  }

  let scaleRaf = null;
  function scheduleScale() {
    if (scaleRaf) cancelAnimationFrame(scaleRaf);
    scaleRaf = requestAnimationFrame(() => {
      scaleRaf = null;
      scalePost();
      scaleZoom();
    });
  }

  function openZoom() {
    scaleZoom();
    if (nodes.zoomFrame.dataset.loaded === postFile) {
      syncZoomVars();
      nodes.zoomOverlay.classList.add('open');
      return;
    }
    nodes.zoomFrame.addEventListener('load', () => {
      nodes.zoomFrame.dataset.loaded = postFile;
      syncZoomVars();
      scaleZoom();
      nodes.zoomOverlay.classList.add('open');
    }, { once: true });
    if (postFile) {
      nodes.zoomFrame.src = postFile;
    }
  }

  function closeZoom() {
    nodes.zoomOverlay.classList.remove('open');
  }

  function getActiveModel() {
    return localStorage.getItem(LS.aiModel) || 'openai/gpt-4o-mini';
  }

  function getActiveModelMeta() {
    if (typeof getModelById !== 'function') return null;
    return getModelById(getActiveModel()) || null;
  }

  function getSuggestedFallbackModels(currentModelId, limit = 2) {
    if (typeof AI_MODELS === 'undefined') return [];
    const current = typeof getModelById === 'function' ? getModelById(currentModelId) : null;
    const preferFree = !!current?.isFree;
    const preferredIds = preferFree
      ? ['google/gemma-4-31b-it:free', 'minimax/minimax-m2.5:free', 'meta-llama/llama-3.3-70b-instruct:free']
      : ['openai/gpt-4o-mini', 'anthropic/claude-sonnet-4-5', 'google/gemini-2.0-flash'];
    const pool = AI_MODELS.filter(model => model.id !== currentModelId && (!!model.isFree) === preferFree);
    const ordered = [
      ...preferredIds.map(id => pool.find(model => model.id === id)).filter(Boolean),
      ...pool.filter(model => !preferredIds.includes(model.id)).sort((a, b) => {
        const tierScore = { balanced: 0, fast: 1, powerful: 2 };
        return (tierScore[a.tier] ?? 9) - (tierScore[b.tier] ?? 9);
      }),
    ];
    return Array.from(new Map(ordered.map(model => [model.id, model])).values()).slice(0, limit);
  }

  function formatProviderMessage(rawMessage, modelId = getActiveModel()) {
    const message = String(rawMessage || '').trim();
    const lower = message.toLowerCase();
    const model = (typeof getModelById === 'function' ? getModelById(modelId) : null) || null;
    const modelLabel = model?.name ? `O modelo "${model.name}"` : 'O modelo selecionado';
    const fallbackModels = getSuggestedFallbackModels(modelId)
      .map(modelItem => modelItem.name)
      .filter(Boolean);
    const fallbackHint = fallbackModels.length
      ? ` Tente trocar para ${fallbackModels.join(' ou ')}.`
      : ' Tente trocar para outro modelo disponível.';
    const freeHint = model?.isFree
      ? ' Modelos grátis podem ficar temporariamente indisponíveis por fila, limite ou provedor.'
      : '';
    const detail = message ? ` Detalhe técnico: ${message}.` : '';

    if (!message) return 'Não foi possível concluir a solicitação. Tente novamente ou selecione outro modelo.';
    if (lower.includes('aborterror') || lower.includes('generation cancelled')) {
      return 'Geração interrompida.';
    }
    if (lower.includes('provider returned error') || lower.includes('provider error') || lower.includes('upstream')) {
      return `${modelLabel} falhou no provedor responsável.${freeHint}${fallbackHint}${detail}`;
    }
    if (lower.includes('rate limit') || lower.includes('too many requests') || lower.includes('429')) {
      return `${modelLabel} atingiu o limite de uso no momento.${freeHint}${fallbackHint}${detail}`;
    }
    if (lower.includes('temporarily unavailable') || lower.includes('unavailable') || lower.includes('no provider') || lower.includes('no endpoints')) {
      return `${modelLabel} está indisponível no momento.${freeHint}${fallbackHint}${detail}`;
    }
    if (lower.includes('timeout') || lower.includes('timed out')) {
      return `${modelLabel} demorou mais do que o esperado para responder.${freeHint}${fallbackHint}${detail}`;
    }
    if (lower.includes('context length') || lower.includes('token')) {
      return `${modelLabel} não conseguiu processar o tamanho da solicitação atual. Tente reduzir o conteúdo ou trocar de modelo.${detail}`;
    }
    return `Não foi possível gerar a resposta com ${model?.name || 'o modelo selecionado'}.${freeHint}${fallbackHint}${detail}`;
  }

  function setLegendaGeneratingState(isGenerating) {
    legendaStreaming = isGenerating;
    nodes.btnGerarLegenda.classList.toggle('loading', isGenerating);
    nodes.btnGerarLegenda.disabled = false;
    nodes.btnGerarLegenda.innerHTML = isGenerating
      ? (SVG_GENERATE + ' Cancelar')
      : (SVG_GENERATE + ' Gerar legenda');
  }

  async function fetchCaptionCompletion(apiKey, request, signal) {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': location.origin,
      },
      body: JSON.stringify(request),
      signal,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    logAICall('caption', {
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
    const content = data.choices?.[0]?.message?.content?.trim() || '';
    if (!content) throw new Error('A IA não retornou conteúdo.');
    return content;
  }

  function extractStreamDelta(eventData) {
    if (!eventData || eventData === '[DONE]') return { done: eventData === '[DONE]', content: '' };
    try {
      const parsed = JSON.parse(eventData);
      const delta = parsed?.choices?.[0]?.delta?.content;
      if (typeof delta === 'string') return { done: false, content: delta };
      const messageContent = parsed?.choices?.[0]?.message?.content;
      if (typeof messageContent === 'string') return { done: false, content: messageContent };
    } catch {}
    return { done: false, content: '' };
  }

  async function streamCaptionCompletion(apiKey, request, { signal, onToken }) {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': location.origin,
      },
      body: JSON.stringify(request),
      signal,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `HTTP ${res.status}`);
    }
    if (!res.body || typeof res.body.getReader !== 'function') {
      throw new Error('STREAM_UNSUPPORTED');
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullText = '';
    const streamEvents = [];

    const flushBuffer = () => {
      const normalized = buffer.replace(/\r\n/g, '\n');
      const chunks = normalized.split('\n\n');
      buffer = chunks.pop() || '';
      for (const chunk of chunks) {
        const dataLines = chunk
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.startsWith('data:'))
          .map(line => line.slice(5).trim());
        if (!dataLines.length) continue;
        const payload = dataLines.join('\n');
        streamEvents.push(payload);
        const delta = extractStreamDelta(payload);
        if (delta.done) continue;
        if (delta.content) {
          fullText += delta.content;
          onToken?.(fullText, delta.content);
        }
      }
    };

    while (true) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
      flushBuffer();
      if (done) break;
    }

    buffer += decoder.decode();
    flushBuffer();

    logAICall('caption-stream', {
      apiKey,
      url: 'https://openrouter.ai/api/v1/chat/completions',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': location.origin,
      },
      request,
      response: { stream: true, events: streamEvents },
    });

    return fullText.trim();
  }

  function getModelFilter() {
    return localStorage.getItem(LS.modelFilter) || 'all';
  }

  function setModelFilter(value) {
    localStorage.setItem(LS.modelFilter, value);
  }

  function getTierFilter() {
    return localStorage.getItem(LS.tierFilter) || 'all';
  }

  function setTierFilter(value) {
    localStorage.setItem(LS.tierFilter, value);
  }

  function renderModelList() {
    const container = document.getElementById('modelList');
    if (!container || typeof AI_MODELS === 'undefined') return;
    const active = getActiveModel();
    const costFilter = getModelFilter();
    const tierFilter = getTierFilter();

    // Start from full pool and apply filters
    let pool = AI_MODELS.slice();
    if (costFilter === 'free') pool = pool.filter(m => m.isFree);
    else if (costFilter === 'paid') pool = pool.filter(m => !m.isFree);
    if (tierFilter && tierFilter !== 'all') pool = pool.filter(m => m.tier === tierFilter);

    // Empty state when no models match
    if (!pool.length) {
      container.innerHTML = `
        <div class="models-empty">
          <div class="empty-title">Nenhum modelo encontrado</div>
          <div class="empty-sub">Nenhum modelo corresponde aos filtros selecionados.</div>
          <div><button id="emptyClearBtn" class="empty-clear-btn">Limpar filtros</button></div>
        </div>`;
      const btn = document.getElementById('emptyClearBtn');
      if (btn) btn.addEventListener('click', () => {
        setModelFilter('all'); setTierFilter('all');
        // update filter buttons UI
        try {
          document.querySelectorAll('.filter-btn').forEach(b => {
            const type = b.dataset.filterType;
            const val = b.dataset.filterValue;
            const current = type === 'cost' ? getModelFilter() : getTierFilter();
            b.classList.toggle('active', val === current);
          });
        } catch (e) {}
        renderModelList();
      });
      return;
    }

    // Render a flat grid of model cards (2 columns)
    container.innerHTML = `<div class="model-grid">${pool.map(m => `
      <button class="model-card${m.id === active ? ' active' : ''}" data-model-id="${m.id}">
        <div style="display:flex; flex-direction:column; gap:8px; align-items:flex-start;">
          <div class="model-card-company">${m.company}</div>
          <div class="model-card-body">
            <div class="model-card-name">${m.name}</div>
            <div class="model-card-desc">${m.description}</div>
            <div class="model-latency-note" style="display:${m.id === active ? 'block' : 'none'}">${(typeof formatLatencyNote === 'function') ? formatLatencyNote(m) : ''}</div>
          </div>
        </div>
        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px;">
          <span class="model-tier-badge ${m.tier}">${m.label}</span>
          <span class="model-price-badge ${m.isFree ? 'free' : 'paid'}">${m.isFree ? 'Grátis' : 'Pago'}</span>
        </div>
      </button>`).join('')}</div>`;

    container.querySelectorAll('.model-card').forEach(btn => {
      btn.addEventListener('click', () => {
        localStorage.setItem(LS.aiModel, btn.dataset.modelId);
        renderModelList();
      });
    });

    // No latency select anymore; keep other sync if needed
    try {
      const selTier = document.getElementById('tierFilterSelectPanel');
      if (selTier) selTier.value = getTierFilter();
    } catch (e) {}
  }

  async function gerarLegenda() {
    if (legendaStreaming) {
      legendaAbortController?.abort();
      return;
    }

    const apiKey = localStorage.getItem(LS.apiKey) || '';
    if (!apiKey) {
      nodes.legendaStatus.textContent = 'Configure a chave de API nas Configurações do Projeto.';
      nodes.legendaStatus.className = 'ia-status error';
      return;
    }

    const fieldData = [];
    document.querySelectorAll('#tab-editar .field').forEach(field => {
      const label = field.querySelector('label')?.textContent?.trim();
      const value = field.querySelector('textarea')?.value?.trim();
      if (label && value) fieldData.push({ label, value });
    });

    if (!fieldData.length) {
      nodes.legendaStatus.textContent = 'Nenhum campo de edição encontrado.';
      nodes.legendaStatus.className = 'ia-status error';
      return;
    }

    const cfg = readJSON(LS.cfg, {});
    const systemPrompt = cfg.systemPrompt || AI_PROMPTS.content;
    const context = cfg.context || '';
    const direcao = nodes.legendaDirecao.value.trim();
    const camposPost = fieldData.map(f => `${f.label}: "${f.value}"`).join('\n');
    const model = getActiveModel();

    legendaAbortController = new AbortController();
    setLegendaGeneratingState(true);
    nodes.legendaStatus.textContent = '';
    nodes.legendaStatus.className = 'ia-status';
    nodes.legendaResultField.style.display = 'flex';
    nodes.legendaOutput.value = '';

    try {
      const requestBase = {
        model,
        systemPrompt,
        userSections: [
          { title: 'Contexto do projeto', content: context || '(sem contexto adicional)' },
          { title: 'Post base', content: camposPost },
          { title: 'Tarefa', content: 'Escreva uma legenda completa para Instagram com base no post informado.' },
          { title: 'Estrutura base', content: `1. Hook (primeira linha impactante, visível antes do "ver mais" — máximo 125 caracteres)\n2. Desenvolvimento (2 a 4 parágrafos curtos com quebras de linha, tom empático e humano, sem jargão de coach)\n3. CTA suave (convite, pergunta ou reflexão — nunca venda direta)\n4. Hashtags relevantes (5 tags, misturando nicho e discovery)` },
          { title: 'Instrução prioritária do usuário', content: direcao || '(nenhuma)' },
          { title: 'Regras de saída', content: 'Retorne apenas o texto da legenda, sem títulos, marcações ou explicações extras.' },
        ],
      };
      const streamRequest = buildAIChatRequest({ ...requestBase, stream: true });
      let content = '';

      try {
        content = await streamCaptionCompletion(apiKey, streamRequest, {
          signal: legendaAbortController.signal,
          onToken: fullText => {
            nodes.legendaOutput.value = fullText;
            nodes.legendaStatus.textContent = 'Gerando legenda em tempo real…';
            nodes.legendaStatus.className = 'ia-status';
          },
        });
      } catch (err) {
        const partial = nodes.legendaOutput.value.trim();
        const canFallback = err?.name !== 'AbortError' && (!partial || err?.message === 'STREAM_UNSUPPORTED');
        if (canFallback) {
          const fallbackRequest = buildAIChatRequest(requestBase);
          content = await fetchCaptionCompletion(apiKey, fallbackRequest, legendaAbortController.signal);
        } else {
          throw err;
        }
      }

      nodes.legendaOutput.value = content;
      nodes.legendaResultField.style.display = 'flex';
      nodes.legendaStatus.textContent = '';
    } catch (err) {
      const partial = nodes.legendaOutput.value.trim();
      if (err?.name === 'AbortError') {
        nodes.legendaStatus.textContent = 'Geração interrompida.';
        nodes.legendaStatus.className = 'ia-status';
      } else if (partial) {
        nodes.legendaStatus.textContent = `Legenda parcial gerada. ${formatProviderMessage(err?.message, model)}`;
        nodes.legendaStatus.className = 'ia-status error';
      } else {
        nodes.legendaStatus.textContent = formatProviderMessage(err?.message, model);
        nodes.legendaStatus.className = 'ia-status error';
      }
      console.error(err);
    } finally {
      legendaAbortController = null;
      setLegendaGeneratingState(false);
    }
  }

  function refreshViewerAiBtn() {
    const hasKey = !!localStorage.getItem(LS.apiKey);
    const title = hasKey ? '' : 'Configure a chave de API nas Configurações do Projeto (index.html)';
    nodes.btnGerar.disabled = !hasKey;
    nodes.btnGerar.title = title;
    nodes.btnGerarLegenda.disabled = !hasKey;
    nodes.btnGerarLegenda.title = title;
  }

  ensureBootstrap();
  applyUITheme();
  refreshViewerAiBtn();

  if (postFile) {
    // Restore saved caption for this post
    const savedCaption = localStorage.getItem(LS.caption(postFile));
    if (savedCaption) {
      nodes.legendaOutput.value = savedCaption;
      nodes.legendaResultField.style.display = 'flex';
    }

    nodes.frame.src = postFile;
    nodes.frame.addEventListener('load', () => {
      try { document.title = nodes.frame.contentDocument.title + ' — Editor'; } catch {}
      injectOverrides(nodes.frame.contentDocument);
      const saved = readJSON(LS.vars(postFile), {});
      if (Object.keys(saved).length) applyVars(saved);
      injectBadgeIdentity();
      buildEditPanel();
      scalePost();
    });
  }

  // IA sub-tabs
  document.querySelectorAll('.ia-subtab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ia-subtab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.ia-subpanel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`ia-sub-${btn.dataset.subtab}`).classList.add('active');
      if (btn.dataset.subtab === 'modelo') renderModelList();
    });
  });

  nodes.btnGerarLegenda.addEventListener('click', gerarLegenda);

  nodes.btnCopiarLegenda.addEventListener('click', () => {
    const text = nodes.legendaOutput.value;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      if (postFile) localStorage.setItem(LS.caption(postFile), text);
      const btn = nodes.btnCopiarLegenda;
      const orig = btn.textContent;
      btn.textContent = 'Copiado!';
      setTimeout(() => { btn.textContent = orig; }, 2000);
    }).catch(() => {
      // Fallback for browsers without clipboard API
      if (postFile) localStorage.setItem(LS.caption(postFile), text);
    });
  });

  nodes.tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      nodes.tabBtns.forEach(b => b.classList.remove('active'));
      nodes.tabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
    });
  });

  // Wire filter button groups (Custo, Nível, Velocidade) and clear button
  try {
    function setActiveFilterButtons() {
      try {
        const cost = getModelFilter();
        const tier = getTierFilter();
        document.querySelectorAll('.filter-btn').forEach(b => {
          const type = b.dataset.filterType;
          const val = b.dataset.filterValue;
          if (type === 'cost') b.classList.toggle('active', val === cost);
          if (type === 'tier') b.classList.toggle('active', val === tier);
        });
      } catch (e) {}
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.filterType;
        const value = btn.dataset.filterValue;
        if (type === 'cost') setModelFilter(value);
        if (type === 'tier') setTierFilter(value);
        setActiveFilterButtons();
        renderModelList();
      });
    });

    const clearBtn = document.getElementById('clearFiltersBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        setModelFilter('all');
        setTierFilter('all');
        setLatencyFilter('all');
        setActiveFilterButtons();
        renderModelList();
      });
    }

    // initialize active states
    setActiveFilterButtons();
  } catch (err) {
    // ignore if elements not present
  }

  nodes.btnDownload.addEventListener('click', async () => {
    const btn = nodes.btnDownload;
    btn.classList.add('loading');
    btn.innerHTML = SVG_DOWNLOAD + ' Gerando…';
    try {
      const canvas = await html2canvas(nodes.frame.contentDocument.body, {
        width: POST.W,
        height: POST.H,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        windowWidth: POST.W,
        windowHeight: POST.H,
        scrollX: 0,
        scrollY: 0,
      });
      // data: URIs do not trigger download on iOS Safari — blob: URLs do (iOS 13+)
      const filename = `${(postFile || 'post').replace(/\.html$/, '')}.png`;
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = filename;
      link.href = blobUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (err) {
      alert('Erro ao gerar PNG: ' + err.message);
    } finally {
      btn.classList.remove('loading');
      btn.innerHTML = SVG_DOWNLOAD + ' Baixar PNG';
    }
  });

  nodes.btnGerar.addEventListener('click', async () => {
    const apiKey = localStorage.getItem(LS.apiKey) || '';
    const prompt = nodes.iaPrompt.value.trim();
    if (!apiKey) {
      nodes.iaStatus.textContent = 'Insira sua API key do OpenRouter.';
      nodes.iaStatus.className = 'ia-status error';
      return;
    }
    if (!prompt) {
      nodes.iaStatus.textContent = 'Escreva um prompt antes de gerar.';
      nodes.iaStatus.className = 'ia-status error';
      return;
    }

    nodes.btnGerar.classList.add('loading');
    nodes.btnGerar.innerHTML = SVG_GENERATE + ' Gerando…';
    nodes.iaStatus.textContent = '';
    nodes.iaStatus.className = 'ia-status';

    try {
      const cfg = readJSON(LS.cfg, {});
      const systemPrompt = cfg.systemPrompt || AI_PROMPTS.content;
      const context = cfg.context || '';
      const currentVars = getVarsFromDOM();
      const varKeys = Object.keys(currentVars).join(', ');
      const threadKey = postFile ? LS.thread(postFile) : null;
      const storedThread = threadKey ? readJSON(threadKey, []) : [];

      const request = buildAIChatRequest({
        model: getActiveModel(),
        systemPrompt,
        userSections: [
          { title: 'Contexto do projeto', content: context || '(sem contexto adicional)' },
          { title: 'Variáveis atuais', content: JSON.stringify(currentVars, null, 2) },
          { title: 'Instrução do usuário', content: prompt },
          { title: 'Tarefa', content: `Retorne SOMENTE um objeto JSON com as chaves: ${varKeys}.` },
          { title: 'Regras de saída', content: 'Pode usar HTML básico nos valores: <em>, <strong>, <br>. Não inclua explicações fora do JSON.' },
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
      logAICall('post-text', {
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
      if (!jsonStr) throw new Error('Resposta da IA não contém JSON válido.');

      applyVars(JSON.parse(jsonStr));
      nodes.iaStatus.textContent = 'Conteúdo gerado com sucesso.';
      if (threadKey) {
        const newThread = Array.isArray(storedThread) ? [...storedThread] : [];
        newThread.push({ role: 'assistant', content });
        if (newThread.length > 80) newThread.splice(0, newThread.length - 80);
        writeJSON(threadKey, newThread);
      }
    } catch (err) {
      nodes.iaStatus.textContent = formatProviderMessage(err?.message, getActiveModel());
      nodes.iaStatus.className = 'ia-status error';
      console.error(err);
    } finally {
      nodes.btnGerar.classList.remove('loading');
      nodes.btnGerar.innerHTML = SVG_GENERATE + ' Gerar com IA';
    }
  });

  nodes.postWrapper.addEventListener('click', () => {
    openZoom();
  });

  nodes.btnZoomClose.addEventListener('click', closeZoom);
  nodes.zoomOverlay.addEventListener('click', e => { if (e.target === nodes.zoomOverlay) closeZoom(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeZoom(); });

  window.addEventListener('resize', scheduleScale);
  window.addEventListener('orientationchange', scheduleScale);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', scheduleScale);
  }
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(() => scheduleScale());
    if (nodes.colLeft) observer.observe(nodes.colLeft);
    if (nodes.colRight) observer.observe(nodes.colRight);
  }

  window.addEventListener('storage', e => {
    if (e.key === LS.apiKey) {
      refreshViewerAiBtn();
      return;
    }
    if ([LS.palette, LS.palettes, LS.fontpack, LS.fontpacks, LS.typo, LS.platformInherit, LS.platformFontInherit, LS.uiTheme].includes(e.key)) {
      location.reload();
    }
  });
})();
