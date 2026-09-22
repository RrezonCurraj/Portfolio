import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'
import { ModeProvider } from './Providers'

// Mock the 3D component because JSDOM doesn't support WebGL and ESM issues
jest.mock('@/components/ThreeBackground', () => ({
  ThreeBackground: () => <div data-testid="three-bg" />
}))

it('positions Rrezon as a creative frontend specialist', () => {
  render(
    <ModeProvider>
      <Hero />
    </ModeProvider>
  )
  expect(screen.getByText(/Creative Frontend Developer/)).toBeInTheDocument()
  expect(
    screen.getByText(/motion-rich, accessible web experiences/i)
  ).toBeInTheDocument()
})
