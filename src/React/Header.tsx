import React from 'react';
import { CLASSES, MONTHS } from '../constants';
import { getFirstDayOfWeek, getLastDayOfWeek } from '../helper-functions';
import { useAppDispatch } from './redux/hooks';
import {
  weekViewWeekOffsetDecrement,
  weekViewWeekOffsetIncrement,
  weekViewWeekOffsetSet,
} from './redux/weekViewWeekOffsetSlice';
import { sidebarCalendarMonthOffsetSet } from './redux/sidebarCalendarMonthOffsetSlice';
import { useWeekViewWeekOffsetDate } from './weekViewHelperFunctions';
import { Text } from './elements/Text';
import { Button } from './elements/Button';
import { STYLE_VARS } from './StyleVariables';

export function Header() {
  const weekViewOffsetDate = useWeekViewWeekOffsetDate();
  return (
    <header className={CLASSES.Header} style={HeaderStyle}>
      <div className={CLASSES.Header_AppTitle} style={AppTitleStyle}>
        <img src="/logo.svg" alt="Calendar Logo" height="32" />
        <Text textSize={2}>Calendar</Text>
      </div>
      <HeaderButtons />
      <HeaderMonthYearDate weekViewOffset={weekViewOffsetDate} />
    </header>
  );
}
const HeaderStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 3fr',
  justifyItems: 'center',
  alignItems: 'center',

  padding: '0.5rem 1rem',
  borderBottom: `1px solid ${STYLE_VARS.colorGray}`,

  gridColumn: '0 / span 2',
};
const AppTitleStyle = {
  justifySelf: 'left',
  color: STYLE_VARS.colorGrayActive,

  display: 'grid',
  alignItems: 'center',
  gridTemplateColumns: '1fr auto',
  gridColumnGap: '0.5rem',
};

function HeaderButtons() {
  const dispatch = useAppDispatch();
  return (
    <div className={CLASSES.Header_Buttons} style={ButtonContainerStyle}>
      <Button
        className={`${CLASSES.Header_Buttons_Today} \
                ${CLASSES.Button_Backgroundless}`}
        onClick={() => {
          dispatch(weekViewWeekOffsetSet(0));
          dispatch(sidebarCalendarMonthOffsetSet(0));
        }}
        style={TodayButtonStyle}
      >
        <Text textSize={1}>Today</Text>
      </Button>
      <Button
        className={`${CLASSES.Header_Buttons_WeekLeft} \
                ${CLASSES.Button_Backgroundless} \
                ${CLASSES.Button_Borderless} \
                ${CLASSES.MaterialSymbolsOutlined}`}
        onClick={() => {
          dispatch(weekViewWeekOffsetDecrement());
        }}
      >
        chevron_left
      </Button>
      <Button
        className={`${CLASSES.Header_Buttons_WeekRight} \
                ${CLASSES.Button_Backgroundless} \
                ${CLASSES.Button_Borderless} \
                ${CLASSES.MaterialSymbolsOutlined}`}
        onClick={() => {
          dispatch(weekViewWeekOffsetIncrement());
        }}
      >
        chevron_right
      </Button>
    </div>
  );
}
const ButtonContainerStyle = {
  justifySelf: 'left',

  display: 'grid',
  gridTemplateColumns: '2fr 1fr 1fr',
  justifyItems: 'center',
  alignItems: 'center',
};

const TodayButtonStyle = {
  border: `0.08rem solid ${STYLE_VARS.colorGray}`,
  padding: '0.5rem 1rem',
};
function HeaderMonthYearDate({ weekViewOffset }: { weekViewOffset: Date }) {
  return (
    <Text
      textSize={1.5}
      className={CLASSES.Header_MonthYearDate}
      style={MonthYearDateStyle}
    >
      {getHeaderDateLabel(weekViewOffset)}
    </Text>
  );
}
const MonthYearDateStyle = {
  justifySelf: 'right',
  color: STYLE_VARS.colorGrayActive,
};

function getHeaderDateLabel(weekViewOffset: Date) {
  const firstDayOfWeek = getFirstDayOfWeek(weekViewOffset);
  const lastDayOfWeek = getLastDayOfWeek(weekViewOffset);
  if (firstDayOfWeek.getMonth() === lastDayOfWeek.getMonth()) {
    return `${firstDayOfWeek.getFullYear()} ${MONTHS[lastDayOfWeek.getMonth()]}`;
  } else if (firstDayOfWeek.getFullYear() === lastDayOfWeek.getFullYear()) {
    return `${firstDayOfWeek.getFullYear()} ${MONTHS[firstDayOfWeek.getMonth()]} - ${MONTHS[lastDayOfWeek.getMonth()]}`;
  } else
    return `${firstDayOfWeek.getFullYear()} ${MONTHS[firstDayOfWeek.getMonth()]} - ${lastDayOfWeek.getFullYear()} ${MONTHS[lastDayOfWeek.getMonth()]}`;
}
