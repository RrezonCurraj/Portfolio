import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'

// Mock the 3D component because JSDOM doesn't support WebGL and ESM issues
jest.mock('@/components/ThreeBackground', () => ({
  ThreeBackground: () => <div data-testid="three-bg" />
}))

it('renders my name', () => {
  render(<Hero />)
  expect(screen.getByText('Frontend Developer')).toBeInTheDocument()
})