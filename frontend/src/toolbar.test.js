// Verifies the node palette exposes a semantic list of draggable tools.

import { render, screen } from '@testing-library/react';
import { PipelineToolbar } from './toolbar';

test('test_toolbar_when_rendered_exposes_node_palette_list', () => {
  render(<PipelineToolbar />);

  expect(screen.getByRole('list', { name: 'Available nodes' })).toBeTruthy();
});

test('test_toolbar_when_rendered_lists_all_node_tools', () => {
  render(<PipelineToolbar />);

  expect(screen.getAllByRole('listitem')).toHaveLength(9);
});
