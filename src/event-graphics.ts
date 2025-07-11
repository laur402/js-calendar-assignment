"use strict";
function renderEvent(calendarEvent: CalendarEvent) {

    const calendarColumns: HTMLCollection = document.getElementsByClassName(CLASSES.WeekView_CalendarGrid_CalendarColumn);
    const firstColumn = calendarColumns[0] as HTMLElement;
    const columnHeight: number = firstColumn.getBoundingClientRect().height;
    //const columnWidth: number = firstColumn.offsetWidth;

    const eventOverlay = document.getElementsByClassName(CLASSES.WeekView_CalendarEventOverlay)[0] as HTMLElement;

    const eventTime: number = calendarEvent.eventStart.getTime() - getNormalizedLocalDate(calendarEvent.eventStart).getTime(); //ms from start of day
    const eventDuration: number = calendarEvent.eventEnd.getTime() - calendarEvent.eventStart.getTime(); //ms event duration

    for (let i = 0; i < calendarColumns.length; i++) {
        const column = calendarColumns[i] as HTMLElement;
        const columnDateString: string | undefined = column.getAttribute(ATTRIBUTES.CalendarDay)?.toString();
        if (columnDateString === undefined) throw new AttributeError("Cannot get data-calendar-day attribute");
        const columnDate: Date = new Date(columnDateString);

        const isEventThisWeek: boolean = isSameDay(columnDate, calendarEvent.eventStart);
        const isEventOverflowIntoThisWeek: boolean = columnDate.getDay() === WeekDays.Monday
            && getFirstDayOfWeek(columnDate) <= getFirstDayOfWeek(calendarEvent.eventEnd)
            && getFirstDayOfWeek(columnDate) >= getFirstDayOfWeek(calendarEvent.eventStart);
        if (!isEventThisWeek && !isEventOverflowIntoThisWeek) continue;

        let totalEventHeight: number = (columnHeight * eventDuration / TIME_IN_A_DAY_MS);
        if (isEventOverflowIntoThisWeek)
            totalEventHeight -= (columnDate.getTime() - calendarEvent.eventStart.getTime()) * columnHeight / TIME_IN_A_DAY_MS;
        const columnsToFill: number = Math.floor(totalEventHeight / columnHeight)+1;
        for (let j = 0; j < columnsToFill; j++) {
            const eventGridColumn: number = i + j + 1;
            if (eventGridColumn > calendarColumns.length) return;
            const eventBoxTop: number = j !== 0 || isEventOverflowIntoThisWeek ? 0 : columnHeight * eventTime / TIME_IN_A_DAY_MS;
            const eventBoxBottom: number = totalEventHeight > columnHeight ? columnHeight : eventBoxTop + totalEventHeight;

            const eventBox: HTMLElement = createEventBox(calendarEvent, eventBoxTop, eventBoxBottom, eventGridColumn);
            eventOverlay.appendChild(eventBox);
            totalEventHeight -= eventBox.offsetHeight;
        }
    }
}

