import { CLASSES, TIME_IN_A_MINUTE_MS } from '../../../constants';
import { CurrentTimeGraphic } from './CurrentTimeGraphic';
import {
  getTimePercentageOfDay,
  isOverlappingDateSpans,
  isSameDay,
} from '../../../helper-functions';
import { getOverlaps } from '../../weekViewHelperFunctions';
import React, { CSSProperties, useEffect, useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { getCalendarEvents } from '../../redux/eventListSlice';
import { CalendarDatesPackage } from '../../WeekView';
import { CalendarEvent } from '../../../event-storage';
import { EventElement, EventElementSettings } from '../EventElement';
import { STYLE_VARS } from '../../StyleVariables';

export function WeekViewCalendarGridOverlay({
  headerDates,
  hoursInADay,
}: {
  headerDates: CalendarDatesPackage[];
  hoursInADay: number;
}) {
  const [currentTimeGraphicTop, setCurrentTimeGraphicTop] = useState(
    getTimePercentageOfDay(new Date()),
  );
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeGraphicTop(getTimePercentageOfDay(new Date()));
    }, TIME_IN_A_MINUTE_MS);
    return () => clearInterval(timer);
  });
  const currentTimeColumn: number | null = headerDates.reduce(
    (accum: number | null, value, index) => {
      if (value.isToday) return index;
      else return accum;
    },
    null,
  );
  const eventsListState = useAppSelector(getCalendarEvents);
  const events = getEvents(headerDates, eventsListState.value, hoursInADay);
  return (
    <div
      className={CLASSES.WeekView_CalendarEventOverlay}
      style={EventOverlayStyle}
    >
      {currentTimeColumn && (
        <CurrentTimeGraphic
          style={{
            position: 'absolute',
            top: `${currentTimeGraphicTop}%`,
            gridColumn: `${currentTimeColumn + 1} / span 1`,
          }}
        />
      )}
      {events}
    </div>
  );
}

const EventOverlayStyle: CSSProperties = {
  gridColumn: 2,
  gridRow: 1,
  height: '100%',
  width: '100%',
  position: 'relative',
  pointerEvents: 'none',

  display: 'grid',
  gridTemplateColumns: STYLE_VARS.columnSize,
  gridTemplateRows: '1fr',
  /*--columnGap: 0.5rem,
columnGap: var(--column-gap),
padding: 0 calc(var(--column-gap)/2),*/
};

function getEvents(
  headerDates: CalendarDatesPackage[],
  eventsList: CalendarEvent[],
  hoursInADay: number,
) {
  return headerDates.map((dateValue, dateIndex) => {
    const filteredEvents = eventsList.filter(event =>
      isOverlappingDateSpans(
        event.eventStart,
        event.eventEnd,
        dateValue.normalizedDate,
      ),
    );
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
  });
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
