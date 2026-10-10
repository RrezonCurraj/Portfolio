import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'
import { ModeProvider } from './Providers'

it('provides direct access to work and the downloadable CV', () => {
  render(<ModeProvider><Hero /></ModeProvider>);
  expect(screen.getByRole('heading', { level: 1 })).toHaveAccessibleName(/Creative frontend developer/i);
  expect(screen.getByRole('link', { name: /Selected work/i })).toHaveAttribute('href', '#projects');
  expect(screen.getByRole('link', { name: /Download CV/i })).toHaveAttribute('download');
})

it('positions Rrezon as a creative frontend specialist', () => {
  render(
    <ModeProvider>
      <Hero />
    </ModeProvider>
  )
  expect(screen.getByRole('heading', { level: 1, name: /Creative Frontend Developer/i })).toBeInTheDocument()
  expect(
    screen.getByText(/motion-rich, accessible web experiences/i)
  ).toBeInTheDocument()
})
