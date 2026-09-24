import { validateContact } from '@/lib/contact';

const valid = { name: 'Ada', email: 'ada@example.com', message: 'Hello there' };

it.each([null, [], true, {}, { ...valid, name: 42 }, { ...valid, message: {} }, { ...valid, email: ['ada@example.com'] }, { ...valid, name: '  ' }, { ...valid, email: 'invalid' }, { ...valid, name: 'x'.repeat(101) }, { ...valid, message: 'x'.repeat(2001) }])('rejects invalid contact input: %j', (input) => {
  expect(validateContact(input)).toHaveProperty('error');
});

it('normalizes surrounding whitespace before sending', () => {
  expect(validateContact({ name: ' Ada ', email: ' ada@example.com ', message: ' Hello there ' })).toEqual({ data: valid });
});
