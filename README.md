# twinsphere Documentation

<!-- markdown-link-check-disable -->

[![pre-commit](https://img.shields.io/badge/pre--commit-enabled-brightgreen?logo=pre-commit)](https://github.com/pre-commit/pre-commit)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

<!-- markdown-link-check-enable -->

Documentation for the twinsphere toolsuite.

## Development

The documentation is written in
[markdown](https://daringfireball.net/projects/markdown/), and published with
[MkDocs](https://www.mkdocs.org/). Please refer to their respective websites for
details.

### Local Deployment

For local development you can either use your native Python installation, or use the supplied [Dockerfile](Dockerfile).

#### Native Python installation

Please first install the following dependencies:

- [pipx](https://github.com/pypa/pipx)
- [MkDocs](https://www.mkdocs.org/)
- [mkdocs-open-in-new-tab](https://github.com/JakubAndrysek/mkdocs-open-in-new-tab)
- [mkdocs-link-marker](https://github.com/timmeinerzhagen/mkdocs-link-marker)

Like so:

```bash
# Adjust to the package manager of your development system. See pipx above for alternatives.
sudo apt -y update && sudo apt install pipx

# Install mkdocs and the necessary plugins
pipx install mkdocs
pipx inject mkdocs mkdocs-open-in-new-tab
pipx inject mkdocs-link-marker
pipx inject mkdocs-spellcheck[all]
```

Using this, you should now be able to locally deploy the documentation from the
repo's directory like this:

```bash
pipx serve mkdocs
```

#### Dockerized environment

We provide a slim [Dockerfile](Dockerfile) for local development so you don't need to install the development directly
on your host environment. To this end, first ensure that you have a functional docker setup on your system. Then build
the provided Dockerfile:

```bash
docker build -t mkdocs-dev .
```

After the build succeeded, you can now launch an mkdocs server as follows:

```bash
# Ensure you are in the correct directory
cd /path/to/your/repo/twinsphere.github.io

docker run --rm -p 8000:8000 -v "$PWD":/docs mkdocs-dev

INFO    -  Building documentation...
INFO    -  Cleaning site directory
INFO    -  Documentation built in 0.25 seconds
INFO    -  [07:26:53] Watching paths for changes: 'docs', 'mkdocs.yml'
INFO    -  [07:26:53] Serving on http://127.0.0.1:8000/
```

**Note**: the dockerized environment is solely for development purposes and not meant for actual deployments.

### Optional Dependencies and Additional Checks

This project additionally provides a `.pre-commit-config.yaml` to run some
checks as pre-commit hooks. See the `git` documentation on [git
hooks](https://git-scm.com/book/ms/v2/Customizing-Git-Git-Hooks) and the
documentation of [pre-commit](https://pre-commit.com/) for further details.

To enable the hooks, install `pre-commit` and setup the hooks:

```bash
pipx install pre-commit

# ensure you are in the repo
pre-commit install
```

You can now ensure that the hooks work by invoking them manually:

```bash
pre-commit run --all-files
```

Furthermore, the hooks should now be automatically invoked when running `git
commit`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.
