// Verifies the bottom bar can switch between example flows.

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SubmitButton } from './submit';
import { useStore } from './store';

const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = jest.fn();
  jest.spyOn(window, 'alert').mockImplementation(() => {});
});

afterEach(() => {
  if (originalFetch) {
    global.fetch = originalFetch;
  } else {
    delete global.fetch;
  }

  jest.restoreAllMocks();
  useStore.getState().loadExampleFlow('summary');
});

test('test_submit_bar_when_rendered_shows_four_example_buttons', () => {
  render(<SubmitButton />);

  expect(screen.getByRole('button', { name: /Load example 1/ }).textContent).toBe('1');
  expect(screen.getByRole('button', { name: /Load example 2/ }).textContent).toBe('2');
  expect(screen.getByRole('button', { name: /Load example 3/ }).textContent).toBe('3');
  expect(screen.getByRole('button', { name: /Load example 4/ }).textContent).toBe('4');
});

test('test_submit_bar_when_rendered_shows_blank_canvas_button', () => {
  render(<SubmitButton />);

  expect(screen.getByRole('button', { name: 'Start blank pipeline' }).textContent).toBe('+');
});

test('test_submit_bar_when_example_button_clicked_loads_example_flow', () => {
  render(<SubmitButton />);

  fireEvent.click(screen.getByRole('button', { name: /Load example 3/ }));

  expect(useStore.getState().activeExampleFlowId).toBe('routing');
});

test('test_submit_bar_when_blank_button_clicked_clears_canvas', () => {
  render(<SubmitButton />);

  fireEvent.click(screen.getByRole('button', { name: 'Start blank pipeline' }));

  expect(useStore.getState().nodes).toEqual([]);
});

test('test_submit_bar_when_submit_clicked_sends_current_pipeline', async () => {
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => ({ num_nodes: 5, num_edges: 4, is_dag: true }),
  });
  render(<SubmitButton />);

  fireEvent.click(screen.getByRole('button', { name: 'Submit Pipeline' }));
  await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  const [, request] = global.fetch.mock.calls[0];

  expect(JSON.parse(request.body)).toMatchObject({
    nodes: expect.any(Array),
    edges: expect.any(Array),
  });
});

test('test_submit_bar_when_parse_succeeds_alerts_pipeline_summary', async () => {
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => ({ num_nodes: 5, num_edges: 4, is_dag: true }),
  });
  render(<SubmitButton />);

  fireEvent.click(screen.getByRole('button', { name: 'Submit Pipeline' }));
  await waitFor(() => expect(window.alert).toHaveBeenCalled());

  expect(window.alert).toHaveBeenCalledWith("Pipeline summary:\nNodes: 5\nEdges: 4\nDAG: Yes");
});

test('test_submit_bar_when_parse_fails_alerts_error_message', async () => {
  global.fetch.mockResolvedValue({ ok: false, status: 500 });
  render(<SubmitButton />);

  fireEvent.click(screen.getByRole('button', { name: 'Submit Pipeline' }));
  await waitFor(() => expect(window.alert).toHaveBeenCalled());

  expect(window.alert).toHaveBeenCalledWith("Unable to parse pipeline. Please try again.");
});
