FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim

RUN ["uv", "pip", "install", "--system", "mkdocs", "mkdocs-open-in-new-tab", "mkdocs-link-marker", "mkdocs-spellcheck[all]"]

VOLUME /docs
WORKDIR /docs

ENTRYPOINT []
CMD ["uv", "run", "mkdocs", "serve", "--dev-addr", "0.0.0.0:8000", "--strict"]
