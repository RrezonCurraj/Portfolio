import { act, fireEvent, render, screen } from '@testing-library/react';
import { Contact } from '@/components/Contact';
import { ModeProvider } from '@/components/Providers';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const originalFetch = global.fetch;
afterEach(() => { global.fetch = originalFetch; });

function fillForm() {
  render(<ModeProvider><Contact /></ModeProvider>);
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: ' Ada ' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ada@example.com' } });
  fireEvent.change(screen.getByLabelText('Message'), { target: { value: ' Hello ' } });
  return screen.getByRole('button', { name: /Send Message/i }).closest('form')!;
}

it('prevents duplicate requests and renders confirmation after delivery', async () => {
  let complete!: (response: Response) => void;
  global.fetch = jest.fn(() => new Promise<Response>((resolve) => { complete = resolve; }));
  const form = fillForm();
  fireEvent.submit(form);
  fireEvent.submit(form);
  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenCalledWith('/api/contact', expect.objectContaining({ body: '{"name":"Ada","email":"ada@example.com","message":"Hello"}' }));
  expect(screen.getByRole('button', { name: /Sending/i })).toBeDisabled();
  await act(async () => { complete({ ok: true, json: async () => ({ success: true }) } as Response); });
  expect(screen.getByRole('status')).toHaveTextContent('Message received.');
});

it('rejects whitespace-only input before making a request', () => {
  global.fetch = jest.fn();
  const form = fillForm();
  fireEvent.change(screen.getByLabelText('Message'), { target: { value: '   ' } });
  fireEvent.submit(form);
  expect(global.fetch).not.toHaveBeenCalled();
  expect(screen.getByText('All fields are required.')).toBeInTheDocument();
});

it('keeps contact controls usable while the closing title moves and cleans up on unmount', () => {
  const { container, unmount } = render(<ModeProvider><Contact /></ModeProvider>);
  const heading = screen.getByRole('heading', { level: 2 });
  const trigger = ScrollTrigger.getAll().find(item => item.trigger === heading);
  expect(trigger?.animation).toBeDefined();
  act(() => { trigger!.animation!.progress(0.25); });
  expect(heading.style.transform).toBe('');
  expect(screen.getByRole('button', { name: /Send Message/i })).toBeEnabled();
  expect(screen.getByLabelText('Email')).toBeVisible();
  container.querySelectorAll<HTMLElement>('form, input, textarea, button, a, p').forEach(element => {
    expect(element.style.transform).toBe('');
    expect(element.style.opacity).toBe('');
  });
  unmount();
  expect(ScrollTrigger.getAll().some(item => item.trigger === heading)).toBe(false);
});
