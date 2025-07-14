import React, {useContext} from "react";
import {CSSProperties} from "react";
import {ModalStateContext} from "../contexts";
import {isSameDay} from "../../helper-functions";
import {ATTRIBUTES, CLASSES, THREE_LETTER_MONTHS} from "../../constants";
import {CalendarEvent} from "../../event-storage";

function EventElement(calendarEvent: CalendarEvent, elementSettings: EventElementSettings){
    const modalContext = useContext(ModalStateContext);
    let startTimeText: string = calendarEvent.eventStart.toTimeString().split(":").slice(0, 2).join(":");
    let endTimeText: string = calendarEvent.eventEnd.toTimeString().split(":").slice(0, 2).join(":");
    if (!isSameDay(calendarEvent.eventStart, calendarEvent.eventEnd)) {
        startTimeText = `${THREE_LETTER_MONTHS[calendarEvent.eventStart.getMonth()]} ${calendarEvent.eventStart.getDate()} ${startTimeText}`;
        endTimeText = `${THREE_LETTER_MONTHS[calendarEvent.eventEnd.getMonth()]} ${calendarEvent.eventEnd.getDate()} ${endTimeText}`;
    }
    const isSmallVersion: boolean = elementSettings.isThinHeightVersion || elementSettings.isThinWidthVersion;
    //const isThinHeightVersion: boolean = elementStyles.height < calendarCellHeight / 1.75
    //const isThinWidthVersion: boolean = elementStyles.width <= 50;
    return (
        <div className={CLASSES.WeekView_CalendarEventOverlay_EventBox}
             {...{[ATTRIBUTES.EventID]: calendarEvent.eventId}}
             style={elementSettings.elementStyles}
             onClick={()=>{
                 modalContext?.setValue(true);
                 /*await inputFillingByID(calendarEvent.eventId);*/
             }}>
            <div className={CLASSES.WeekView_CalendarEventOverlay_EventBox_EventTitle}>
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

type EventElementSettings = {
    isThinHeightVersion: boolean,
    isThinWidthVersion: boolean,
    elementStyles: CSSProperties
}