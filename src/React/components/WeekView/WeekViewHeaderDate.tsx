import React from 'react';
import { CLASSES } from '../../../constants';
import { Text } from '../../elements/Text';

export function WeekViewHeaderDate({
  dayStr,
  dayNum,
  isToday,
}: {
  dayStr: string;
  dayNum: number;
  isToday: boolean;
}) {
  return (
    <div
      className={`${CLASSES.WeekView_DatesHeader_DateContainer_Date} ${isToday ? CLASSES.WeekView_DatesHeader_DateContainer_Date_Active : ''}`}
    >
      <Text
        textSize={1}
        className={CLASSES.WeekView_DatesHeader_DateContainer_Date_Weekday}
      >
        {dayStr}
      </Text>
      <Text
        textSize={2}
        className={CLASSES.WeekView_DatesHeader_DateContainer_Date_Day}
      >
        {dayNum}
      </Text>
    </div>
  );
}
