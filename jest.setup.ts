import '@testing-library/jest-dom'

// Mock window.matchMedia for GSAP
if (typeof window !== 'undefined') Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})


// JSDOM has no viewport scrolling; GSAP still calls this during layout refresh.
if (typeof window !== 'undefined') window.scrollTo = jest.fn();
