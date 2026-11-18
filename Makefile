HTML := index.html assets/og-card.html
HTMLVALIDATE := npx --yes html-validate@9

.PHONY: help serve lint assets i18n check

help:
	@printf '%s\n' \
		'make serve   Serve the site at http://localhost:8000' \
		'make lint    Validate HTML structure and accessibility rules' \
		'make assets  Verify every local asset reference resolves' \
		'make i18n    Verify every translated attribute has its pair' \
		'make check   Run all checks (same set CI runs)'

serve:
	python3 -m http.server 8000

lint:
	$(HTMLVALIDATE) $(HTML)

assets:
	node scripts/check-assets.mjs

i18n:
	node scripts/check-i18n.mjs

check: lint assets i18n
