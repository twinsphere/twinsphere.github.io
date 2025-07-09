# How to contribute

Some short notes on the development/contribution workflow of the docs.

## Testing

When you follow the guide in [readme](README.md), you should have a setup to
locally deploy and view the documentation. You can use `mkdocs serve` in the
project root to start a server that will automatically pick up any
modifications.

## Submitting changes

To submit your changes, please send them in as pull request: fork the repo,
create an on-topic feature branch, perform your modifications, and finally
create a PR.

For your feature branches and commits, general recommendations apply: attempt to
create them as atomically as possible. One commit should introduce one (logical)
change, at a time. The commits in a feature branch should be thematically
related.

## Conventions

We attempt to enforce all our conventions via CI pipelines. Furthermore, you can
use `pre-commit` as described in the [readme](README.md). In general, the
following style rules apply:

- 80 character limit for headings
- 120 character limit for text and code
- 2 spaces for list indentation

Furthermore, we require that the commits follow the [Conventional
Commits](https://www.conventionalcommits.org/en/v1.0.0/) style. This convention
is also enforced by CI, and can also be checked locally via `pre-commit` hook.
