import React from 'react';

interface TextProps extends React.ComponentPropsWithoutRef<'div'> {
  textSize?: number;
}
export function Text(props: TextProps) {
  const { textSize, style, ...rest } = props;
  return (
    <div style={{ fontSize: `${textSize ?? 1}rem`, ...style }} {...rest}>
      {props.children}
    </div>
  );
}
