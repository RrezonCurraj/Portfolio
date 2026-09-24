import { act, fireEvent, render, screen } from '@testing-library/react';
import { Contact } from '@/components/Contact';
import { ModeProvider } from '@/components/Providers';

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
  expect(screen.getByText('Signal received.')).toBeInTheDocument();
});

it('rejects whitespace-only input before making a request', () => {
  global.fetch = jest.fn();
  const form = fillForm();
  fireEvent.change(screen.getByLabelText('Message'), { target: { value: '   ' } });
  fireEvent.submit(form);
  expect(global.fetch).not.toHaveBeenCalled();
  expect(screen.getByText('All fields are required.')).toBeInTheDocument();
});