function createEventBox(calendarEvent: CalendarEvent, eventBoxTop: number, eventBoxBottom: number, eventGridColumn: number): HTMLElement {
    const eventBox: HTMLElement = document.createElement("div");

    const calendarCells: HTMLCollection = document.getElementsByClassName(CLASSES.WeekView_CalendarGrid_CalendarColumn_Cell);
    const calendarCellHeight: number | undefined = calendarCells[0]?.getBoundingClientRect().height;
    //const calendarCellWidth: number = calendarCells[0]?.getBoundingClientRect().width;

    const overlappingElements: HTMLElement[] = getOverlaps(eventBoxTop, eventBoxBottom, eventGridColumn);
    const width: number = 100 / Math.pow((overlappingElements.length+1), 1/3); //in percentages
    const height: number = eventBoxBottom - eventBoxTop; //in pixels
    const isThinHeightVersion: boolean = height < calendarCellHeight / 1.75;
    const isThinWidthVersion: boolean = width <= 50;
    const isSmallVersion: boolean = isThinHeightVersion || isThinWidthVersion;

    eventBox.style.position = "absolute";
    eventBox.style.gridColumn = `${eventGridColumn} / span 1`;
    eventBox.style.top = eventBoxTop + "px";
    eventBox.style.width = `${width}%`;
    eventBox.style.left = `${100 - width}%`;
    eventBox.style.height = eventBoxBottom - eventBoxTop + "px";
    eventBox.style.minHeight = calendarCellHeight/4 + "px";
    eventBox.style.padding = isThinHeightVersion ? "0 0.3rem" : "0.3rem 0.5rem";
    eventBox.onclick = async () => {
        callModal();
        await inputFillingByID(calendarEvent.eventId);
    };
    if (isThinHeightVersion) {
        eventBox.style.gridTemplateColumns = "1fr 1fr";
        eventBox.style.columnGap = "0.2rem";
    }
    else eventBox.style.gridTemplateRows = "1fr auto";
    eventBox.setAttribute(ATTRIBUTES.EventID, calendarEvent.eventId);
    eventBox.classList.add(CLASSES.WeekView_CalendarEventOverlay_EventBox);

    const eventTitleText: HTMLElement = document.createElement("div");
    eventTitleText.innerText = calendarEvent.eventName;
    eventTitleText.style.fontSize = isSmallVersion ? "0.7rem" : "0.8rem";
    eventTitleText.classList.add(CLASSES.WeekView_CalendarEventOverlay_EventBox_EventTitle)
    eventBox.appendChild(eventTitleText);

    let startTimeText: string = calendarEvent.eventStart.toTimeString().split(":").slice(0, 2).join(":");
    let endTimeText: string = calendarEvent.eventEnd.toTimeString().split(":").slice(0, 2).join(":");
    if (!isSameDay(calendarEvent.eventStart, calendarEvent.eventEnd)) {
        startTimeText = `${THREE_LETTER_MONTHS[calendarEvent.eventStart.getMonth()]} ${calendarEvent.eventStart.getDate()} ${startTimeText}`;
        endTimeText = `${THREE_LETTER_MONTHS[calendarEvent.eventEnd.getMonth()]} ${calendarEvent.eventEnd.getDate()} ${endTimeText}`;
    }

    const eventTimeText: HTMLElement = document.createElement("div");
    eventTimeText.innerText = `${startTimeText} - ${endTimeText}`;
    eventTimeText.style.fontSize = isSmallVersion ? "0.5rem" : "0.6rem" ;
    eventTimeText.style.justifySelf = isSmallVersion ? "end" : "auto";
    eventTimeText.classList.add(CLASSES.WeekView_CalendarEventOverlay_EventBox_EventTime)
    eventBox.appendChild(eventTimeText);

    return eventBox;
}

function reRenderEvent(calendarEvent: CalendarEvent) {
    removeRenderEvent(calendarEvent.eventId);
    renderEvent(calendarEvent);
}

function clearEventOverlay() {
    const eventOverlay = document.getElementsByClassName(CLASSES.WeekView_CalendarEventOverlay)[0] as HTMLElement;
    eventOverlay.innerHTML = "";
}

function removeRenderEvent(eventID: string) {
    const eventOverlay = document.getElementsByClassName(CLASSES.WeekView_CalendarEventOverlay)[0] as HTMLElement;
    const events = Array.from(eventOverlay.children) as HTMLElement[];
    for (let i = 0; i < events.length; i++) {
        const event: HTMLElement = events[i];
        if (event.getAttribute(ATTRIBUTES.EventID) === eventID) {
            event.remove();
        }
    }
}

function getOverlaps(eventTop: number, eventBottom: number, eventGridColumn: number): HTMLElement[] {
    const overlappingEvents: HTMLElement[] = [];
    const events: HTMLCollection = document.getElementsByClassName(CLASSES.WeekView_CalendarEventOverlay_EventBox);
    for (let i = 0; i < events.length; i++) {
        const comparedEventElement = events[i] as HTMLElement;
        const comparedEventTop: number = comparedEventElement.offsetTop;
        const comparedEventBottom: number = comparedEventTop + comparedEventElement.offsetHeight;

        const comparedEventGridColumn: number = Number(comparedEventElement.style.gridColumnStart);
        const isOverlapping: boolean = Math.max(eventTop, comparedEventTop) < Math.min(eventBottom, comparedEventBottom);

        if (comparedEventGridColumn === eventGridColumn && isOverlapping){
            overlappingEvents.push(comparedEventElement);
        }
    }
    return overlappingEvents;
}