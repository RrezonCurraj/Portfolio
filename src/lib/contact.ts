export const contactLimits = { name: 100, email: 254, message: 2000 } as const;

type ContactMessage = { name: string; email: string; message: string };
type ContactValidation = { data: ContactMessage; error?: never } | { error: string; data?: never };

export function validateContact(input: unknown): ContactValidation {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { error: 'All fields are required.' };
  }
  const fields = input as Record<string, unknown>;
  if (typeof fields.name !== 'string' || typeof fields.email !== 'string' || typeof fields.message !== 'string') {
    return { error: 'All fields are required.' };
  }
  const name = fields.name.trim();
  const email = fields.email.trim();
  const message = fields.message.trim();
  if (!name || !email || !message) return { error: 'All fields are required.' };
  if (name.length > contactLimits.name || email.length > contactLimits.email || message.length > contactLimits.message) {
    return { error: 'One or more fields exceed the allowed length.' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Invalid email address.' };
  return { data: { name, email, message } };
}
