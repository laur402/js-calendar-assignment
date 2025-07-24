import React, { CSSProperties } from 'react';
import { CLASSES } from '../../../constants';

type CurrentTimeGraphicProps = React.ComponentPropsWithoutRef<'div'>;

export function CurrentTimeGraphic(props: CurrentTimeGraphicProps) {
  const { style, ...rest } = props;
  return (
    <div
      className={CLASSES.WeekView_CalendarEventOverlay_CurrentTimeGraphic}
      style={{ ...GraphicStyle, ...style }}
      {...rest}
    >
      <div
        className={
          CLASSES.WeekView_CalendarEventOverlay_CurrentTimeGraphic_Line
        }
        style={GraphicLineStyle}
      />
      <div
        className={
          CLASSES.WeekView_CalendarEventOverlay_CurrentTimeGraphic_Bauble
        }
        style={GraphicBaubleStyle}
      />
    </div>
  );
}

const GraphicStyle: CSSProperties = {
  position: 'absolute',
  width: '100%',
  zIndex: 10,
  display: 'grid',
  alignItems: 'center',
};

const GraphicLineStyle = {
  height: '1px',
  width: '100%',
  borderBottom: '0.1rem solid red',
};
const GraphicBaubleStyle: CSSProperties = {
  position: 'absolute',
  width: '0.8rem',
  height: '0.8rem',
  borderRadius: '0.4rem',
  backgroundColor: 'red',
  alignSelf: 'center',
  marginLeft: '-0.4rem',
};
