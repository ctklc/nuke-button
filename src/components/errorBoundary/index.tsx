import { Component, PropsWithChildren } from 'react';
import error from '../../assets/images/error.svg';

type ErrorBoundaryState = { hasError: boolean };

export default class ErrorBoundary extends Component<
  PropsWithChildren,
  ErrorBoundaryState
> {
  constructor(props: PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <img
          src={error}
          srcSet={error}
          data-testid="ErrorImage"
          alt="Designed by katemangostar / Freepik"
          width="100%"
          loading="lazy"
        />
      );
    }

    return children;
  }
}
