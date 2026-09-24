import { render } from '@testing-library/react';
import gsap from 'gsap';
import { TextReveal } from '@/components/ui/TextReveal';
import { ModeProvider } from '@/components/Providers';

it('preserves entrance animations when interaction colors change', () => {
  const { container, rerender } = render(<ModeProvider><TextReveal activeColor="red">Projects</TextReveal></ModeProvider>);
  const outer = container.querySelector('.char-outer')!;
  const entrance = gsap.getTweensOf(outer).find((tween) => tween.vars.opacity === 1);
  expect(entrance).toBeDefined();
  rerender(<ModeProvider><TextReveal activeColor="blue">Projects</TextReveal></ModeProvider>);
  entrance!.progress(1);
  expect(outer).toHaveStyle({ opacity: "1" });
});
