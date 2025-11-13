local:
	uvx --with "mkdocs-open-in-new-tab" --with "mkdocs-link-marker" --with "mkdocs-spellcheck[all]" mkdocs serve --livereload

precommit:
	pre-commit run --all-files

.PHONY: local precommit
