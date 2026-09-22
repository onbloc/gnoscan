# GnoScan Agent Guide

## Contribution Workflow

- Follow [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution rules.
- Create contribution branches and worktrees from the latest `origin/develop`.
- Open pull requests against `develop`, not `main`, unless a maintainer explicitly requests another base.
- The GitHub default branch (`main`) does not determine the contribution base. This repository-specific rule takes precedence over generic workspace branch defaults.
- Set the base explicitly when using GitHub CLI: `gh pr create --base develop`.
- Before submitting, check the PR base, commit list, and diff against `develop`; include only changes for the current task.

## Public Contributions

- Write PR titles and descriptions in English and use Conventional Commit titles.
- Keep public GitHub content self-contained; omit private issue tracker links and internal-only details.
