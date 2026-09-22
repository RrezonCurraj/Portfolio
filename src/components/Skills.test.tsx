import { render, screen } from '@testing-library/react'
import { Skills } from './Skills'

it('separates core expertise from supporting technologies', () => {
  render(<Skills />)

  expect(screen.getByRole('heading', { name: 'Core Expertise' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Creative & Interaction' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Supporting Technologies' })).toBeInTheDocument()
})
