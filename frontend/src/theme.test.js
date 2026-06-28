// Verifies the UI theme uses VectorShift brand colors.

import { readFileSync } from 'fs';
import { join } from 'path';

const indexCss = readFileSync(join(__dirname, 'index.css'), 'utf8');

test('test_theme_when_loaded_uses_vectorshift_brand_tokens', () => {
  const requiredTokens = [
    '--color-page: #fffefb;',
    '--color-surface-raised: #fbf9f4;',
    '--color-border: #d9d3c5;',
    '--color-border-strong: #bfb7a4;',
    '--color-text: #0f131a;',
    '--color-accent: #5b4824;',
    '--tone-ai: #14245a;',
    '--tone-output: #7a6129;',
  ];
  const missingTokens = requiredTokens.filter((token) => !indexCss.includes(token));

  expect(missingTokens).toEqual([]);
});
