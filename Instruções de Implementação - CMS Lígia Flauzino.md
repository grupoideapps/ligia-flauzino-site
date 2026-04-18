# Instruções de Implementação - CMS Lígia Flauzino

## 1. NAVBAR - SUBSTITUIR ESTRUTURA ATUAL

**Implemente a navbar conforme o padrão anexo (header-2.tsx):**

- ✅ Logo "📚 Lígia Flauzino" no lado esquerdo
- ✅ Links de navegação (Desktop): Início | Sobre | Análise de Perfil | Mentorias | Palestras | Livros
- ✅ Botão CTA "Agendar Análise" em destaque (cor ouro #d4af8f)
- ✅ Menu hambúrguer responsivo (Mobile)
- ✅ Animação do hambúrguer: Rotação -45° com stroke-dasharray (300ms)
- ✅ Sticky header com backdrop-blur
- ✅ Transições rápidas (200-300ms máximo)
- ✅ Sem delays desnecessários

**Referência de animação do menu:**
- Ícone rotaciona -45° ao abrir
- Stroke-dasharray anima suavemente
- Overlay escuro ao abrir menu mobile
- Zoom-in-95 ao abrir, zoom-out-95 ao fechar

---

## 2. FORMULÁRIO DE MENTORIA - CRIAR NOVO COMPONENTE

**Crie um modal/página com formulário de inscrição:**

### Campos (Ordem Exata)
1. **Nome Completo** (text, mín 3 caracteres)
2. **Email** (email, validação padrão)
3. **Telefone** (tel, 11 dígitos brasileiros, máscara visual)
4. **Descrição do Momento Atual** (textarea, 20-500 caracteres, contador)
5. **Qual é seu maior desafio?** (select, obrigatório)
   - Falta de direção e propósito
   - Relacionamentos e comunicação
   - Ansiedade e medo do futuro
   - Autoconhecimento e comportamento
   - Fé e confiança em Deus
   - Outro
6. **Como você nos conheceu?** (select, obrigatório)
   - Instagram
   - Recomendação de amiga
   - Google/Busca
   - Livro "Improváveis + Resistentes"
   - Outro

### Validação
- ✅ Em tempo real (sem delays)
- ✅ Feedback visual instantâneo
- ✅ Campos válidos: borda #d4af8f
- ✅ Campos inválidos: borda #ff6b6b
- ✅ Botão desabilitado até todos os campos serem válidos

### Ação ao Enviar
- ✅ Construir URL WhatsApp dinamicamente
- ✅ Codificar mensagem com encodeURIComponent
- ✅ Redirecionar para: `https://wa.me/5521968791867?text=[MENSAGEM_CODIFICADA]`
- ✅ Abrir em nova aba
- ✅ Mensagem deve incluir: Nome, Email, Telefone, Descrição, Desafio, Origem

### Design
- ✅ Card com fundo rgba(212, 175, 143, 0.05)
- ✅ Borda 1px solid rgba(212, 175, 143, 0.2)
- ✅ Animações: 150-200ms máximo
- ✅ Responsivo para mobile (80% da largura)
- ✅ Acessibilidade: ARIA labels, focus states

---

## 3. HOVER EFFECTS NOS CARDS

**Adicione efeito azul ao passar mouse:**

```css
.doc-nav-item:hover {
  border-color: #4a90e2;
  box-shadow: 0 0 20px rgba(74, 144, 226, 0.3);
  background: rgba(74, 144, 226, 0.05);
  transition: all 150ms ease-out;
}
```

- ✅ Borda azul suave #4a90e2
- ✅ Sombra com glow azul
- ✅ Transição rápida (150ms)
- ✅ Transform: translateY(-4px) opcional

---

## 4. OTIMIZAÇÕES DE PERFORMANCE

- ✅ Remover animações lentas (> 300ms)
- ✅ Usar CSS transitions ao invés de JavaScript
- ✅ Lazy load de imagens
- ✅ Minificar CSS/JS
- ✅ Validação sem setTimeout (instantânea)

---

## 5. INTEGRAÇÃO DO FORMULÁRIO

**Opções de implementação:**

**Opção A (Recomendada):** Modal que abre ao clicar em "Agendar Análise" ou "Agendar Mentoria"

**Opção B:** Página separada linkada na navbar

**Opção C:** Componente reutilizável em múltiplos locais

---

## 6. CONTATOS DE LÍGIA

- **WhatsApp:** 21 968791867
- **Email:** ligiacoelhoflauzino@gmail.com

---

## CHECKLIST FINAL

- [ ] Navbar implementada conforme padrão
- [ ] Menu hambúrguer com animação rápida
- [ ] Links de navegação funcionando
- [ ] Botão "Agendar Análise" em destaque
- [ ] Formulário com 6 campos
- [ ] Validação em tempo real
- [ ] Redirecionamento WhatsApp funcionando
- [ ] Hover effects azuis nos cards
- [ ] Responsivo para mobile
- [ ] Animações rápidas (< 300ms)
- [ ] Sem delays desnecessários
- [ ] Acessibilidade verificada
- [ ] Testado em desktop e mobile
