import { render, screen } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import ErrorBoundary from './index';

describe('Error Boundary', () => {
  const renderErrorBoundary = ({ children }: PropsWithChildren) =>
    render(<ErrorBoundary>{children}</ErrorBoundary>);

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    // @ts-ignore
    // eslint-disable-next-line no-console
    console.error.mockRestore();
  });

  afterEach(() => {
    // @ts-ignore
    // eslint-disable-next-line no-console
    console.error.mockClear();
  });

  it('checks children is rendered inside the boundary', () => {
    const Dummy = <div>Dummy</div>;

    renderErrorBoundary({ children: Dummy });

    expect(screen.getByText('Dummy')).toBeInTheDocument();
  });

  it('checks error image is shown when an error exist in children', () => {
    const Dummy = () => {
      throw new Error('Error Occurred');
    };

    renderErrorBoundary({ children: <Dummy /> });

    expect(screen.getByTestId('ErrorImage')).toBeInTheDocument();
  });
});
