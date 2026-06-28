// Verifies the canvas viewport does not over-zoom newly dropped nodes.

import { render } from '@testing-library/react';
import { PipelineUI } from './ui';

let reactFlowProps;
let backgroundProps;

jest.mock('reactflow', () => ({
  addEdge: (edge, edges) => [...edges, edge],
  applyEdgeChanges: (_changes, edges) => edges,
  applyNodeChanges: (_changes, nodes) => nodes,
  Background: (props) => {
    backgroundProps = props;
    return null;
  },
  Controls: () => null,
  Handle: () => null,
  MarkerType: { Arrow: 'arrow' },
  MiniMap: () => null,
  Position: {
    Left: 'left',
    Right: 'right',
    Top: 'top',
    Bottom: 'bottom',
  },
  ReactFlow: (props) => {
    reactFlowProps = props;
    return <div data-testid="react-flow">{props.children}</div>;
  },
  __esModule: true,
  default: (props) => {
    reactFlowProps = props;
    return <div data-testid="react-flow">{props.children}</div>;
  },
}));

afterEach(() => {
  jest.restoreAllMocks();
});

test('test_pipeline_ui_when_rendered_does_not_emit_store_warnings', () => {
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

  render(<PipelineUI />);

  expect(warnSpy).not.toHaveBeenCalled();
});

test('test_pipeline_ui_when_fit_view_runs_caps_default_zoom', () => {
  render(<PipelineUI />);

  expect(reactFlowProps.fitViewOptions).toEqual({ maxZoom: 1, padding: 0.2 });
});

test('test_pipeline_ui_when_rendered_uses_visible_grid_dots', () => {
  render(<PipelineUI />);

  expect(backgroundProps.color).toBe('#bfb7a4');
});
