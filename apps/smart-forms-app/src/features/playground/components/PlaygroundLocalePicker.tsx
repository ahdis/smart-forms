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

import { useRendererConfigStore } from '@aehrc/smart-forms-renderer';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import TranslateIcon from '@mui/icons-material/Translate';
import { InputAdornment, Tooltip } from '@mui/material';
import { rendererConfigOptionsForLocale } from '../../../locales/renderer/rendererStringsCatalogs.ts';

// This app hosts these renderer translation catalogs (see src/locales/renderer); the renderer
// itself bundles no translations. Unknown locales fall back to the renderer's English defaults,
// so this list mirrors what actually changes the UI.
const LOCALE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'de-CH', label: 'Deutsch (CH)' },
  { value: 'fr-CH', label: 'Français (CH)' },
  { value: 'it-CH', label: 'Italiano (CH)' }
];

function PlaygroundLocalePicker() {
  const locale = useRendererConfigStore.use.locale();
  const setRendererConfig = useRendererConfigStore.use.setRendererConfig();

  // The store's locale is not always one of the options below: it is undefined until set, it is the
  // app default (`en-AU`) for questionnaires declaring no language or a bare `en`, and it is
  // whatever `Questionnaire.language` says for a form built from the editor. Anything unlisted
  // shows as English rather than leaving MUI with an out-of-range value.
  const selectedLocale =
    locale && LOCALE_OPTIONS.some((option) => option.value === locale) ? locale : 'en';

  return (
    // disableInteractive: otherwise the hover tooltip overlays the opened dropdown and intercepts clicks on the options
    <Tooltip
      title="Renderer language (chrome strings, dates, validation messages)"
      disableInteractive>
      <TextField
        select
        size="small"
        value={selectedLocale}
        onChange={(event) =>
          // Same resolution as building a form from a Questionnaire.language, so picking "English"
          // here yields the same dates as a questionnaire that declares none. Setting `locale`
          // raw would hand Intl a bare `en` and switch dates to the US MM/DD/YYYY order.
          setRendererConfig(rendererConfigOptionsForLocale(event.target.value))
        }
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <TranslateIcon fontSize="small" />
              </InputAdornment>
            )
          }
        }}
        sx={{ minWidth: 160, '& .MuiInputBase-root': { height: 32 } }}>
        {LOCALE_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Tooltip>
  );
}

export default PlaygroundLocalePicker;
