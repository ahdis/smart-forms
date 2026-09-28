# CLAUDE.md

This is the ahdis fork of [aehrc/smart-forms](https://github.com/aehrc/smart-forms).

## Remotes and branches

- `origin` → `ahdis/smart-forms` (our fork), `upstream` → `aehrc/smart-forms`.
- `main` mirrors `upstream/main` exactly. Never commit to it; only fast-forward it.
- `main-localized` is our working branch: `main` plus a small stack of fork-only commits, kept **rebased** on `main` (not merged).
- Fixes meant for upstream go on their own branch cut from `upstream/main` and are opened as PRs against `aehrc/smart-forms`. Once merged, drop the local copy from `main-localized` when rebasing.

## Fork-only commits on `main-localized`

- i18n: app locale picker and renderer string catalogs (`apps/smart-forms-app/src/locales/renderer/{de-CH,fr-CH,it-CH}.json`). Upstream deliberately bundles no translations (#1996), so these stay here.
- `honor questionnaire.language` in the playground and renderer.
- Configurable playground Source FHIR Server URL.
- CI: publish the app image to Google Artifact Registry (`.github/workflows/googleregistry.yml`).
- sdc-assemble: preserve mixed items and resolve nested subQuestionnaire placeholders, until upstream PR #2001 is merged.

## Syncing with upstream

```sh
git fetch upstream
git checkout main && git merge --ff-only upstream/main && git push origin main
git branch backup/main-localized-$(date +%F) main-localized   # safety net
git checkout main-localized && git rebase main
git push --force-with-lease origin main-localized
```

- Commits already merged upstream (e.g. a squash-merged PR of ours) show up as conflicts or empty commits during the rebase. Skip them. `git cherry -v upstream/main main-localized` or `git range-diff` shows which ones are already upstream.
- After rebasing, compare `defaultRendererStrings` in `packages/smart-forms-renderer/src/i18n/rendererStrings.ts` with our catalogs. New upstream keys don't conflict, they just show in English, so add translations for them.
- Verify before pushing: `npm ci`, `npm run build-all-deps-first-run`, `npx jest` in `packages/sdc-assemble` and `packages/sdc-template-extract`, and `npx tsc --noEmit` plus `npm test` in `apps/smart-forms-app`.
- Delete backup branches once the rebased branch has proven itself.
