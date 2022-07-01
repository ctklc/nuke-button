import { forwardRef, PropsWithChildren } from 'react';
import styled from 'styled-components';

export type TooltipProps = {
  text?: string;
  disabled?: boolean;
  bgColor?: string;
  textColor?: string;
};

const TooltipItem = styled.span<Pick<TooltipProps, 'bgColor' | 'textColor'>>`
  display: none;
  position: absolute;
  width: 133px;
  height: 30px;
  z-index: 1000;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 30px;
  background-color: ${(props) => props.bgColor};
  color: ${(props) => props.color};
  top: calc(100% + 7px);

  &:before {
    z-index: -1;
    content: '';
    width: 0;
    height: 0;
    left: 55px;
    top: -10px;
    position: absolute;
    border: 10px solid ${(props) => props.bgColor};
    transform: rotate(135deg);
    transition: border 0.3s ease-in-out;
  }
`;

const TooltipContainer = styled.div`
  position: relative;
  width: 133px;
  margin: 10px;

  :hover > ${TooltipItem} {
    display: block;
  }
`;

const Tooltip = forwardRef<HTMLDivElement, PropsWithChildren<TooltipProps>>(
  ({ children, text, disabled, bgColor = '#000', textColor = '#fff' }, ref) => {
    return (
      <TooltipContainer ref={ref}>
        {children}
        {!disabled && (
          <TooltipItem bgColor={bgColor} color={textColor}>
            {text}
          </TooltipItem>
        )}
      </TooltipContainer>
    );
  }
);

export default Tooltip;
