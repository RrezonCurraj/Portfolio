import { act, fireEvent, render, screen } from '@testing-library/react'
import { Hero } from './Hero'
import { ModeProvider } from './Providers'

// Mock the 3D component because JSDOM doesn't support WebGL and ESM issues
jest.mock('@/components/ThreeBackground', () => ({
  ThreeBackground: ({ active }: { active: boolean }) => <div data-testid="three-bg" data-active={active} />
}))

it('pauses the particle background when the hero leaves view', async () => {
  let onIntersection: IntersectionObserverCallback = () => {};
  const observe = jest.fn();
  const disconnect = jest.fn();
  const originalObserver = global.IntersectionObserver;
  const originalScrollTo = window.scrollTo;
  global.IntersectionObserver = jest.fn().mockImplementation((callback) => {
    onIntersection = callback;
    return { observe, disconnect };
  });
  window.scrollTo = jest.fn();

  try {
    render(<ModeProvider><Hero /></ModeProvider>);
    fireEvent.mouseMove(window);
    expect(await screen.findByTestId('three-bg')).toHaveAttribute('data-active', 'true');

    act(() => { onIntersection([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver); });
    expect(screen.getByTestId('three-bg')).toHaveAttribute('data-active', 'false');
  } finally {
    global.IntersectionObserver = originalObserver;
    window.scrollTo = originalScrollTo;
  }
})

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
