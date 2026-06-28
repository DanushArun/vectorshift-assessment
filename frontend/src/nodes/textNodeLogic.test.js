// Verifies Text node sizing and variable-handle derivation.

import {
  extractTextVariables,
  getTextNodeDimensions,
  getTextVariableHandles,
} from './textNodeLogic';

test('test_extract_text_variables_when_valid_tokens_present_returns_unique_names', () => {
  const variables = extractTextVariables('{{ input }} and {{userName}} then {{ input }}');

  expect(variables).toEqual(['input', 'userName']);
});

test('test_extract_text_variables_when_invalid_tokens_present_ignores_them', () => {
  const variables = extractTextVariables('{{ 123bad }} {{ has-dash }} {{ _valid }}');

  expect(variables).toEqual(['_valid']);
});

test('test_text_node_dimensions_when_text_gets_longer_increases_width', () => {
  const shortTextWidth = getTextNodeDimensions('short').width;
  const longTextWidth = getTextNodeDimensions('a much longer text value for the node').width;

  expect(longTextWidth).toBeGreaterThan(shortTextWidth);
});

test('test_text_node_dimensions_when_text_wraps_increases_height', () => {
  const oneLineHeight = getTextNodeDimensions('short').minHeight;
  const wrappedHeight = getTextNodeDimensions('line one\nline two\nline three').minHeight;

  expect(wrappedHeight).toBeGreaterThan(oneLineHeight);
});

test('test_text_variable_handles_when_variables_present_returns_left_targets', () => {
  const handles = getTextVariableHandles('{{ input }} {{ userName }}');

  expect(handles.map((handle) => `${handle.type}:${handle.position}:${handle.id}`)).toEqual([
    'target:left:input',
    'target:left:userName',
  ]);
});
