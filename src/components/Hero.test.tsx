import { act, render, screen } from '@testing-library/react'
import { isInaccessible } from '@testing-library/dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
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

it('keeps the animated heading lines decorative for assistive technology', () => {
  render(<Hero />)

  expect(screen.getByRole('heading', { level: 1 })).toHaveAccessibleName('Creative Frontend Developer')
  for (const line of ['Creative', 'frontend', 'developer']) {
    expect(isInaccessible(screen.getByText(line))).toBe(true)
  }
})

it('settles both heading motions and removes scroll work when reduced motion is enabled', async () => {
  const originalMatchMedia = window.matchMedia
  const queries = new Map<string, MediaQueryList>()
  let reducedMotion = false

  window.matchMedia = (query: string) => {
    if (queries.has(query)) return queries.get(query)!
    const media = new EventTarget() as MediaQueryList
    Object.defineProperties(media, {
      matches: { get: () => query.includes('prefers-reduced-motion') ? reducedMotion : query.includes('max-width') },
      media: { value: query },
      onchange: { value: null, writable: true },
    })
    media.addListener = (listener) => media.addEventListener('change', listener as EventListener)
    media.removeListener = (listener) => media.removeEventListener('change', listener as EventListener)
    queries.set(query, media)
    return media
  }

  const view = render(<Hero />)
  try {
    act(() => { gsap.globalTimeline.time(gsap.globalTimeline.time() + 0.05) })
    const heading = screen.getByRole('heading', { level: 1 })
    const headingElements = [heading, ...heading.querySelectorAll<HTMLElement>('span')]
    expect(headingElements.some((element) => element.style.transform !== '')).toBe(true)
    const departure = ScrollTrigger.getAll().find((trigger) => trigger.trigger === heading)
    expect(departure?.animation).toBeDefined()
    act(() => { departure!.animation!.progress(0.4) })

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10))
      reducedMotion = true
      for (const [query, media] of queries) {
        if (query.includes('prefers-reduced-motion')) media.dispatchEvent(new Event('change'))
      }
    })

    for (const element of headingElements) {
      expect(element.style.transform).toBe('')
      expect(element.style.clipPath).toBe('')
      expect(element.style.opacity).toBe('')
    }
    expect(ScrollTrigger.getAll().some((trigger) => trigger.trigger === heading)).toBe(false)
    expect(heading).toHaveAccessibleName('Creative Frontend Developer')

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10))
      reducedMotion = false
      for (const [query, media] of queries) {
        if (query.includes('prefers-reduced-motion')) media.dispatchEvent(new Event('change'))
      }
    })
    expect(ScrollTrigger.getAll().some((trigger) => trigger.trigger === heading)).toBe(true)
    view.unmount()
    expect(ScrollTrigger.getAll().some((trigger) => trigger.trigger === heading)).toBe(false)
    for (const element of headingElements) expect(element.style.transform).toBe('')
  } finally {
    view.unmount()
    window.matchMedia = originalMatchMedia
  }
})
