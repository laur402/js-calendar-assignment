import React from 'react';
import { CLASSES } from '../../../constants';

type CurrentTimeGraphicProps = React.ComponentPropsWithoutRef<'div'>;

export function CurrentTimeGraphic(props: CurrentTimeGraphicProps) {
  return (
    <div
      className={CLASSES.WeekView_CalendarEventOverlay_CurrentTimeGraphic}
      {...props}
    >
      <div
        className={
          CLASSES.WeekView_CalendarEventOverlay_CurrentTimeGraphic_Line
        }
      />
      <div
        className={
          CLASSES.WeekView_CalendarEventOverlay_CurrentTimeGraphic_Bauble
        }
        style={{ position: 'absolute' }}
      />
    </div>
  );
}
