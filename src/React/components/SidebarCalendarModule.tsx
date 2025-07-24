import React from 'react';
import { CLASSES, getWeekdayLabelsByLocale, LOAD_TIME } from '../../constants';
import {
  addDays,
  cycleArray,
  getFirstDayOfMonth,
  getFirstDayOfWeek,
  getLastDayOfMonth,
  getWeekDifference,
  isSameMonth,
  toYearMonthString,
} from '../../helper-functions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  sidebarCalendarMonthOffsetDecrement,
  sidebarCalendarMonthOffsetIncrement,
} from '../redux/sidebarCalendarMonthOffsetSlice';
import { weekViewWeekOffsetSet } from '../redux/weekViewWeekOffsetSlice';
import { Button } from '../elements/Button';
import { STYLE_VARS } from '../StyleVariables';

export function SidebarCalendarModule() {
  const monthOffsetDate = useSidebarCalendarMonthOffsetDate();
  return (
    <div className={CLASSES.Aside_CalendarModule} style={CalendarModuleStyle}>
      <CalendarModuleHeader monthOffsetDate={monthOffsetDate} />
      {cycleArray(getWeekdayLabelsByLocale('narrow'), -1).map(
        (weekday, index) => {
          return (
            <div
              key={index}
              className={CLASSES.CalendarModule_WeekDayRowCell}
              style={{ ...CalendarModuleCellStyle, ...WeekDayRowCellStyle }}
            >
              {weekday}
            </div>
          );
        },
      )}
      {getSidebarCalendarLabelElements(monthOffsetDate)}
    </div>
  );
}
const CalendarModuleStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gridTemplateRows: 'repeat(8, 1fr)',
  width: '100%',
};
const CalendarModuleCellStyle = {
  justifySelf: 'center',
  alignSelf: 'center',
};
const WeekDayRowCellStyle = {
  color: STYLE_VARS.colorGray,
};

function CalendarModuleHeader({ monthOffsetDate }: { monthOffsetDate: Date }) {
  const dispatch = useAppDispatch();
  return (
    <div className={CLASSES.CalendarModule_Header} style={HeaderStyle}>
      <div
        className={CLASSES.CalendarModule_Header_Date}
        style={DateLabelStyle}
      >
        {toYearMonthString(monthOffsetDate)}
      </div>
      <div
        className={CLASSES.CalendarModule_Header_Buttons}
        style={ButtonContainerStyle}
      >
        <Button
          className={`${CLASSES.CalendarModule_Header_Buttons_Left} \
                        ${CLASSES.Button_Backgroundless} \
                        ${CLASSES.Button_Borderless} \
                        ${CLASSES.MaterialSymbolsOutlined}`}
          onClick={() => dispatch(sidebarCalendarMonthOffsetDecrement())}
        >
          chevron_left
        </Button>
        <Button
          className={`${CLASSES.CalendarModule_Header_Buttons_Right} \
                        ${CLASSES.Button_Backgroundless} \
                        ${CLASSES.Button_Borderless} \
                        ${CLASSES.MaterialSymbolsOutlined}`}
          onClick={() => dispatch(sidebarCalendarMonthOffsetIncrement())}
        >
          chevron_right
        </Button>
      </div>
    </div>
  );
}
const HeaderStyle = {
  gridColumnEnd: 'span 7',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};
const DateLabelStyle = {
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
};
const ButtonContainerStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  alignContent: 'center',
};

function getSidebarCalendarLabelElements(monthOffsetDate: Date) {
  const firstDay: Date = getFirstDayOfMonth(new Date(monthOffsetDate));
  const lastDay: Date = getLastDayOfMonth(new Date(monthOffsetDate));
  return [...Array(getWeekDifference(firstDay, lastDay) + 1).keys()].map(
    weekOfMonth => {
      const offsetDate = addDays(new Date(firstDay), 7 * weekOfMonth);
      const firstDayOfWeek = getFirstDayOfWeek(offsetDate);

      return [...Array(7).keys()].map(weekDay => {
        const buttonDate = addDays(new Date(firstDayOfWeek), weekDay);

        return (
          <SidebarCalendarLabelButton
            key={buttonDate.getTime()}
            date={buttonDate}
            weekOffset={getWeekDifference(LOAD_TIME, buttonDate)}
            isCurrentMonth={isSameMonth(firstDay, buttonDate)}
          />
        );
      });
    },
  );
}

function SidebarCalendarLabelButton({
  date,
  weekOffset,
  isCurrentMonth,
}: {
  date: Date;
  weekOffset: number;
  isCurrentMonth: boolean;
}) {
  const dispatch = useAppDispatch();
  return (
    <Button
      className={`${CLASSES.CalendarModule_DayCell} \
            ${CLASSES.Button_Backgroundless} \
            ${CLASSES.Button_Borderless} \
            ${isCurrentMonth ? '' : CLASSES.CalendarModule_DayCell_NotCurrent}`}
      onClick={() => {
        dispatch(weekViewWeekOffsetSet(weekOffset));
      }}
      style={{
        ...CalendarModuleCellStyle,
        ...CalendarLabelButtonStyle(isCurrentMonth),
      }}
    >
      {date.getDate()}
    </Button>
  );
}
const CalendarLabelButtonStyle = (isActive: boolean) => {
  return {
    width: '100%',
    height: '100%',
    color: isActive ? STYLE_VARS.colorGrayActive : STYLE_VARS.colorGrayLight,
  };
};

function useSidebarCalendarMonthOffsetDate() {
  const currentMonth = new Date(LOAD_TIME);
  currentMonth.setMonth(
    currentMonth.getMonth() + useSidebarCalendarMonthOffset(),
  );
  return currentMonth;
}
function useSidebarCalendarMonthOffset() {
  const monthOffsetState = useAppSelector(
    state => state.sidebarCalendarMonthOffset,
  );
  return monthOffsetState.value;
}
