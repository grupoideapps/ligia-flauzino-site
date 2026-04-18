/**
 * LÍGIA FLAUZINO — COMPONENTS.JS
 * Injeção de componentes reutilizáveis (Nav, Footer, WhatsApp float, SVG Sprite)
 * Funções de construção de seções comuns (PageHero, CTA, Testimonials, Steps)
 */

(function () {
    'use strict';

    const root = document.documentElement.dataset.root || '.';
    const WA_NUMBER = '5521968791867'; // Substituir pelo número real

    /* ── Utilitário ─────────────────────────────────────────── */
    function wa(msg) {
        return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    }

    /* ── SVG Sprite ─────────────────────────────────────────── */
    const SVG_SPRITE = `
<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">
    <symbol id="icon-menu" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></symbol>
    <symbol id="icon-x" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></symbol>
    <symbol id="icon-arrow-right" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></symbol>
    <symbol id="icon-arrow-left" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></symbol>
    <symbol id="icon-chevron-right" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></symbol>
    <symbol id="icon-user" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></symbol>
    <symbol id="icon-book" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></symbol>
    <symbol id="icon-mic" viewBox="0 0 24 24"><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M19 10a7 7 0 0 1-14 0"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></symbol>
    <symbol id="icon-instagram" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></symbol>
    <symbol id="icon-youtube" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></symbol>
    <symbol id="icon-whatsapp" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.97 0C5.377 0 0 5.377 0 11.97c0 2.097.546 4.07 1.499 5.785L.024 24l6.404-1.453A11.93 11.93 0 0 0 11.97 23.94C18.563 23.94 24 18.563 24 11.97 24 5.377 18.563 0 11.97 0zm0 21.862a9.895 9.895 0 0 1-5.049-1.378l-.362-.215-3.754.851.89-3.658-.236-.376A9.862 9.862 0 0 1 2.078 11.97c0-5.455 4.437-9.892 9.892-9.892 5.455 0 9.892 4.437 9.892 9.892 0 5.455-4.437 9.892-9.892 9.892z"/></symbol>
    <symbol id="icon-star" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></symbol>
    <symbol id="icon-check" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></symbol>
    <symbol id="icon-mail" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></symbol>
    <symbol id="icon-external-link" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></symbol>
    <symbol id="icon-brain" viewBox="0 0 24 24"><path d="M9.5 2a5.5 5.5 0 0 1 5.5 5.5V8h.5a4 4 0 0 1 0 8H9.5a5.5 5.5 0 1 1 0-11z"/><path d="M5.5 11.5a3 3 0 0 0 0 6"/></symbol>
    <symbol id="icon-heart" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></symbol>
    <symbol id="icon-layers" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></symbol>
    <symbol id="icon-send" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></symbol>
</svg>`;

    /* ── Nav HTML ───────────────────────────────────────────── */
    function buildNav() {
        const links = [
            { label: 'Início',             href: `${root}/index.html` },
            { label: 'Sobre',              href: `${root}/sobre.html` },
            { label: 'Análise de Perfil',  href: `${root}/servicos/analise-de-perfil.html` },
            { label: 'Mentorias',          href: `${root}/servicos/mentorias.html` },
            { label: 'Palestras',          href: `${root}/servicos/palestras.html` },
            { label: 'Livros',             href: `${root}/livros.html` },
        ];

        const navItems = links.map(link => `
            <li role="presentation">
                <a class="nav-link" role="menuitem" href="${link.href}">${link.label}</a>
            </li>
        `).join('');

        const logoSrc = `${root}/assets/logo-branco.png`;

        return `
<nav class="site-nav" role="navigation" aria-label="Menu principal">
    <div class="nav-inner">
        <a href="${root}/index.html" class="nav-logo" aria-label="Lígia Flauzino — Página inicial">
            <img src="${logoSrc}" alt="Lígia Flauzino" loading="eager">
        </a>
        <div class="nav-links-wrapper">
            <ul class="nav-links" role="menubar">
                ${navItems}
            </ul>
        </div>
        <div class="nav-actions">
            <button type="button" class="nav-cta" data-open-analise aria-label="Abrir formulário de análise de perfil">
                Agendar Análise
            </button>
            <button type="button" class="nav-toggle" aria-label="Abrir menu" aria-expanded="false" aria-controls="navMobilePanel">
                <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
                    <path class="nav-toggle-path" d="M6 10h20" />
                    <path class="nav-toggle-path" d="M6 16h20" />
                    <path class="nav-toggle-path" d="M6 22h20" />
                </svg>
            </button>
        </div>
    </div>
    <div class="nav-mobile-overlay" aria-hidden="true">
        <div class="nav-mobile-panel" id="navMobilePanel" data-state="closed">
            <div class="nav-mobile-header">
                <span class="nav-mobile-label">Menu</span>
                <button type="button" class="nav-mobile-close-btn" aria-label="Fechar menu">×</button>
            </div>
            <ul class="nav-mobile-links" role="menu">
                ${navItems}
            </ul>
            <button type="button" class="nav-cta nav-mobile-cta" data-open-analise>
                Agendar Análise
            </button>
        </div>
    </div>
</nav>`;
    }

    const MENTORIA_MODAL_HTML = `
<div class="mentoria-modal" id="mentoriaModal" aria-hidden="true">
    <div class="mentoria-backdrop" data-close tabindex="-1"></div>
    <div class="mentoria-card" role="dialog" aria-modal="true" aria-labelledby="mentoriaTitle" aria-describedby="mentoriaDesc">
        <button type="button" class="mentoria-close" data-close aria-label="Fechar formulário">×</button>
        <p class="mentoria-kicker">Análise de Perfil Comportamental</p>
        <h2 id="mentoriaTitle">Agende sua Análise de Perfil</h2>
        <p id="mentoriaDesc" class="mentoria-intro">Conte como está seu momento atual e receba um plano guiado por fé, ciência do comportamento e direção estratégica.</p>
        <form class="mentoria-form" id="mentoriaForm" novalidate>
            <label class="mentoria-field" for="mentoriaNome">
                <span>Nome Completo</span>
                <input id="mentoriaNome" name="nome" type="text" minlength="3" required placeholder="Seu nome completo" autocomplete="name">
                <small class="mentoria-hint">Mínimo 3 caracteres</small>
            </label>
            <label class="mentoria-field" for="mentoriaEmail">
                <span>Email</span>
                <input id="mentoriaEmail" name="email" type="email" required placeholder="email@exemplo.com" autocomplete="email">
                <small class="mentoria-hint">Usamos validação padrão de email</small>
            </label>
            <label class="mentoria-field" for="mentoriaTelefone">
                <span>Telefone</span>
                <input id="mentoriaTelefone" name="telefone" type="tel" required placeholder="(21) 99999-9999" autocomplete="tel">
                <small class="mentoria-hint">11 dígitos brasileiros</small>
            </label>
            <label class="mentoria-field" for="mentoriaDescricao">
                <span>Descrição do Momento Atual</span>
                <textarea id="mentoriaDescricao" name="descricao" rows="4" minlength="20" maxlength="500" required placeholder="Compartilhe o que está acontecendo agora"></textarea>
                <div class="mentoria-helper">
                    <span class="mentoria-char-count" id="mentoriaCharCount" aria-live="polite">0 / 500</span>
                    <small class="mentoria-hint">20–500 caracteres</small>
                </div>
            </label>
            <label class="mentoria-field" for="mentoriaDesafio">
                <span>Qual é seu maior desafio?</span>
                <select id="mentoriaDesafio" name="desafio" required>
                    <option value="">Selecione</option>
                    <option>Falta de direção e propósito</option>
                    <option>Relacionamentos e comunicação</option>
                    <option>Ansiedade e medo do futuro</option>
                    <option>Autoconhecimento e comportamento</option>
                    <option>Fé e confiança em Deus</option>
                    <option>Outro</option>
                </select>
            </label>
            <label class="mentoria-field" for="mentoriaOrigem">
                <span>Como você nos conheceu?</span>
                <select id="mentoriaOrigem" name="origem" required>
                    <option value="">Selecione</option>
                    <option>Instagram</option>
                    <option>Recomendação de amiga</option>
                    <option>Google/Busca</option>
                    <option>Livro "Improváveis + Resistentes"</option>
                    <option>Outro</option>
                </select>
            </label>
            <button type="submit" class="mentoria-submit" disabled>Enviar via WhatsApp</button>
        </form>
    </div>
</div>`;

    function formatPhone(value) {
        const digits = value.replace(/\D/g, '').slice(0, 11);
        if (!digits) return '';
        if (digits.length <= 2) return digits;
        if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }

    function initMentoria() {
        const modal = document.getElementById('mentoriaModal');
        if (!modal) return;
        const form = modal.querySelector('#mentoriaForm');
        const nome = modal.querySelector('#mentoriaNome');
        const email = modal.querySelector('#mentoriaEmail');
        const telefone = modal.querySelector('#mentoriaTelefone');
        const descricao = modal.querySelector('#mentoriaDescricao');
        const desafio = modal.querySelector('#mentoriaDesafio');
        const origem = modal.querySelector('#mentoriaOrigem');
        const submit = modal.querySelector('.mentoria-submit');
        const charCount = modal.querySelector('#mentoriaCharCount');

        const fields = [
            { el: nome, validator: () => nome.value.trim().length >= 3 },
            { el: email, validator: () => email.checkValidity() },
            { el: telefone, validator: () => telefone.value.replace(/\D/g, '').length === 11 },
            { el: descricao, validator: () => descricao.value.trim().length >= 20 && descricao.value.trim().length <= 500 },
            { el: desafio, validator: () => desafio.value.trim().length > 0 },
            { el: origem, validator: () => origem.value.trim().length > 0 },
        ];

        function updateFieldState(field, isValid) {
            if (!field) return;
            field.classList.toggle('is-valid', isValid);
            const hasValue = String(field.value || '').trim().length > 0;
            field.classList.toggle('is-invalid', !isValid && hasValue);
        }

        function updateSubmitState() {
            const allValid = fields.every(({ el, validator }) => {
                const isValid = validator();
                updateFieldState(el, isValid);
                return isValid;
            });
            if (submit) {
                submit.disabled = !allValid;
                submit.setAttribute('aria-disabled', String(!allValid));
            }
        }

        function resetForm() {
            if (!form) return;
            form.reset();
            if (charCount) charCount.textContent = '0 / 500';
            fields.forEach(({ el }) => {
                if (el) {
                    el.classList.remove('is-valid', 'is-invalid');
                }
            });
            updateSubmitState();
        }

        function openModal() {
            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('has-modal-open');
            nome?.focus();
        }

        function closeModal() {
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('has-modal-open');
            resetForm();
        }

        const openButtons = document.querySelectorAll('[data-open-analise], [data-open-mentoria]');
        openButtons.forEach(button => {
            button.addEventListener('click', event => {
                event.preventDefault();
                openModal();
            });
        });

        const closeNodes = modal.querySelectorAll('[data-close]');
        closeNodes.forEach(node => node.addEventListener('click', closeModal));

        modal.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                closeModal();
            }
        });

        descricao?.addEventListener('input', () => {
            if (charCount) charCount.textContent = `${descricao.value.length} / 500`;
            updateSubmitState();
        });

        telefone?.addEventListener('input', () => {
            telefone.value = formatPhone(telefone.value);
            updateSubmitState();
        });

        [nome, email, desafio, origem].forEach(field => {
            field?.addEventListener('input', updateSubmitState);
        });

        if (!form) return;
        form.addEventListener('submit', event => {
            event.preventDefault();
            if (submit && submit.disabled) return;

            const payload = {
                Nome: nome.value.trim(),
                Email: email.value.trim(),
                Telefone: telefone.value.trim(),
                Descrição: descricao.value.trim(),
                'Maior desafio': desafio.value,
                Origem: origem.value,
            };

            const message = [
                'Olá Lígia, gostaria de agendar minha Análise de Perfil.',
                ...Object.entries(payload).map(([key, value]) => `${key}: ${value}`),
            ].join('\n');

            window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
            closeModal();
        });

        updateSubmitState();
    }

    /* ── Footer HTML ────────────────────────────────────────── */
    function buildFooter() {
        const logoSrc = `${root}/assets/logo-branco.png`;
        return `
<footer class="site-footer" role="contentinfo">
    <div class="footer-inner">
        <div class="footer-brand">
            <a href="${root}/index.html" class="footer-logo" aria-label="Lígia Flauzino — Página inicial">
                <img src="${logoSrc}" alt="Lígia Flauzino" loading="lazy">
            </a>
            <p class="footer-tagline">
                "Que as nossas vidas sejam iluminadas pela luz de Cristo, para que as nossas verdades sejam como a luz da aurora que vai brilhando até ser dia perfeito."
                <cite>— Lígia Flauzino</cite>
            </p>
        </div>

        <div>
            <p class="footer-col-title">Páginas</p>
            <ul class="footer-links">
                <li><a href="${root}/index.html">Início</a></li>
                <li><a href="${root}/sobre.html">Sobre</a></li>
                <li><a href="${root}/servicos/analise-de-perfil.html">Análise de Perfil</a></li>
                <li><a href="${root}/servicos/mentorias.html">Mentorias</a></li>
                <li><a href="${root}/servicos/palestras.html">Palestras</a></li>
                <li><a href="${root}/livros.html">Livros</a></li>
                <li><a href="${root}/contato.html">Contato</a></li>
            </ul>
        </div>

        <div>
            <p class="footer-col-title">Redes & Contato</p>
            <div class="footer-social">
                <a href="https://www.instagram.com/ligiaflauzino_analista" target="_blank" rel="noopener noreferrer" class="footer-social-link">
                    <svg class="icon" width="16" height="16"><use href="#icon-instagram"/></svg>
                    @ligiaflauzino_analista
                </a>
                <a href="https://youtube.com/@ligiaflauzino" target="_blank" rel="noopener noreferrer" class="footer-social-link" style="display: none;">
                    <svg class="icon" width="16" height="16"><use href="#icon-youtube"/></svg>
                    YouTube
                </a>
                <a href="${wa('Olá Lígia!')}" target="_blank" rel="noopener noreferrer" class="footer-social-link">
                    <svg class="icon" width="16" height="16" style="fill:#25D366;stroke:none"><use href="#icon-whatsapp"/></svg>
                    WhatsApp
                </a>
            </div>
        </div>
    </div>

    <div class="footer-bottom">
        <p class="footer-copyright">© 2026 Lígia Flauzino · ligiaflauzino.com.br</p>
        <p class="footer-dev">
            Desenvolvido por <a href="https://omentor.studio/mentoria" target="_blank" rel="noopener noreferrer">Grupo Ide Comunicação</a>
        </p>
    </div>
</footer>`;
    }

    /* ── WhatsApp Float ─────────────────────────────────────── */
    function buildWhatsAppFloat() {
        return `
<a href="${wa('Olá Lígia! Gostaria de saber mais sobre seus serviços.')}"
   target="_blank" rel="noopener noreferrer"
   class="whatsapp-float"
   aria-label="Falar com Lígia no WhatsApp">
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M11.97 0C5.377 0 0 5.377 0 11.97c0 2.097.546 4.07 1.499 5.785L.024 24l6.404-1.453A11.93 11.93 0 0 0 11.97 23.94C18.563 23.94 24 18.563 24 11.97 24 5.377 18.563 0 11.97 0zm0 21.862a9.895 9.895 0 0 1-5.049-1.378l-.362-.215-3.754.851.89-3.658-.236-.376A9.862 9.862 0 0 1 2.078 11.97c0-5.455 4.437-9.892 9.892-9.892 5.455 0 9.892 4.437 9.892 9.892 0 5.455-4.437 9.892-9.892 9.892z"/>
    </svg>
</a>`;
    }

    /* ── Page Hero ──────────────────────────────────────────── */
    window.renderPageHero = function ({ badge = '', title = '', titleHighlight = '', subtitle = '', ctaLabel = '', ctaHref = '', ctaOpenAnalise = false }) {
        const badgeHtml = badge
            ? `<span class="page-hero-badge">${badge}</span>` : '';

        const titleHtml = titleHighlight
            ? title.replace(titleHighlight, `<span class="highlight">${titleHighlight}</span>`)
            : title;

        const ctaHtml = ctaLabel
            ? `<div class="page-hero-cta">
                ${ctaOpenAnalise
                    ? `<button type="button" class="btn-hero-primary" data-open-analise>
                        ${ctaLabel}
                        <svg class="icon" width="15" height="15"><use href="#icon-arrow-right"/></svg>
                       </button>`
                    : `<a href="${ctaHref}" target="_blank" rel="noopener noreferrer" class="btn-hero-primary">
                        ${ctaLabel}
                        <svg class="icon" width="15" height="15"><use href="#icon-arrow-right"/></svg>
                       </a>`
                }
               </div>` : '';

        const el = document.getElementById('page-hero-root');
        if (el) {
            el.innerHTML = `
<section class="page-hero">
    <div class="page-hero-inner">
        ${badgeHtml}
        <h1 class="page-hero-title">${titleHtml}</h1>
        <p class="page-hero-subtitle">${subtitle}</p>
        ${ctaHtml}
    </div>
</section>`;
        }
    };

    /* ── CTA Section ────────────────────────────────────────── */
    window.renderCTASection = function ({ headline, body, primaryLabel, primaryHref, primaryOpenAnalise = false, secondaryLabel = '', secondaryHref = '' }) {
        const secondaryHtml = secondaryLabel && secondaryHref
            ? `<a href="${secondaryHref}" class="btn-hero-secondary">${secondaryLabel}</a>` : '';

        const primaryHtml = primaryOpenAnalise
            ? `<button type="button" class="btn-hero-primary" data-open-analise>
                ${primaryLabel}
                <svg class="icon" width="15" height="15"><use href="#icon-arrow-right"/></svg>
               </button>`
            : `<a href="${primaryHref}" target="_blank" rel="noopener noreferrer" class="btn-hero-primary">
                ${primaryLabel}
                <svg class="icon" width="15" height="15"><use href="#icon-arrow-right"/></svg>
               </a>`;

        const el = document.getElementById('cta-section-root');
        if (el) {
            el.innerHTML = `
<section class="cta-section">
    <div class="cta-inner">
        <h2 class="cta-headline">${headline}</h2>
        <p class="cta-body">${body}</p>
        <div class="cta-buttons">
            ${primaryHtml}
            ${secondaryHtml}
        </div>
    </div>
</section>`;
        }
    };

    /* ── Testimonials ───────────────────────────────────────── */
    window.renderTestimonials = function (items) {
        const el = document.getElementById('testimonials-root');
        if (!el) return;

        const cards = items.map(item => {
            const isPlaceholder = !item.quote || item.quote.startsWith('[');
            return `
<div class="testimonial-card${isPlaceholder ? ' testimonial-placeholder' : ''}">
    <p class="testimonial-quote">${isPlaceholder ? 'Depoimento em breve…' : item.quote}</p>
    <div class="testimonial-author">
        <span class="testimonial-name">${isPlaceholder ? '—' : item.author}</span>
        ${item.location && !isPlaceholder ? `<span class="testimonial-location">${item.location}</span>` : ''}
    </div>
</div>`;
        }).join('');

        el.innerHTML = `<div class="testimonials-grid">${cards}</div>`;
    };

    /* ── Steps ──────────────────────────────────────────────── */
    window.renderSteps = function (steps) {
        const el = document.getElementById('steps-root');
        if (!el) return;

        const cards = steps.map((s, i) => `
<div class="step-card">
    <span class="step-number">0${i + 1}</span>
    <h3 class="step-title">${s.title}</h3>
    <p class="step-desc">${s.desc}</p>
</div>`).join('');

        el.innerHTML = `<div class="steps-grid">${cards}</div>`;
    };

    /* ── Hamburger toggle ───────────────────────────────────── */
    function initHamburger() {
        const nav = document.querySelector('.site-nav');
        if (!nav) return;

        const toggle = nav.querySelector('.nav-toggle');
        const overlay = nav.querySelector('.nav-mobile-overlay');
        const panel = nav.querySelector('.nav-mobile-panel');
        const closeBtn = nav.querySelector('.nav-mobile-close-btn');
        const mobileLinks = nav.querySelectorAll('.nav-mobile-links a');

        function setMenuState(open) {
            if (!toggle) return;
            toggle.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
            document.body.classList.toggle('has-mobile-open', open);
            overlay?.classList.toggle('is-visible', open);
            panel?.setAttribute('data-state', open ? 'open' : 'closed');
        }

        toggle?.addEventListener('click', () => setMenuState(!toggle.classList.contains('is-open')));
        closeBtn?.addEventListener('click', () => setMenuState(false));
        overlay?.addEventListener('click', event => {
            if (event.target === overlay) setMenuState(false);
        });

        mobileLinks.forEach(link => link.addEventListener('click', () => setMenuState(false)));
    }

    /* ── Active link ────────────────────────────────────────── */
    function markActiveLink() {
        const path = window.location.pathname;
        document.querySelectorAll('.nav-links a').forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            // Normaliza comparando o final do path
            const linkPath = new URL(link.href, window.location.href).pathname;
            if (path === linkPath || (path.endsWith('/') && linkPath === path + 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    /* ── Boot ───────────────────────────────────────────────── */
    function boot() {
        // SVG sprite
        document.body.insertAdjacentHTML('afterbegin', SVG_SPRITE);

        // Nav
        const navRoot = document.getElementById('nav-root');
        if (navRoot) navRoot.outerHTML = buildNav();

        // Footer
        const footerRoot = document.getElementById('footer-root');
        if (footerRoot) footerRoot.outerHTML = buildFooter();

        // WhatsApp float
        document.body.insertAdjacentHTML('beforeend', buildWhatsAppFloat());
        document.body.insertAdjacentHTML('beforeend', MENTORIA_MODAL_HTML);

        // Hamburger + active link
        initHamburger();
        markActiveLink();
        initMentoria();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})();
