/*
 * Copyright 2025 Commonwealth Scientific and Industrial Research
 * Organisation (CSIRO) ABN 41 687 119 230.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { RendererStrings } from '@aehrc/smart-forms-renderer';

// App-owned renderer translation catalogs (see aehrc/smart-forms#1996: the renderer bundles no
// translations; consuming apps supply their own and inject them via
// rendererConfigOptions.rendererStrings). Authored as plain JSON translation files; only keys
// that differ from the renderer's English defaults need to be present.
import deCHRendererStrings from './de-CH.json';
import frCHRendererStrings from './fr-CH.json';
import itCHRendererStrings from './it-CH.json';

// dayjs locale data localises the renderer's date picker *calendar popup* (month/weekday names).
// This is also consumer-supplied: the renderer only passes adapterLocale through.
import 'dayjs/locale/de-ch';
import 'dayjs/locale/fr-ch';
import 'dayjs/locale/it-ch';

/**
 * Renderer string catalogs hosted by this app, keyed by BCP-47 locale tag.
 * English needs no entry: missing keys fall back to the renderer's built-in English defaults.
 */
const rendererStringsCatalogs: Record<string, Partial<RendererStrings>> = {
  'de-CH': deCHRendererStrings,
  'fr-CH': frCHRendererStrings,
  'it-CH': itCHRendererStrings
};

/**
 * Resolve the app-hosted translation catalog for a locale.
 * Falls back from a region-specific tag (e.g. `de-CH`) to its base language (`de`);
 * returns an empty catalog (renderer English defaults) for unknown locales.
 */
export function resolveCatalogForLocale(locale: string): Partial<RendererStrings> {
  if (rendererStringsCatalogs[locale]) {
    return rendererStringsCatalogs[locale];
  }

  const baseLanguage = locale.split('-')[0];
  return rendererStringsCatalogs[baseLanguage] ?? {};
}

/**
 * Build the renderer config options for a (possibly absent) Questionnaire.language:
 * `locale` for date formatting/calendar localisation plus the matching app-hosted
 * string catalog injected via `rendererStrings`.
 */
export function rendererConfigOptionsForLocale(language: string | undefined): {
  locale: string;
  rendererStrings: Partial<RendererStrings>;
} {
  const locale = language ?? 'en';
  return { locale, rendererStrings: resolveCatalogForLocale(locale) };
}
