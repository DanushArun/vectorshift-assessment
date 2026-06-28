// Verifies the canvas opens with a useful example pipeline.

import { useStore } from './store';

afterEach(() => {
  useStore.getState().loadExampleFlow('summary');
});

test('test_store_when_initialized_contains_example_pipeline_nodes', () => {
  expect(useStore.getState().nodes.map((node) => node.type)).toEqual([
    'customInput',
    'text',
    'prompt',
    'llm',
    'customOutput',
  ]);
});

test('test_store_when_initialized_connects_example_pipeline_edges', () => {
  const edgePaths = useStore.getState().edges.map((edge) => (
    `${edge.sourceHandle}->${edge.targetHandle}`
  ));

  expect(edgePaths).toEqual([
    'customInput-1-value->prompt-1-context',
    'text-1-output->llm-1-system',
    'prompt-1-prompt->llm-1-prompt',
    'llm-1-response->customOutput-1-value',
  ]);
});

test('test_store_when_example_loaded_replaces_canvas_state', () => {
  useStore.getState().loadExampleFlow('routing');

  expect(useStore.getState().activeExampleFlowId).toBe('routing');
  expect(useStore.getState().nodes.map((node) => node.type)).toEqual([
    'customInput',
    'filter',
    'transform',
    'customOutput',
    'customOutput',
  ]);
});

test('test_store_when_blank_flow_started_clears_canvas_state', () => {
  useStore.getState().startBlankFlow();

  expect(useStore.getState()).toMatchObject({
    activeExampleFlowId: 'blank',
    nodes: [],
    edges: [],
    nodeIDs: {},
  });
});
