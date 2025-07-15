import React, {useContext} from "react";
import {CSSProperties} from "react";
import {ModalInputContext, ModalStateContext} from "../contexts";
import {isSameDay, toISOLocaleString} from "../../helper-functions";
import {ATTRIBUTES, CLASSES, THREE_LETTER_MONTHS} from "../../constants";
import {CalendarEvent} from "../../event-storage";

export function EventElement({calendarEvent, elementSettings}:{calendarEvent: CalendarEvent, elementSettings: EventElementSettings}){
    const modalContext = useContext(ModalStateContext);
    const modalInputContext = useContext(ModalInputContext);
    let startTimeText: string = calendarEvent.eventStart.toTimeString().split(":").slice(0, 2).join(":");
    let endTimeText: string = calendarEvent.eventEnd.toTimeString().split(":").slice(0, 2).join(":");
    if (!isSameDay(calendarEvent.eventStart, calendarEvent.eventEnd)) {
        startTimeText = `${THREE_LETTER_MONTHS[calendarEvent.eventStart.getMonth()]} ${calendarEvent.eventStart.getDate()} ${startTimeText}`;
        endTimeText = `${THREE_LETTER_MONTHS[calendarEvent.eventEnd.getMonth()]} ${calendarEvent.eventEnd.getDate()} ${endTimeText}`;
    }
    const isSmallVersion: boolean = elementSettings.isThinHeightVersion || elementSettings.isThinWidthVersion;
    return (
        <div className={CLASSES.WeekView_CalendarEventOverlay_EventBox}
             {...{[ATTRIBUTES.EventID]: calendarEvent.eventId}}
             style={elementSettings.elementStyles}
             onClick={()=>{
                 modalContext?.setValue(true);
                 modalInputContext?.setValue({
                     modalEventID: calendarEvent.eventId,
                     modalEventName: calendarEvent.eventName,
                     modalEventDescription: calendarEvent.eventDescription,
                     modalEventStart: toISOLocaleString(calendarEvent.eventStart),
                     modalEventEnd: toISOLocaleString(calendarEvent.eventEnd),
                     isModalEventExisting: true
                 })
                 /*await inputFillingByID(calendarEvent.eventId);*/
             }}>
            <div className={CLASSES.WeekView_CalendarEventOverlay_EventBox_EventTitle}
                 style={{fontSize: isSmallVersion ? "0.7rem" : "0.8rem"}}>
                {calendarEvent.eventName}
            </div>
            <div className={CLASSES.WeekView_CalendarEventOverlay_EventBox_EventTime}
                 style={{fontSize: isSmallVersion ? "0.5rem" : "0.6rem",
                         justifySelf: isSmallVersion ? "end" : "auto"}}>
                {`${startTimeText} - ${endTimeText}`}
            </div>
        </div>
    );
}

export type EventElementSettings = {
    isThinHeightVersion: boolean,
    isThinWidthVersion: boolean,
    elementStyles: CSSProperties
}