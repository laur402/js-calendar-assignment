import React, { useState } from 'react';
import { CSSProperties } from 'react';

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  hoverStyles?: CSSProperties;
  activeStyles?: CSSProperties;
}
export function Button(props: ButtonProps) {
  const [isHover, setIsHover] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const { hoverStyles, activeStyles, ...regularProps } = props;

  const completeStyle = Object.assign(
    {},
    props.style,
    isHover ? hoverStyles : {},
    isActive ? activeStyles : {},
  );
  return (
    <>
      <button
        {...regularProps}
        style={{
          borderRadius: '100000000000rem', // Bodge fix, percentages look weird
          ...completeStyle,
        }}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onMouseDown={() => setIsActive(true)}
        onMouseUp={() => setIsActive(false)}
      >
        {props.children}
      </button>
    </>
  );
}
