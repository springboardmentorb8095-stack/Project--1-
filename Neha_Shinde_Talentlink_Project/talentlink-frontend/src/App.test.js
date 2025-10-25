import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders TalentLink homepage', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  const brandElement = screen.getByText(/TalentLink/i);
  expect(brandElement).toBeInTheDocument();
});
