// Verifies the isolated example-flow catalog.

import { createExampleFlowState, exampleFlows } from './exampleFlows';

const getNode = (state, nodeId) => {
  return state.nodes.find((node) => node.id === nodeId);
};

const getConnectedColumnGaps = (state) => {
  return state.edges.map((edge) => (
    getNode(state, edge.target).position.x - getNode(state, edge.source).position.x
  ));
};

test('test_example_flows_when_loaded_include_four_options', () => {
  expect(exampleFlows.map((flow) => flow.id)).toEqual([
    'summary',
    'knowledge',
    'routing',
    'api',
  ]);
});

test('test_example_flow_state_when_created_returns_fresh_objects', () => {
  const firstState = createExampleFlowState('summary');
  const secondState = createExampleFlowState('summary');

  firstState.nodes[0].data.inputName = 'changed';

  expect(secondState.nodes[0].data.inputName).toBe('input_1');
});

test('test_example_flow_state_when_loaded_keeps_connected_columns_spaced', () => {
  const state = createExampleFlowState('summary');

  expect(Math.min(...getConnectedColumnGaps(state))).toBeGreaterThanOrEqual(340);
});

test('test_example_flow_state_when_summary_loaded_separates_parallel_nodes', () => {
  const state = createExampleFlowState('summary');
  const yGap = Math.abs(
    getNode(state, 'prompt-1').position.y - getNode(state, 'text-1').position.y
  );

  expect(yGap).toBeGreaterThanOrEqual(240);
});

test('test_example_flow_state_when_api_loaded_includes_cycle_for_dag_false_demo', () => {
  const state = createExampleFlowState('api');
  const edgePairs = state.edges.map((edge) => `${edge.source}->${edge.target}`);

  expect(edgePairs).toEqual(expect.arrayContaining([
    'apiRequest-1->transform-1',
    'transform-1->apiRequest-1',
  ]));
});

test('test_example_flow_state_when_knowledge_loaded_fits_default_canvas', () => {
  const state = createExampleFlowState('knowledge');
  const xPositions = state.nodes.map((node) => node.position.x);

  expect(Math.max(...xPositions) - Math.min(...xPositions)).toBeLessThanOrEqual(1280);
});

test('test_example_flow_state_when_api_loaded_uses_readable_cycle_layout', () => {
  const state = createExampleFlowState('api');

  expect(getNode(state, 'apiRequest-1').position).toEqual({ x: 420, y: 260 });
  expect(getNode(state, 'transform-1').position).toEqual({ x: 820, y: 60 });
  expect(getNode(state, 'customOutput-1').position).toEqual({ x: 1200, y: 40 });
});
