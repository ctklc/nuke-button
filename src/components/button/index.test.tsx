import { act, fireEvent, render, screen } from '@testing-library/react';
import fetch from 'jest-fetch-mock';
import { Ref } from 'react';
import NukeButton, { LoadingPosition, NukeButtonProps } from './index';

jest.setTimeout(15000);
jest.useFakeTimers();

const renderNukeButton = (
  props?: NukeButtonProps,
  ref?: Ref<HTMLButtonElement>
) => render(<NukeButton ref={ref} {...props} />);

const givenFetchSucceed = () => {
  fetch.mockResponse(JSON.stringify({}), { status: 200 });
};

const givenFetchFailed = () => {
  const errorText = 'Server Error';

  fetch.mockResponse(JSON.stringify(errorText), {
    status: 500,
    statusText: errorText
  });
};

describe('Nuke Button', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should be in default state', async () => {
    renderNukeButton();

    const tooltipItem = screen.getByText(/Ignites the fuel/i);
    const button = screen.getByRole('button', { name: /launch rocket/i });
    const loadingContainer = screen.queryByTestId('LoadingContainer');

    expect(button).toBeInTheDocument();
    expect(loadingContainer).not.toBeInTheDocument();
    expect(tooltipItem).toBeInTheDocument();
    expect(tooltipItem).not.toBeVisible();

    fireEvent.mouseOver(screen.getByTestId('TooltipContainer'));

    expect(tooltipItem).toBeVisible();

    fireEvent.mouseLeave(screen.getByTestId('TooltipContainer'));

    expect(tooltipItem).not.toBeVisible();
  });

  it('should be in disabled state when disabled prop provided', () => {
    renderNukeButton({ disabled: true });

    const button = screen.getByRole('button', { name: /launch rocket/i });
    const tooltipItem = screen.queryByText(/Ignites the fuel/i);

    expect(button).toBeDisabled();
    expect(button).toHaveStyle({
      background: '#f5f5f5',
      color: 'rgba(0, 0, 0, 0.7)'
    });
    expect(tooltipItem).not.toBeInTheDocument();
  });

  it('should be in error state when error prop provided', () => {
    renderNukeButton({ error: true });

    const button = screen.getByRole('button', { name: /launch rocket/i });
    const tooltipItem = screen.getByText(/Ignition error/i);

    expect(tooltipItem).toBeVisible();
    expect(button).toHaveStyle({
      border: '2px solid #ff0000',
      color: '#ff0000'
    });
    expect(tooltipItem).toHaveStyle({
      'background-color': '#ff0000'
    });
  });

  it('should be in loading state when loading prop provided', () => {
    renderNukeButton({ loading: true });

    const button = screen.getByRole('button', { name: /Launching/i });
    const tooltipItem = screen.getByText(/Cancel launch/i);
    const loadingContainer = screen.getByTestId('LoadingContainer');

    expect(button.lastChild).toBe(loadingContainer);
    expect(loadingContainer).toBeVisible();
    expect(loadingContainer).toHaveStyle({ 'border-color': 'ff7900' });
    expect(button).toHaveStyle({
      border: '2px solid #ff7900',
      color: '#ff7900'
    });
    expect(tooltipItem).toHaveStyle({
      'background-color': '#ff7900'
    });
  });

  it('should render loading state when button clicked and go back to default state when request succeed', async () => {
    givenFetchSucceed();
    renderNukeButton();

    fireEvent.click(screen.getByRole('button', { name: /launch rocket/i }));

    await act(async () => {
      expect(
        await screen.findByRole('button', { name: /Launching/i })
      ).toBeInTheDocument();
    });

    await act(async () => {
      expect(await screen.findByText(/Ignites the fuel/i)).toBeInTheDocument();
    });
  });

  it('should render loading state when button clicked and then error state when request failed', async () => {
    givenFetchFailed();
    renderNukeButton();

    fireEvent.click(screen.getByRole('button', { name: /launch rocket/i }));

    await act(async () => {
      expect(
        await screen.findByRole('button', { name: /Launching/i })
      ).toBeInTheDocument();
    });

    await act(async () => {
      expect(await screen.findByText(/Ignition error/i)).toBeInTheDocument();
    });
  });

  it('should render error state when button clicked and the timeout is given less then response time', async () => {
    const abortSpy = jest.spyOn(AbortController.prototype, 'abort');
    fetch.mockResponse(async () => {
      jest.advanceTimersByTime(2000);
      return '';
    });

    renderNukeButton({ timeout: 1 });

    fireEvent.click(screen.getByRole('button', { name: /launch rocket/i }));

    await act(async () => {
      expect(
        await screen.findByRole('button', { name: /Launching/i })
      ).toBeInTheDocument();
    });

    await act(async () => {
      expect(abortSpy).toHaveBeenCalled();
      expect(await screen.findByText(/Ignition error/i)).toBeInTheDocument();
    });
  });

  it('should abort the request if button clicked when in loading state and render the error state', async () => {
    const abortSpy = jest.spyOn(AbortController.prototype, 'abort');
    fetch.mockResponse(async () => {
      jest.advanceTimersByTime(5000);
      return '';
    });
    renderNukeButton();

    fireEvent.click(screen.getByRole('button', { name: /launch rocket/i }));

    await act(async () => {
      const loadingButton = await screen.findByRole('button', {
        name: /Launching/i
      });
      expect(loadingButton).toBeInTheDocument();
      fireEvent.click(loadingButton);
    });

    await act(async () => {
      expect(abortSpy).toHaveBeenCalled();
      expect(await screen.findByText(/Ignition error/i)).toBeInTheDocument();
    });
  });

  it('should send the request given api url', async () => {
    const testUrl = 'test';
    givenFetchSucceed();
    renderNukeButton({ apiUrl: testUrl });

    fireEvent.click(screen.getByRole('button', { name: /launch rocket/i }));

    await act(() => {
      expect(fetch).toHaveBeenCalledWith(testUrl, expect.anything());
    });
  });

  it('should only fire given click action if it is exist', async () => {
    const onClick = jest.fn();
    renderNukeButton({ onClick });

    fireEvent.click(screen.getByRole('button', { name: /launch rocket/i }));

    await act(() => {
      expect(onClick).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledTimes(0);
    });
  });

  it('should render loading on start if the position is given as start', async () => {
    renderNukeButton({ loadingPosition: LoadingPosition.START, loading: true });

    const button = screen.getByRole('button', { name: /Launching/i });
    const loadingContainer = screen.getByTestId('LoadingContainer');

    expect(button.firstChild).toBe(loadingContainer);
  });
});
