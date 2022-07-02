import { forwardRef } from 'react';
import styled from 'styled-components';

export type LoadingProps = {
  color?: string;
};

const LoadingContainer = styled.div`
  display: inline-block;
  position: relative;
  width: 20px;
  height: 20px;

  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 20px;
    height: 20px;
    border: 1px solid;
    border-radius: 50%;
    animation: loading 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: ${(props) => props.color || '#fff'} transparent transparent
      transparent;
  }

  div:nth-child(1) {
    animation-delay: -0.45s;
  }

  div:nth-child(2) {
    animation-delay: -0.3s;
  }

  div:nth-child(3) {
    animation-delay: -0.15s;
  }

  @keyframes loading {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Loading = forwardRef<HTMLDivElement, LoadingProps>(
  ({ color }: LoadingProps, ref) => {
    return (
      <LoadingContainer ref={ref} color={color} data-testid="LoadingContainer">
        <div />
        <div />
        <div />
        <div />
      </LoadingContainer>
    );
  }
);

export default Loading;
