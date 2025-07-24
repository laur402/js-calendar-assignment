import React, { CSSProperties, useEffect } from 'react';
import { CalendarGrid } from './components/WeekView/CalendarGridElements';
import {
  addDays,
  getFirstDayOfWeek,
  getNormalizedLocalDate,
  isSameDay,
} from '../helper-functions';
import { CLASSES, LOAD_TIME, THREE_LETTER_WEEK_DAYS } from '../constants';
import { fetchEvents } from '../event-storage';
import { useAppDispatch } from './redux/hooks';
import { eventListSetList } from './redux/eventListSlice';
import { useWeekViewWeekOffsetDate } from './weekViewHelperFunctions';
import { WeekViewHeader } from './components/WeekView/WeekViewHeader';
import { WeekViewCalendarGridOverlay } from './components/WeekView/WeekViewCalendarGridOverlay';

export function WeekView() {
  const dispatch = useAppDispatch();
  const hoursInADay = 24;
  const headerDates = getCalendarDates(useWeekViewWeekOffsetDate());

  useEffect(() => {
    const fetchEventsFromAPI = async () => {
      const fetchedEvents = await fetchEvents();
      dispatch(eventListSetList(fetchedEvents));
    };
    void fetchEventsFromAPI();
  }, [dispatch]);
  return (
    <section
      className={CLASSES.WeekViewContainer}
      style={WeekViewContainerStyle}
    >
      <WeekViewHeader headerDates={headerDates} />
      <section
        className={CLASSES.WeekView_CalendarContainer}
        style={CalendarContainerStyle}
      >
        <WeekViewCalendarGridOverlay
          headerDates={headerDates}
          hoursInADay={hoursInADay}
        />
        <CalendarGrid headerDates={headerDates} hoursInADay={hoursInADay} />
      </section>
    </section>
  );
}
const WeekViewContainerStyle = {
  display: 'grid',
  gridTemplateRows: 'min-content auto',
  paddingTop: '1rem',
};

const CalendarContainerStyle: CSSProperties = {
  height: 'auto',
  overflowY: 'scroll',
  display: 'grid',
  gridTemplateColumns: '3rem 1fr',
  gridTemplateRows: '1fr',
};

function getCalendarDates(offsetDate: Date): CalendarDatesPackage[] {
  return [...Array(7).keys()].map(value => {
    const weekDate = addDays(getFirstDayOfWeek(offsetDate), value);
    return {
      normalizedDate: getNormalizedLocalDate(weekDate),
      weekdayLabel: THREE_LETTER_WEEK_DAYS[weekDate.getDay()],
      dateLabel: weekDate.getDate(),
      isToday: isSameDay(weekDate, LOAD_TIME),
    };
  });
}
export interface CalendarDatesPackage {
  normalizedDate: Date;
  weekdayLabel: string;
  dateLabel: number;
  isToday: boolean;
}
