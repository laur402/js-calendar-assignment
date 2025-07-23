import { CLASSES, TIME_IN_A_MINUTE_MS } from '../../../constants';
import { CurrentTimeGraphic } from './CurrentTimeGraphic';
import {
  getTimePercentageOfDay,
  isDuringATime,
  isSameDay,
} from '../../../helper-functions';
import { getOverlaps } from '../../weekViewHelperFunctions';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { getCalendarEvents } from '../../redux/eventListSlice';
import { CalendarDatesPackage } from '../../WeekView';
import { CalendarEvent } from '../../../event-storage';
import { EventElement, EventElementSettings } from '../EventElement';

export function WeekViewCalendarGridOverlay({
  headerDates,
  hoursInADay,
}: {
  headerDates: CalendarDatesPackage[];
  hoursInADay: number;
}) {
  const eventsListState = useAppSelector(getCalendarEvents);
  const [currentTimeGraphicTop, setCurrentTimeGraphicTop] = useState(
    getTimePercentageOfDay(new Date()),
  );
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeGraphicTop(getTimePercentageOfDay(new Date()));
    }, TIME_IN_A_MINUTE_MS);
    return () => clearInterval(timer);
  });
  return (
    <div className={CLASSES.WeekView_CalendarEventOverlay}>
      {headerDates.map((value, index) => {
        if (value.isToday)
          return (
            <CurrentTimeGraphic
              key={value.normalizedDate.getTime()}
              style={{
                position: 'absolute',
                top: `${currentTimeGraphicTop}%`,
                gridColumn: `${index + 1} / span 1`,
              }}
            />
          );
      })}
      {headerDates.map((dateValue, dateIndex) => {
        const filteredEvents = eventsListState.value.filter(event => {
          return isDuringATime(
            event.eventStart,
            event.eventEnd,
            dateValue.normalizedDate,
          );
        });
        return filteredEvents.map((event, index) => {
          const overlaps = getOverlaps(filteredEvents, index);
          const eventElementSettings = getEventElementSettings(
            event,
            dateIndex + 1,
            dateValue.normalizedDate,
            overlaps.length,
            hoursInADay,
          );
          return (
            <EventElement
              key={event.eventId}
              calendarEvent={event}
              elementSettings={eventElementSettings}
            />
          );
        });
      })}
    </div>
  );
}

function getEventElementSettings(
  event: CalendarEvent,
  column: number,
  columnDate: Date,
  overlappingEventCount: number,
  hoursInADay: number,
) {
  const top = isSameDay(event.eventStart, columnDate)
    ? getTimePercentageOfDay(event.eventStart, 10)
    : 0;
  const bottom = isSameDay(event.eventEnd, columnDate)
    ? getTimePercentageOfDay(event.eventEnd, 10)
    : 100;
  const height = bottom - top;
  const width = 100 / Math.pow(overlappingEventCount + 1, 1 / 3); // in %
  const isThinHeight = height < 100 / (hoursInADay * 1.75);
  const isThinWidth = width <= 50;
  const eventElementSettings: EventElementSettings = {
    isThinHeightVersion: isThinHeight,
    isThinWidthVersion: isThinWidth,
    elementStyles: {
      position: 'absolute',
      gridColumn: `${column} / span 1`,
      top: `${top}%`,
      width: `${width}%`,
      left: `${100 - width}%`,
      height: `${height}%`,
      minHeight: `${100 / (hoursInADay * 4)}%`,
      padding: isThinHeight ? '0 0.3rem' : '0.3rem 0.5rem',
      gridTemplateColumns: isThinHeight ? '1fr auto' : '',
      columnGap: isThinHeight ? '0.2rem' : '',
      gridTemplateRows: isThinHeight ? '' : '1fr auto',
    },
  };
  return eventElementSettings;
}
