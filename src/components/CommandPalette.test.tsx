import { act, fireEvent, render, screen } from '@testing-library/react';
import { CommandPalette, openCommandPalette } from '@/components/CommandPalette';

beforeEach(() => {
  Element.prototype.scrollIntoView = jest.fn();
});

it('exposes a modal and restores focus when dismissed', () => {
  render(<><button onClick={openCommandPalette}>Commands</button><CommandPalette /></>);
  const trigger = screen.getByRole('button', { name: 'Commands' });
  trigger.focus();
  fireEvent.click(trigger);
  expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  expect(screen.getByRole('combobox')).toHaveFocus();
  fireEvent.keyDown(window, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});

it('keeps selection valid after navigating an empty result set', () => {
  render(<CommandPalette />);
  act(() => openCommandPalette());
  const input = screen.getByRole('combobox');
  fireEvent.change(input, { target: { value: 'no matches at all' } });
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  expect(input).not.toHaveAttribute('aria-activedescendant');
  fireEvent.change(input, { target: { value: ' projects ' } });
  expect(screen.getByRole('option', { selected: true })).toHaveTextContent('View Projects');
});

it.each(['resolve', 'reject'] as const)('ignores stale clipboard completion after reopening: %s', async (outcome) => {
  let resolve!: () => void;
  let reject!: (reason: Error) => void;
  const pending = new Promise<void>((yes, no) => { resolve = yes; reject = no; });
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => pending } });
  render(<CommandPalette />);
  act(() => openCommandPalette());
  fireEvent.click(screen.getByRole('option', { name: /Copy Email/i }));
  fireEvent.keyDown(window, { key: 'Escape' });
  act(() => openCommandPalette());
  await act(async () => {
    if (outcome === 'resolve') resolve();
    else reject(new Error('Clipboard denied'));
    await pending.catch(() => {});
  });
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByRole('status')).toBeEmptyDOMElement();
});
