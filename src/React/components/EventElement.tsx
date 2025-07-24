import React from 'react';
import { CSSProperties } from 'react';
import { isSameDay, toISOLocaleString } from '../../helper-functions';
import { ATTRIBUTES, CLASSES, THREE_LETTER_MONTHS } from '../../constants';
import { CalendarEvent } from '../../event-storage';
import { useAppDispatch } from '../redux/hooks';
import { modalStateShow } from '../redux/modalStateSlice';
import { modalInputModify } from '../redux/modalInputSlice';
import { STYLE_VARS } from '../StyleVariables';

export function EventElement({
  calendarEvent,
  elementSettings,
}: {
  calendarEvent: CalendarEvent;
  elementSettings: EventElementSettings;
}) {
  const dispatch = useAppDispatch();
  let startTimeText: string = calendarEvent.eventStart
    .toTimeString()
    .split(':')
    .slice(0, 2)
    .join(':');
  let endTimeText: string = calendarEvent.eventEnd
    .toTimeString()
    .split(':')
    .slice(0, 2)
    .join(':');
  if (!isSameDay(calendarEvent.eventStart, calendarEvent.eventEnd)) {
    startTimeText = `${THREE_LETTER_MONTHS[calendarEvent.eventStart.getMonth()]} ${calendarEvent.eventStart.getDate()} ${startTimeText}`;
    endTimeText = `${THREE_LETTER_MONTHS[calendarEvent.eventEnd.getMonth()]} ${calendarEvent.eventEnd.getDate()} ${endTimeText}`;
  }
  const isSmallVersion: boolean =
    elementSettings.isThinHeightVersion || elementSettings.isThinWidthVersion;
  return (
    <div
      className={CLASSES.WeekView_CalendarEventOverlay_EventBox}
      {...{ [ATTRIBUTES.EventID]: calendarEvent.eventId }}
      style={{ ...EventBoxStyle, ...elementSettings.elementStyles }}
      onClick={() => {
        dispatch(modalStateShow());
        dispatch(
          modalInputModify({
            modalEventID: calendarEvent.eventId,
            modalEventName: calendarEvent.eventName,
            modalEventDescription: calendarEvent.eventDescription,
            modalEventStart: toISOLocaleString(calendarEvent.eventStart),
            modalEventEnd: toISOLocaleString(calendarEvent.eventEnd),
            isModalEventExisting: true,
          }),
        );
      }}
    >
      <div
        className={CLASSES.WeekView_CalendarEventOverlay_EventBox_EventTitle}
        style={EventTitleStyle(isSmallVersion)}
      >
        {calendarEvent.eventName}
      </div>
      <div
        className={CLASSES.WeekView_CalendarEventOverlay_EventBox_EventTime}
        style={EventTimeStyle(isSmallVersion)}
      >
        {`${startTimeText} - ${endTimeText}`}
      </div>
    </div>
  );
}

const EventBoxStyle: CSSProperties = {
  position: 'absolute',
  backgroundColor: STYLE_VARS.colorBlueSurface,
  border: `0.1rem solid ${STYLE_VARS.colorBlueSurfaceCompliment}`,
  borderRadius: '0.5rem',
  pointerEvents: 'auto',
  display: 'grid',
};

const EventTitleStyle = (isSmallVersion: boolean): CSSProperties => {
  return {
    overflowWrap: 'anywhere',
    overflow: 'hidden',
    color: STYLE_VARS.colorWhiteOnColor,
    fontSize: isSmallVersion ? '0.7rem' : '0.8rem',
  };
};

const EventTimeStyle = (isSmallVersion: boolean): CSSProperties => {
  return {
    color: STYLE_VARS.colorWhiteOnColor,
    fontSize: isSmallVersion ? '0.5rem' : '0.6rem',
    justifySelf: isSmallVersion ? 'end' : 'auto',
  };
};

export interface EventElementSettings {
  isThinHeightVersion: boolean;
  isThinWidthVersion: boolean;
  elementStyles: CSSProperties;
}
