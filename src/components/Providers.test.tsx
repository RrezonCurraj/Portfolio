import { StrictMode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ModeProvider, useMode } from '@/components/Providers';
import { RecruiterDashboard } from '@/components/RecruiterDashboard';

function Toggle() {
  const { toggleMode, isRecruiterMode } = useMode();
  return <button onClick={toggleMode} aria-pressed={isRecruiterMode}>Recruiter</button>;
}

it('synchronizes and cleans up recruiter styling under Strict Mode', () => {
  const { unmount } = render(<StrictMode><ModeProvider><Toggle /></ModeProvider></StrictMode>);
  fireEvent.click(screen.getByRole('button'));
  expect(document.documentElement).toHaveClass('recruiter-mode');
  fireEvent.click(screen.getByRole('button'));
  expect(document.documentElement).not.toHaveClass('recruiter-mode');
  fireEvent.click(screen.getByRole('button'));
  unmount();
  expect(document.documentElement).not.toHaveClass('recruiter-mode');
});

it('provides navigation destinations in the recruiter view', () => {
  const { container } = render(<RecruiterDashboard />);
  for (const id of ['about', 'skills', 'projects', 'contributions', 'experience', 'contact']) {
    expect(container.querySelectorAll(`#${id}`)).toHaveLength(1);
    expect(container.querySelector(`#${id}`)?.querySelector('h2')).toBeTruthy();
  }
});
