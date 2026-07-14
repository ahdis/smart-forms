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

// The renderer bundles these locale catalogs (plus the English default). Unknown
// locales fall back to English, so this list mirrors what actually changes the UI.
const LOCALE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'de-CH', label: 'Deutsch (CH)' },
  { value: 'fr-CH', label: 'Français (CH)' },
  { value: 'it-CH', label: 'Italiano (CH)' }
];

function PlaygroundLocalePicker() {
  const locale = useRendererConfigStore.use.locale();
  const setRendererConfig = useRendererConfigStore.use.setRendererConfig();

  // `locale` is undefined until set; the English catalog is the effective default.
  const selectedLocale = locale ?? 'en';

  return (
    <Tooltip title="Renderer language (chrome strings, dates, validation messages)">
      <TextField
        select
        size="small"
        value={selectedLocale}
        onChange={(event) => setRendererConfig({ locale: event.target.value })}
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
