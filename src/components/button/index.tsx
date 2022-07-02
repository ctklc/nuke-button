import styled, { css } from 'styled-components';
import { forwardRef, MouseEvent, MouseEventHandler, useState } from 'react';
import { getDelay } from '../../api';
import Loading from '../loading';
import Tooltip, { TooltipProps } from '../tooltip';

export enum LoadingPosition {
  START,
  END
}
export type StyledButtonProps = {
  error?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
};
// I also added buttons' texts and tooltips' texts as props, but then realised
// that there is no requirement for that and removed those fyi.
export type NukeButtonProps = {
  apiUrl?: string;
  error?: boolean;
  loading?: boolean;
  disabled?: boolean;
  loadingPosition?: LoadingPosition;
  /**
   * It will disable internal request management if its exist.
   */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /**
   * Seconds
   */
  timeout?: number;
};
type Query = {
  loading: boolean;
  isError: boolean;
};

export const Button = styled.button<StyledButtonProps>`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 133px;
  height: 40px;
  font-family: 'Roboto', serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #000000;
  background: #ffffff;
  border: 2px solid #000000;
  cursor: pointer;

  ${({ error }) =>
    error &&
    css`
      color: #ff0000;
      border: 2px solid #ff0000;
    `};

  ${({ disabled }) =>
    disabled &&
    css`
      background: #f5f5f5;
      color: rgba(0, 0, 0, 0.7);
    `};

  ${({ isLoading }) =>
    isLoading &&
    css`
      color: #ff7900;
      background: #f5f5f5;
      border: 2px solid #ff7900;
    `};
`;

const defaultLoadingColor = '#ff7900';
const defaults = {
  idle: {
    text: 'Launch Rocket',
    tooltip: { text: 'Ignites the fuel' }
  },
  error: {
    text: 'Launch Rocket',
    tooltip: { text: 'Ignition error', bgColor: '#FF0000', displayAlways: true }
  },
  loading: {
    text: 'Launching',
    tooltip: { text: 'Cancel launch', bgColor: defaultLoadingColor }
  },
  disabled: {
    text: 'Launch Rocket',
    tooltip: { disabled: true }
  }
};
const defaultNukeButtonProps = {
  loadingPosition: LoadingPosition.END
};

let controller = new AbortController();

const NukeButton = forwardRef<HTMLButtonElement, NukeButtonProps>(
  (
    {
      apiUrl,
      loading,
      error,
      disabled,
      timeout,
      onClick,
      loadingPosition = LoadingPosition.END
    }: NukeButtonProps = defaultNukeButtonProps,
    ref = null
  ) => {
    const [query, setQuery] = useState<Query>({
      loading: false,
      isError: false
    });

    const derivedLoading = !disabled && (loading || query.loading);
    const derivedError = !disabled && (error || query.isError);

    const abortRequest = () => {
      controller.abort();
      controller = new AbortController();
    };

    const handleClick = (e?: MouseEvent<HTMLButtonElement>) => {
      if (onClick) onClick(e as MouseEvent<HTMLButtonElement>);
      else if (derivedLoading) abortRequest();
      else {
        setQuery({ loading: true, isError: false });
        if (timeout) setTimeout(() => abortRequest(), timeout * 1000);
        getDelay(apiUrl, controller.signal)
          .then(() => setQuery((prev) => ({ ...prev, loading: false })))
          .catch(() => setQuery({ loading: false, isError: true }));
      }
    };

    const getTooltipProps = (): TooltipProps => {
      if (disabled) return defaults.disabled.tooltip;
      if (derivedLoading) return defaults.loading.tooltip;
      if (derivedError) return defaults.error.tooltip;
      return defaults.idle.tooltip;
    };

    const getButtonText = () => {
      if (derivedLoading) return defaults.loading.text;
      if (disabled) return defaults.disabled.text;
      if (derivedError) return defaults.error.text;
      return defaults.idle.text;
    };

    const buttonText = getButtonText();

    return (
      <Tooltip {...getTooltipProps()}>
        <Button
          ref={ref}
          type="button"
          aria-label={buttonText}
          disabled={disabled}
          error={derivedError}
          isLoading={derivedLoading}
          onClick={handleClick}
        >
          {derivedLoading && loadingPosition === LoadingPosition.START && (
            <Loading color={defaultLoadingColor} />
          )}
          {buttonText}
          {derivedLoading && loadingPosition === LoadingPosition.END && (
            <Loading color={defaultLoadingColor} />
          )}
        </Button>
      </Tooltip>
    );
  }
);

export default NukeButton;
