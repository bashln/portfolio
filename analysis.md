# Analysis

Estado do repositório em 2026-11-18. Inventário técnico do que existe hoje, não um plano.

## Overview

Portfólio pessoal single-page em HTML5 + CSS3 + JavaScript vanilla, sem build step e sem dependências de runtime. Paleta "warm graphite" (fundo `#121110`, texto `#ddd3be`, acento `#c4925a`) definida em design tokens CSS, layout split com sidebar sticky à esquerda e conteúdo à direita. Conteúdo bilíngue PT-BR/EN trocado em runtime, com preferência persistida.

## Structure

- `index.html` — 568 linhas. Markup, meta tags de SEO/Open Graph, JSON-LD `Person`, suíte de favicons e um IIFE de ~127 linhas que implementa i18n, botão de copiar e-mail e fallback de clipboard.
- `assets/style/style.css` — 678 linhas. Tokens em `:root`, reset, base, layout grid, componentes (sidebar, links, stack chips, experiência, projetos, meta row), `prefers-reduced-motion` e media queries responsivas.
- `assets/og-card.html` — 128 linhas. Fonte do card 1200×630 usado para gerar `assets/images/og.png`. Tem `robots noindex` para não ser indexado como página.
- `assets/images/` — favicons (`.ico`, 16/32/180/192/512 px) e `og.png` (1200×630, copy atual).
- `docs/screenshots/` — previews do README em JPEG: desktop 1280×1300 e mobile 390×844.
- `scripts/check-assets.mjs` — 57 linhas. Verifica se cada `href`/`src`/`url()` local resolve para um arquivo existente.
- `scripts/check-i18n.mjs` — 76 linhas. Exige o par `-pt`/`-en` em todo atributo traduzível, em uma tabela única de pares.
- `Makefile` — alvos `serve`, `lint`, `assets`, `i18n`, `check`.
- `.github/workflows/ci.yml` — lint de HTML, checagem de assets e de pares de tradução em push e pull request.
- `.htmlvalidate.json` — preset `recommended` com `void-style` e `doctype-style` desligados (formatação é do Prettier).
- `README.md` — visão geral, decisões técnicas, instalação, comportamentos observáveis e previews.
- `CHANGES.md` — histórico de iterações, com medições de overflow e contraste.

## Hotspots

- **Layout**: CSS Grid com `minmax(240px, 37%)` / `minmax(0, 63%)`, sidebar `position: sticky` + `100vh`. Um único breakpoint estrutural em 860px.
- **Compactação por altura**: media queries em `max-height: 820px` e `760px` (min-width 861px) comprimem paddings, margens e gaps. Medido em 2026-11-18: `scrollHeight` de 1183px em 1366×768 contra 1293px em 1440×900. A página rola cerca de 415px no viewport menor.
- **i18n**: nós traduzíveis usam `data-pt`/`data-en`; atributos acessíveis usam `data-aria-pt`/`data-aria-en`. Um único `apply(lang)` percorre o DOM e sincroniza texto, `<html lang>`, `<title>` e `meta[name=description]`. Ordem de precedência: `?lang=` → `localStorage` → `pt`.
- **Degradação segura**: `URLSearchParams`, `localStorage.getItem` e `setItem` estão em `try/catch`; storage bloqueado cai no idioma padrão sem erro.
- **Clipboard**: `navigator.clipboard.writeText` com fallback para `document.execCommand('copy')` em `textarea` temporário; feedback visual e anúncio via `aria-live="polite"`.
- **Acessibilidade**: landmarks semânticos, `role="group"` no agrupamento de stack, `:focus-visible` em links e botões, alvos de toque de pelo menos 24px no toggle de idioma, `.sr-only` para a live region, `prefers-reduced-motion` desligando animação de entrada e pulso do status.
- **SEO**: `canonical`, Open Graph (imagem 1200×630), `twitter:card=summary_large_image`, JSON-LD `Person`, `theme-color` e `color-scheme`.
- **Verificação**: `make check` roda `html-validate`, `scripts/check-assets.mjs` e `scripts/check-i18n.mjs`. Não há testes de comportamento.

## Risks

- Sem testes de comportamento (i18n, clipboard): a regressão só aparece em validação manual. O CI cobre HTML, referências de assets e pares de tradução, não o resultado da troca de idioma na tela.
- Fontes vêm do Google Fonts via `<link>`; bloqueio de rede ou de terceiros degrada para as fontes de fallback, sem quebra de layout.
- Conteúdo de experiência sem período e sem nome de empresa (decisão de privacidade); o recrutador não consegue datar a experiência.
- Previews em `docs/screenshots/` são estáticos. Ao mudar copy, precisam ser regeradas; o comando está no README.

## Invariants

- A página funciona com `file://` e com qualquer servidor estático; nenhuma rota, API ou variável de ambiente é necessária.
- Todo texto visível tem par `data-pt`/`data-en`, e todo `aria-label` traduzível tem par `data-aria-*` (`make i18n` falha caso contrário).
- Todo asset referenciado existe no repositório (`make assets` falha caso contrário).
- Contraste de texto atende WCAG AA no tamanho usado.
- Nenhum segredo, token ou dado de cliente no repositório.

## Recommended Next Steps

1. Adicionar teste de comportamento do toggle de idioma e do clipboard (Playwright), se o conteúdo deixar de ser estático.
2. Avaliar CV em PDF como CTA de download.
3. Regerar previews e `og.png` quando a copy mudar (comando no README).
