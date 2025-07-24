import React, { CSSProperties } from 'react';
import { CLASSES } from '../../../constants';
import { Text } from '../../elements/Text';
import { STYLE_VARS } from '../../StyleVariables';

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
      className={`${CLASSES.WeekView_DatesHeader_DateContainer_Date} \
      ${isToday ? CLASSES.WeekView_DatesHeader_DateContainer_Date_Active : ''}`}
      style={DateContainerStyle}
    >
      <Text
        textSize={1}
        className={CLASSES.WeekView_DatesHeader_DateContainer_Date_Weekday}
        style={WeekdayStyle(isToday)}
      >
        {dayStr}
      </Text>
      <Text
        textSize={2}
        className={CLASSES.WeekView_DatesHeader_DateContainer_Date_Day}
        style={DayStyle(isToday)}
      >
        {dayNum}
      </Text>
    </div>
  );
}
const DateContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.25rem',
  borderBottom: STYLE_VARS.borderConfig,
  paddingBottom: '0.5rem',
};
const WeekdayStyle = (isActive: boolean) => {
  return {
    color: isActive ? STYLE_VARS.colorBlueSurface : STYLE_VARS.colorGray,
  };
};
const DayStyle = (isActive: boolean): CSSProperties => {
  return {
    fontSize: '2rem',
    aspectRatio: '1/1',
    textAlign: 'center',
    color: isActive ? STYLE_VARS.colorWhiteOnColor : STYLE_VARS.colorGrayActive,
    backgroundColor: isActive ? STYLE_VARS.colorBlueSurface : 'transparent',
    borderRadius: isActive ? '50%' : 0,
    padding: '0.4rem',
  };
};
