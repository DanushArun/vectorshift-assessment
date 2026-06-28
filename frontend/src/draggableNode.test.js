// Verifies draggable node tiles expose the styling hooks used by the palette.

import { render, screen } from '@testing-library/react';
import { DraggableNode } from './draggableNode';

test('test_draggable_node_when_rendered_uses_palette_tile_classes', () => {
  render(<DraggableNode type="llm" label="LLM" tone="ai" />);

  const nodeTile = screen.getByText('LLM').closest('[draggable="true"]');

  expect(nodeTile.className).toContain('node-tile');
  expect(nodeTile.className).toContain('node-tile--ai');
});
