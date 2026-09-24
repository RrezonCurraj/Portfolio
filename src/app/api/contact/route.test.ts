/** @jest-environment node */
import { POST } from '@/app/api/contact/route';

const send = jest.fn();
jest.mock('resend', () => ({ Resend: jest.fn().mockImplementation(() => ({ emails: { send } })) }));

const originalKey = process.env.RESEND_API_KEY;
beforeEach(() => {
  process.env.RESEND_API_KEY = 'test-only';
  send.mockReset().mockResolvedValue({ data: { id: 'test' }, error: null });
});
afterEach(() => {
  if (originalKey === undefined) delete process.env.RESEND_API_KEY;
  else process.env.RESEND_API_KEY = originalKey;
  jest.restoreAllMocks();
});
const request = (body: string) => new Request('http://localhost/api/contact', { method: 'POST', body });

it.each(['{', 'null', '[]', '{"name":5,"email":"ada@example.com","message":{}}'])('rejects malformed input without sending: %s', async (body) => {
  expect((await POST(request(body))).status).toBe(400);
  expect(send).not.toHaveBeenCalled();
});

it('returns unavailable when email delivery is not configured', async () => {
  delete process.env.RESEND_API_KEY;
  expect((await POST(request('{}'))).status).toBe(503);
  expect(send).not.toHaveBeenCalled();
});

it('sends normalized contact information and confirms success', async () => {
  const response = await POST(request(JSON.stringify({ name: ' Ada ', email: ' ada@example.com ', message: ' Hello ' })));
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ success: true });
  expect(send).toHaveBeenCalledWith(expect.objectContaining({ replyTo: 'ada@example.com', text: 'Name: Ada\nEmail: ada@example.com\n\nHello' }));
});

it('does not expose delivery provider details to the visitor', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  send.mockResolvedValue({ error: { message: 'Internal provider detail' } });
  const response = await POST(request(JSON.stringify({ name: 'Ada', email: 'ada@example.com', message: 'Hello' })));
  expect(response.status).toBe(500);
  expect(JSON.stringify(await response.json())).not.toContain('Internal provider detail');
});
