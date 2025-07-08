"use strict";
const THREE_LETTER_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function renderEvent(eventID: string, eventTitle: string, eventStart: Date, eventEnd: Date) {
    const cells: HTMLCollection = document.getElementsByClassName("calendar-column__calendar-cell");
    const cellHeight: number = cells[0]?.getBoundingClientRect().height;

    const columns: HTMLCollection = document.getElementsByClassName("calendar-grid__calendar-column-0");
    const firstColumn: HTMLElement = columns[0] as HTMLElement;
    const columnHeight: number = firstColumn.getBoundingClientRect().height;
    const columnWidth: number = firstColumn.offsetWidth;

    const eventOverlay: HTMLElement = document.getElementsByClassName("week-view__calendar-event-overlay")[0] as HTMLElement;

    const eventTime: number = eventStart.getTime() - new Date(eventStart.toDateString()).getTime(); //ms from start of day
    const eventDuration: number = eventEnd.getTime() - eventStart.getTime(); //ms event duration
    const timeInADay: number = 86400000; //ms in a day

    for (let i = 0; i < columns.length; i++) {
        const column: HTMLElement = columns[i] as HTMLElement;
        const columnDate: Date = new Date(column.getAttribute("data-calendar-day")?.toString() ?? ""); //TODO: Replace with error

        const isEventThisWeek: boolean = columnDate.toDateString() === eventStart.toDateString();
        const isEventOverflowIntoThisWeek: boolean = columnDate.getDay() === 1
            && columnDate.getFirstDayOfWeek() <= eventEnd.getFirstDayOfWeek()
            && columnDate.getFirstDayOfWeek() >= eventStart.getFirstDayOfWeek();

        if (isEventThisWeek || isEventOverflowIntoThisWeek) {
            let height: number = isEventOverflowIntoThisWeek
                ? (columnHeight * eventDuration / timeInADay) - ((columnDate.getTime()-eventStart.getTime())*columnHeight/timeInADay)
                : (columnHeight * eventDuration / timeInADay);
            const columnsToFill = Math.floor(height / columnHeight)+1;
            for (let j = 0; j < columnsToFill; j++) {
                const eventGridColumn: number = i+j+1;
                if (eventGridColumn > columns.length) return;

                const eventBox: HTMLElement = document.createElement("div");
                const eventBoxTop: number = j === 0 && !isEventOverflowIntoThisWeek ? (columnHeight * eventTime / timeInADay) : 0;
                const eventBoxBottom: number = height < columnHeight ? eventBoxTop + height : columnHeight;

                const overlappingElements: HTMLElement[] = getOverlaps(eventBoxTop, eventBoxBottom, eventGridColumn);
                const width: number = 100/Math.pow((overlappingElements.length+1), 1/3);
                const isThinHeightVersion: boolean = height < 40;
                const isThinWidthVersion: boolean = width <= 50;
                const isSmallVersion: boolean = isThinHeightVersion || isThinWidthVersion;

                eventBox.style.position = "absolute";
                eventBox.style.gridColumn = `${eventGridColumn} / span 1`;
                eventBox.style.top = eventBoxTop + "px";
                eventBox.style.width = `${width}%`;
                eventBox.style.left = `${100 - width}%`;
                eventBox.style.height = eventBoxBottom - eventBoxTop + "px";
                eventBox.style.minHeight = cellHeight/4 + "px";
                eventBox.style.padding = !isSmallVersion ? "0.3rem 0.5rem" : "0 0.3rem";
                eventBox.onclick = async () => {
                    callModal();
                    await inputFillingByID(eventID);
                };
                if (isThinHeightVersion) {
                    eventBox.style.gridTemplateColumns = "1fr 1fr";
                    eventBox.style.columnGap = "0.2rem";
                }
                else eventBox.style.gridTemplateRows = "1fr auto";
                eventBox.setAttribute("data-event-id", eventID);
                eventBox.classList.add("calendar-event-overlay__event-box");

                const eventTitleText: HTMLElement = document.createElement("div");
                eventTitleText.innerText = eventTitle;
                eventTitleText.style.fontSize = !isSmallVersion ? "0.8rem" : "0.7rem";
                eventTitleText.classList.add("event-box__event-title")
                eventBox.appendChild(eventTitleText);

                let startTimeText: string = eventStart.toTimeString().split(":").slice(0, 2).join(":");
                let endTimeText: string = eventEnd.toTimeString().split(":").slice(0, 2).join(":");
                if (eventStart.toDateString() !== eventEnd.toDateString()) {
                    startTimeText = `${THREE_LETTER_MONTHS[eventStart.getMonth()]} ${eventStart.getDate()} ${startTimeText}`;
                    endTimeText = `${THREE_LETTER_MONTHS[eventEnd.getMonth()]} ${eventEnd.getDate()} ${endTimeText}`;
                }

                const eventTimeText: HTMLElement = document.createElement("div");
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

function reRenderEvent(eventID: string, eventTitle: string, eventStart: Date, eventEnd: Date) {
    removeRenderEvent(eventID);
    renderEvent(eventID, eventTitle, eventStart, eventEnd);
}

function clearEventOverlay() {
    const eventOverlay: HTMLElement = document.getElementsByClassName("week-view__calendar-event-overlay")[0] as HTMLElement;
    eventOverlay.innerHTML = "";
}

function removeRenderEvent(eventID: string) {
    const eventOverlay: HTMLElement = document.getElementsByClassName("week-view__calendar-event-overlay")[0] as HTMLElement;
    const events: HTMLElement[] = Array.from(eventOverlay.children) as HTMLElement[];
    for (let i = 0; i < events.length; i++) {
        const event: HTMLElement = events[i];
        if (event.getAttribute("data-event-id") === eventID) {
            event.remove();
        }
    }
}

function getOverlaps(eventTop: number, eventBottom: number, eventGridColumn: number): HTMLElement[] {
    const overlappingEvents: HTMLElement[] = [];
    const events: HTMLCollection = document.getElementsByClassName("calendar-event-overlay__event-box");
    for (let i = 0; i < events.length; i++) {
        const comparedEventElement: HTMLElement = events[i] as HTMLElement;
        const comparedEventTop: number = comparedEventElement.offsetTop;
        const comparedEventBottom: number = comparedEventTop + comparedEventElement.offsetHeight;
        const comparedEventGridColumn: number = Number(comparedEventElement.style.gridColumnStart);
        if (comparedEventGridColumn === eventGridColumn
            && !(
                (comparedEventTop >= eventBottom
                    && comparedEventBottom >= eventTop)
                || (comparedEventTop <= eventBottom
                    && comparedEventBottom <= eventTop)
            )
        ){
            overlappingEvents.push(comparedEventElement);
        }
    }
    return overlappingEvents;
}