"use strict";

function renderEvent(eventID, eventTitle, eventStart, eventEnd) {
    const cells = document.getElementsByClassName("calendar-column__calendar-cell");
    const cellHeight = cells[0]?.getBoundingClientRect().height;

    const columns = document.getElementsByClassName("calendar-grid__calendar-column-0");
    const columnHeight = columns[0].getBoundingClientRect().height;
    const columnWidth = columns[0].offsetWidth;

    const eventOverlay = document.getElementsByClassName("week-view__calendar-event-overlay")[0];

    const eventTime = eventStart.getTime() - new Date(eventStart.toDateString()).getTime(); //ms from start of day
    const eventDuration = eventEnd.getTime() - eventStart.getTime(); //ms event duration
    const timeInADay = 86400000; //ms in a day

    for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        const columnDate = new Date(column.getAttribute("data-calendar-day"));
        const isEventThisWeek = columnDate.toDateString() === eventStart.toDateString();
        const isEventOverflowIntoThisWeek = columnDate.getDay() === 1
            && columnDate.getFirstDayOfWeek() <= eventEnd.getFirstDayOfWeek()
            && columnDate.getFirstDayOfWeek() >= eventStart.getFirstDayOfWeek();
        if (isEventThisWeek || isEventOverflowIntoThisWeek) {
            console.log(isEventThisWeek);
            console.log(isEventOverflowIntoThisWeek);
            let height = isEventOverflowIntoThisWeek
                ? (columnHeight * eventDuration / timeInADay) - ((columnDate.getTime()-eventStart.getTime())*columnHeight/timeInADay)
                : (columnHeight * eventDuration / timeInADay);
            console.log(height)
            const columnsToFill = Math.floor(height / columnHeight)+1;
            for (let j = 0; j < columnsToFill; j++) {
                const eventBox = document.createElement("div");
                const eventBoxTop = j === 0 && !isEventOverflowIntoThisWeek ? (columnHeight * eventTime / timeInADay) : 0;
                const eventBoxBottom = height < columnHeight ? eventBoxTop + height : columnHeight;
                const eventGridColumn = i+j+1;
                if (eventGridColumn > columns.length) return;
                const overlappingElements = getOverlaps(eventBoxTop, eventBoxBottom, eventGridColumn);
                const width = 100/Math.pow((overlappingElements.length+1), 1/3);//100 - 100/(overlappingElements.length+1);
                const isThinHeightVersion = height < 40;
                const isThinWidthVersion = width <= 50;
                const isSmallVersion = isThinHeightVersion || isThinWidthVersion;
                eventBox.style.position = "absolute";
                eventBox.style.gridColumn = `${eventGridColumn} / span 1`;
                eventBox.style.top = eventBoxTop + "px";
                eventBox.style.width = `${width}%`;
                eventBox.style.left = `${100 - width}%`;
                eventBox.style.height = eventBoxBottom - eventBoxTop + "px";
                eventBox.style.minHeight = cellHeight/4 + "px";
                eventBox.style.padding = !isSmallVersion ? "0.3rem 0.5rem" : "0 0.3rem";
                eventBox.onclick = () => {callModal(); inputFillingByID(eventID);};
                if (isThinHeightVersion) {
                    eventBox.style.gridTemplateColumns = "1fr 1fr";
                    eventBox.style.columnGap = "0.1rem";
                }
                else eventBox.style.gridTemplateRows = "calc(100% - 0.8rem) 0.8rem";
                eventBox.setAttribute("data-event-id", eventID);
                eventBox.classList.add("calendar-event-overlay__event-box");
                console.log(eventBox);

                const eventTitleText = document.createElement("div");
                eventTitleText.innerText = eventTitle;
                eventTitleText.style.fontSize = !isSmallVersion ? "0.8rem" : "0.7rem";
                eventTitleText.classList.add("event-box__event-title")
                eventBox.appendChild(eventTitleText);

                const startTimeText = eventStart.toTimeString().split(":").slice(0, 2).join(":");
                const endTimeText = eventEnd.toTimeString().split(":").slice(0, 2).join(":"); //TODO: Redo this for multiple days

                const eventTimeText = document.createElement("div");
                eventTimeText.innerText = `${startTimeText} - ${endTimeText}`;
                eventTimeText.style.fontSize = !isSmallVersion ? "0.6rem" : "0.5rem";
                eventTimeText.style.justifySelf = !isSmallVersion ? "auto" : "end";
                eventTimeText.classList.add("event-box__event-time")
                eventBox.appendChild(eventTimeText);

                eventOverlay.appendChild(eventBox);
                height -= (eventBoxBottom - eventBoxTop);
            }
        }
    }
}

function reRenderEvent(eventID, eventTitle, eventStart, eventEnd) {
    removeRenderEvent(eventID);
    renderEvent(eventID, eventTitle, eventStart, eventEnd);
}

function clearEventOverlay() {
    const eventOverlay = document.getElementsByClassName("week-view__calendar-event-overlay")[0];
    eventOverlay.innerHTML = "";
}

function removeRenderEvent(eventID) {
    const eventOverlay = document.getElementsByClassName("week-view__calendar-event-overlay")[0];
    const events = Array.from(eventOverlay.children);
    for (let i = 0; i < events.length; i++) {
        const event = events[i];
        if (event.getAttribute("data-event-id") === eventID) {
            event.remove();
        }
    }
}

function getOverlaps(eventTop, eventBottom, eventGridColumn) {
    const events = document.getElementsByClassName("calendar-event-overlay__event-box");
    const overlappingEvents = [];
    for (let i = 0; i < events.length; i++) {
        const comparedEventElement = events[i];
        const comparedEventTop = comparedEventElement.offsetTop;
        const comparedEventBottom = comparedEventTop + comparedEventElement.offsetHeight;
        const comparedEventGridColumn = Number(comparedEventElement.style.gridColumnStart);
        if (comparedEventGridColumn === eventGridColumn
            && !(
                (comparedEventTop >= eventBottom
                    && comparedEventBottom >= eventTop)
                || (comparedEventTop <= eventBottom
                    && comparedEventBottom <= eventTop)
            )){
            overlappingEvents.push(comparedEventElement);
        }
        /*if (comparedEventGridColumn === eventGridColumn
            && !(
                (comparedEventTop > eventTop
                    && comparedEventBottom > eventBottom
                    && comparedEventTop > eventBottom
                    && comparedEventBottom > eventTop)
                || (comparedEventTop < eventTop
                    && comparedEventBottom < eventBottom
                    && comparedEventTop < eventBottom
                    && comparedEventBottom < eventTop)
            )){
            overlappingEvents.push(comparedEventElement);
            console.log(overlappingEvents);
        }*/
        /*
        const comparedEventID = comparedEventElement.getAttribute("data-event-id");
        const comparedEvent = getEvent(comparedEventID);
        if (comparedEvent !== null &&
        !(
            (comparedEvent.eventStart.getTime() > eventStart.getTime()
                && comparedEvent.eventEnd.getTime() > eventEnd.getTime()
                && comparedEvent.eventStart.getTime() > eventEnd.getTime()
                && comparedEvent.eventEnd.getTime() > eventStart.getTime())
            || (comparedEvent.eventStart.getTime() < eventStart.getTime()
                && comparedEvent.eventEnd.getTime() < eventEnd.getTime()
                && comparedEvent.eventStart.getTime() < eventEnd.getTime()
                && comparedEvent.eventEnd.getTime() < eventStart.getTime())
        )){
            overlappingEvents.push(comparedEvent);
        }
         */
    }

    return overlappingEvents;
}