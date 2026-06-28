// Verifies the shared node renderer applies Text node dynamic behavior.

import { render, screen } from '@testing-library/react';
import { BaseNode } from './BaseNode';
import { getNodeDefinition } from './nodeDefinitions';
import { getTextNodeDimensions } from './textNodeLogic';

jest.mock('reactflow', () => ({
  addEdge: (edge, edges) => [...edges, edge],
  applyEdgeChanges: (_changes, edges) => edges,
  applyNodeChanges: (_changes, nodes) => nodes,
  Handle: ({ id, position, style, type }) => (
    <div data-handle-id={id} data-position={position} data-testid="handle" data-type={type} />
  ),
  MarkerType: { Arrow: 'arrow' },
  Position: {
    Left: 'left',
    Right: 'right',
    Top: 'top',
    Bottom: 'bottom',
  },
}));

test('test_base_node_when_text_node_rendered_uses_textarea_field', () => {
  render(<BaseNode id="text-1" data={{ text: 'hello' }} definition={getNodeDefinition('text')} />);

  expect(screen.getByRole('textbox', { name: 'Text' }).tagName).toBe('TEXTAREA');
});

test('test_base_node_when_text_is_long_applies_dynamic_width', () => {
  const text = 'a much longer text value that should widen the rendered node';
  render(<BaseNode id="text-1" data={{ text }} definition={getNodeDefinition('text')} />);

  expect(screen.getByRole('textbox', { name: 'Text' }).closest('.pipeline-node').style.width).toBe(
    `${getTextNodeDimensions(text).width}px`
  );
});

test('test_base_node_when_text_has_variables_renders_variable_handles', () => {
  render(
    <BaseNode
      id="text-1"
      data={{ text: '{{ input }} and {{ userName }}' }}
      definition={getNodeDefinition('text')}
    />
  );

  expect(screen.getAllByTestId('handle').map((handle) => handle.dataset.handleId)).toEqual([
    'text-1-input',
    'text-1-userName',
    'text-1-output',
  ]);
});
