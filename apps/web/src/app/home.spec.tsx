import { render, screen, waitFor } from '@testing-library/react';
import Home from './page';
import { expect, it, describe, vi } from 'vitest';

// Mock components that might cause issues in jsdom (Header, Footer, Image)
vi.mock('@/components/layout/header', () => ({
  Header: () => <header>Mock Header</header>
}));

vi.mock('@/components/layout/footer', () => ({
  Footer: () => <footer>Mock Footer</footer>
}));

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />
}));

describe('Home Integration', () => {
  it('renders products from MSW mock', async () => {
    // Render the async server component
    const Page = await Home();
    render(Page);

    // Check for hero title
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

    // Check for products from MSW
    await waitFor(() => {
      expect(screen.getByText(/Smartphone Premium/i)).toBeInTheDocument();
      expect(screen.getByText(/Notebook Ultra/i)).toBeInTheDocument();
    });
  });
});
