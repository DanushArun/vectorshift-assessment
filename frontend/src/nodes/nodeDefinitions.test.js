// Verifies the node catalog includes the original and demo node types.

import { nodeDefinitions } from './nodeDefinitions';

test('test_node_definitions_when_loaded_include_nine_nodes', () => {
  expect(nodeDefinitions).toHaveLength(9);
});

test('test_node_definitions_when_loaded_include_original_nodes', () => {
  expect(nodeDefinitions.map((node) => node.type)).toEqual(
    expect.arrayContaining(['customInput', 'llm', 'customOutput', 'text'])
  );
});

test('test_node_definitions_when_loaded_include_demo_nodes', () => {
  expect(nodeDefinitions.map((node) => node.type)).toEqual(
    expect.arrayContaining(['prompt', 'knowledgeBase', 'filter', 'transform', 'apiRequest'])
  );
});
