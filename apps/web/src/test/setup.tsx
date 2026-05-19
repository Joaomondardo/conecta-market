import React from 'react';
import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

export const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

vi.mock('lucide-react', () => ({
  TrendingUp: () => <div data-testid="trending-up" />,
  ArrowRight: () => <div data-testid="arrow-right" />,
  ShoppingBag: () => <div data-testid="shopping-bag" />,
  Store: () => <div data-testid="store" />,
  Users: () => <div data-testid="users" />,
  ShieldCheck: () => <div data-testid="shield-check" />,
  HeartHandshake: () => <div data-testid="heart-handshake" />,
}));

vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: Record<string, unknown>) => <img alt="" {...props} />
}));
