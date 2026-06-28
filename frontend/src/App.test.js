// Verifies the application header stays focused on the product name.

import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./toolbar', () => ({
  PipelineToolbar: () => <div>Toolbar</div>,
}));

jest.mock('./ui', () => ({
  PipelineUI: () => <div>Canvas</div>,
}));

jest.mock('./submit', () => ({
  SubmitButton: () => <button type="button">Submit Pipeline</button>,
}));

test('test_app_header_when_rendered_shows_only_vectorshift_branding', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: 'VectorShift' })).toBeTruthy();
  expect(screen.getByText('Shift').className).toBe('app-brand__accent');
  expect(screen.queryByText('VS')).toBeNull();
  expect(screen.queryByText('Frontend Assessment')).toBeNull();
});
