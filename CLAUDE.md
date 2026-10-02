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
- sdc-template-extract: evaluate `%resource` against the comparison response in modified-only extract, until upstream PR #2133 is merged.
- app: show `$validate` errors and a "Copy JSON" button in the write-back dialog, until upstream PR #2135 is merged.

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

## Releases

- Tag `main-localized` with the next `vX.Y.Z` (annotated) and push the tag. The tag push runs `googleregistry.yml`, which publishes `europe-west6-docker.pkg.dev/ahdis-ch/ahdis/smart-forms:vX.Y.Z`. Deploy by bumping the image tag in `k8s-fhir.ch/ahdis-infomaniak/smartforms-ahdis-ch/deployment.yaml`.
- A GitHub release is optional. Publishing one also fires upstream's `publish_*.yml` npm workflows (`publish_smart_forms_renderer.yml` matches any `v*` tag). Only create a release while those workflows are disabled on the fork (Actions → workflow → Disable). Otherwise cancel the run immediately.
- Upstream's `deploy_app.yml` and `deploy_docs.yml` need CSIRO's AWS role and Chromatic token and always fail on the fork. They are meant to stay disabled here.
