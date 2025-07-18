import React, { useEffect } from 'react';
import {
    CalendarGridColumn,
    CalendarGridTimeColumn,
} from './components/CalendarGridElements';
import { WeekViewHeaderDate } from './components/WeekViewHeaderDate';
import {
    addDays,
    getFirstDayOfWeek,
    getNormalizedLocalDate,
    getTimePercentageOfDay,
    getTimezone,
    isDuringATime,
    isSameDay,
    leftPad,
} from '../helper-functions';
import { CLASSES, LOAD_TIME, THREE_LETTER_WEEK_DAYS } from '../constants';
import { CurrentTimeGraphic } from './components/CurrentTimeGraphic';
import { CalendarEvent, fetchEvents } from '../event-storage';
import { EventElement, EventElementSettings } from './components/EventElement';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { eventListSetList, getCalendarEvents } from './redux/eventListSlice';
import {
    getOverlaps,
    useWeekViewWeekOffsetDate,
} from './weekViewHelperFunctions';

export function WeekView() {
    const dispatch = useAppDispatch();
    const eventsListState = useAppSelector(getCalendarEvents);
    const timezoneOffset = getTimezone(LOAD_TIME);
    const timezoneOffsetString = leftPad(timezoneOffset, 2);
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
        <section className={CLASSES.WeekViewContainer}>
            <header className={CLASSES.WeekView_DatesHeader}>
                <div className={CLASSES.WeekView_DatesHeader_DateContainer}>
                    <div
                        className={
                            CLASSES.WeekView_DatesHeader_DateContainer_Timezone
                        }
                    >
                        UTC
                        {`${timezoneOffset < 0 ? '-' : '+'}${timezoneOffsetString}`}
                    </div>
                    {headerDates.map(value => (
                        <WeekViewHeaderDate
                            key={value.normalizedDate.getTime()}
                            dayStr={value.weekdayLabel}
                            dayNum={value.dateLabel}
                            isToday={value.isToday}
                        />
                    ))}
                </div>
                <div className={CLASSES.WeekView_DatesHeader_AllDayRow}>
                    {headerDates.map(value => (
                        <div
                            key={value.normalizedDate.getTime()}
                            className={
                                CLASSES.WeekView_DatesHeader_AllDayRow_Cell
                            }
                        ></div>
                    ))}
                </div>
            </header>
            <section className={CLASSES.WeekView_CalendarContainer}>
                <div className={CLASSES.WeekView_CalendarEventOverlay}>
                    {headerDates.map((value, index) => {
                        if (value.isToday)
                            return (
                                <CurrentTimeGraphic
                                    key={value.normalizedDate.getTime()}
                                    currentTimeGraphicColumn={index}
                                />
                            );
                    })}
                    {headerDates.map((dateValue, dateIndex) => {
                        const filteredEvents = eventsListState.value.filter(
                            event => {
                                return isDuringATime(
                                    event.eventStart,
                                    event.eventEnd,
                                    dateValue.normalizedDate,
                                );
                            },
                        );
                        return filteredEvents.map((event, index) => {
                            const overlaps = getOverlaps(filteredEvents, index);
                            return getEventElement(
                                event,
                                dateIndex + 1,
                                dateValue.normalizedDate,
                                overlaps.length,
                                hoursInADay,
                            );
                        });
                    })}
                </div>
                <section className={CLASSES.WeekView_CalendarGrid}>
                    <CalendarGridTimeColumn hoursInADay={hoursInADay} />
                    {headerDates.map(dateValue => {
                        return (
                            <CalendarGridColumn
                                key={dateValue.normalizedDate.getTime()}
                                hoursInADay={hoursInADay}
                                associatedDate={dateValue.normalizedDate}
                            />
                        );
                    })}
                </section>
            </section>
        </section>
    );
}
function getCalendarDates(offsetDate: Date) {
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
function getEventElement(
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
    return (
        <EventElement
            key={event.eventId}
            calendarEvent={event}
            elementSettings={eventElementSettings}
        />
    );
}
