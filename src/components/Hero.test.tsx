import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'
import { ModeProvider } from './Providers'

// Mock the 3D component because JSDOM doesn't support WebGL and ESM issues
jest.mock('@/components/ThreeBackground', () => ({
  ThreeBackground: () => <div data-testid="three-bg" />
}))

it('renders the portfolio role', () => {
  render(
    <ModeProvider>
      <Hero />
    </ModeProvider>
  )
  expect(screen.getByText(/Frontend Developer/)).toBeInTheDocument()
})
