# GnoScan Agent Guide

## Contribution Workflow

- Follow [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution rules.
- Create contribution branches and worktrees from the latest `origin/develop`.
- Open pull requests against `develop`, not `main`, unless a maintainer explicitly requests another base.
- `develop` is the default branch. `main` is the release candidate branch and is only updated through `develop` → `main` pull requests.
- Production deploys run only through the `release` workflow (tag `vX.Y.Z`); merging to `main` does not deploy.
- Set the base explicitly when using GitHub CLI: `gh pr create --base develop`.
- Before submitting, check the PR base, commit list, and diff against `develop`; include only changes for the current task.

## Public Contributions

- Write PR titles and descriptions in English and use Conventional Commit titles.
- Keep public GitHub content self-contained; omit private issue tracker links and internal-only details.
