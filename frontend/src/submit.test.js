// Verifies the bottom bar can switch between example flows.

import { fireEvent, render, screen } from '@testing-library/react';
import { SubmitButton } from './submit';
import { useStore } from './store';

afterEach(() => {
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
