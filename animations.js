/**
 * LÍGIA FLAUZINO — ANIMATIONS.JS
 * Módulo ES6 — toda lógica Anime.js v4 centralizada
 * Padrão idêntico ao viewer entrega-mentoria-ligia-flauzino/index.html
 */

import { createTimeline, animate, stagger }
    from 'https://cdn.jsdelivr.net/npm/animejs@4.0.2/lib/anime.esm.min.js';

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Utilitário: pré-esconder elementos ─────────────────────── */
function preHide(selectors) {
    if (prefersReduced) return;
    selectors.forEach(sel => {
        const el = typeof sel === 'string' ? document.querySelector(sel) : sel;
        if (!el) return;
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
    });
}

/* ============================================================
   1. HOME HERO TIMELINE
   ============================================================ */
export function initHeroTimeline() {
    if (prefersReduced) return;

    preHide([
        '.hero-brand-logo',
        '.hero-badge',
        '.hero-title',
        '.hero-description',
        '.hero-buttons',
        '.hero-photo-main',
    ]);

    const tl = createTimeline({ defaults: { ease: 'outExpo' } });

    tl.add('.hero-brand-logo', { opacity: [0, 1], translateY: [24, 0], duration: 900 }, 120);
    tl.add('.hero-badge',      { opacity: [0, 1], translateY: [16, 0], duration: 700 }, 600);
    tl.add('.hero-title',      { opacity: [0, 1], translateY: [20, 0], duration: 800, ease: 'outQuart' }, 820);
    tl.add('.hero-description',{ opacity: [0, 1], translateY: [16, 0], duration: 650 }, 1080);
    tl.add('.hero-buttons',    { opacity: [0, 1], translateY: [12, 0], duration: 600 }, 1280);
    tl.add('.hero-photo-main', { opacity: [0, 1], translateY: [32, 0], duration: 1000, ease: 'outQuart' }, 500);
}

/* ============================================================
   2. PAGE HERO (páginas internas)
   ============================================================ */
export function initPageHeroAnimation() {
    if (prefersReduced) return;

    const els = ['.page-hero-badge', '.page-hero-title', '.page-hero-subtitle', '.page-hero-cta'];
    preHide(els);

    const tl = createTimeline({ defaults: { ease: 'outQuart' } });
    els.forEach((sel, i) => {
        const el = document.querySelector(sel);
        if (!el) return;
        tl.add(el, { opacity: [0, 1], translateY: [20, 0], duration: 700 }, 100 + i * 150);
    });
}

/* ============================================================
   3. REVEALS IMEDIATOS (sem dependência de scroll)
   ============================================================ */
export function initScrollReveals() {
    if (prefersReduced) {
        document.querySelectorAll('.reveal-on-scroll').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }

    const elements = [...document.querySelectorAll('.reveal-on-scroll')];
    if (!elements.length) return;

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
    });

    animate(elements, {
        opacity: [0, 1],
        translateY: [24, 0],
        duration: 260,
        ease: 'outQuad',
        delay: stagger(60, { start: 80 }),
    });
}

/* ============================================================
   4. CARD STAGGER (grids de cards) — sem dependência de scroll
   ============================================================ */
export function initCardStagger(containerSelector, delay = 80) {
    if (prefersReduced) return;

    const container = document.querySelector(containerSelector);
    if (!container) return;

    const cards = [...container.children];
    if (!cards.length) return;

    cards.forEach(c => {
        c.style.opacity = '0';
        c.style.transform = 'translateY(20px)';
    });

    animate(cards, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 550,
        ease: 'outQuart',
        delay: stagger(delay, { start: 60 }),
    });
}

/* ============================================================
   5. BUTTON HOVER MICROINTERACTION
   ============================================================ */
export function initButtonHover(selector = '.btn-hero-primary') {
    if (prefersReduced) return;

    document.querySelectorAll(selector).forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            animate(btn, { scale: [1, 1.03], duration: 220, ease: 'outQuad' });
        });
        btn.addEventListener('mouseleave', () => {
            animate(btn, { scale: [1.03, 1], duration: 300, ease: 'outQuart' });
        });
    });
}

/* ============================================================
   6. MANIFESTO REVEAL — imediato (sem scroll)
   ============================================================ */
export function initManifestoReveal() {
    if (prefersReduced) return;

    const el = document.querySelector('.manifesto-inner');
    if (!el) return;

    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';

    animate(el, {
        opacity: [0, 1],
        translateY: [28, 0],
        duration: 280,
        ease: 'outQuad',
        delay: 200,
    });
}

/* ============================================================
   7. WHATSAPP FLOAT PULSE
   ============================================================ */
export function initWhatsAppFloat() {
    if (prefersReduced) return;

    const btn = document.querySelector('.whatsapp-float');
    if (!btn) return;

    // Entrada rápida sem delays longos
    btn.style.opacity = '0';
    btn.style.transform = 'scale(0.7)';
    animate(btn, {
        opacity: [0, 1],
        scale: [0.7, 1],
        duration: 280,
        ease: 'outBack',
    });

    btn.addEventListener('mouseenter', () => {
        animate(btn, { scale: [1, 1.08], duration: 220, ease: 'outQuad' });
    });
    btn.addEventListener('mouseleave', () => {
        animate(btn, { scale: [1.08, 1], duration: 300, ease: 'outQuart' });
    });
}

/* ============================================================
   8. BOOK CARDS REVEAL — imediato (sem scroll)
   ============================================================ */
export function initBookReveal() {
    if (prefersReduced) return;

    const cards = [...document.querySelectorAll('.book-card')];
    if (!cards.length) return;

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(28px)';
    });

    animate(cards, {
        opacity: [0, 1],
        translateY: [28, 0],
        duration: 550,
        ease: 'outQuart',
        delay: stagger(100, { start: 80 }),
    });
}
