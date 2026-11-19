# Analysis

## Overview
Portfolio pessoal single-page em HTML5 e CSS puro, sem build step. Objetivo: converter visita de recrutador em contato — disponibilidade, prova de experiência e CV ficam acima da dobra.

## Structure
- `index.html` — página única, conteúdo bilíngue via atributos `data-pt` / `data-en`
- `assets/style/style.css` — tokens, layout split, responsivo e utilitários
- `assets/cv/leonam-duarte-cv-dev-jr-2026.pdf` — CV para download
- `assets/og-card.html` + `assets/images/og.png` — card social 1200×630
- `assets/images/` — favicons e apple-touch-icon
- `CHANGES.md` — histórico de iterações
- `README.md` — uso e atualização

## Hotspots
- Tradução em runtime: `apply(lang)` percorre `[data-pt][data-en]` e `[data-aria-pt][data-aria-en]`; qualquer texto novo precisa dos dois atributos.
- Texto dentro de elementos traduzidos não pode ter markup aninhado — o `textContent` apaga. Use nós separados (ex.: `<strong data-pt…>` + `<span data-pt…>`).
- Layout: grid de duas colunas, sidebar sticky; quebra em 860px. Conteúdo passou de 900px de altura, então a página rola.
- Contraste: `--text` 12.7:1, `--text-mid` 6.9:1, `--text-dim` 4.9:1 sobre `--bg` — todos passam AA.
- CV e links externos usam caminho relativo; funciona em GitHub Pages e em `file://`.

## Risks
- Conteúdo duplicado em PT e EN no HTML: edição precisa tocar os dois.
- `assets/og-card.html` é fonte do `og.png`; mudar copy exige re-render manual do PNG.
- Dependência de Google Fonts (3 famílias) — bloqueia primeiro paint se a rede falhar; CSS já declara fallbacks.

## Invariants
- Zero dependências de build e zero framework.
- Um único `index.html` público.
- Toda string visível tem par PT/EN e `aria-label` traduzido quando aplicável.

## Recommended Next Steps
- Print stylesheet para recrutador que imprime em PDF.
- Self-host das fontes para cortar requests de terceiros.
- Lighthouse/axe automatizado no CI.
