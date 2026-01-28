import { cn } from './utils'

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    const result = cn('text-red-500', 'bg-blue-500')
    expect(result).toBe('text-red-500 bg-blue-500')
  })

  it('should handle conditional classes', () => {
    const result = cn('text-red-500', true && 'bg-blue-500', false && 'text-lg')
    expect(result).toBe('text-red-500 bg-blue-500')
  })

  it('should merge tailwind classes properly', () => {
    // twMerge should handle conflicting classes by keeping the last one
    const result = cn('p-4', 'p-2')
    expect(result).toBe('p-2')
  })
})
