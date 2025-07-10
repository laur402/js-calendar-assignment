"use strict";

function loadCurrentTimeGraphic(currentTime: Date) {
    const columns: HTMLCollection = document.getElementsByClassName("calendar-grid__calendar-column");
    const columnHeight: number = columns[0].getBoundingClientRect().height;
    const eventOverlay = document.getElementsByClassName("week-view__calendar-event-overlay")[0] as HTMLElement;
    const timeOfDay: number = currentTime.getTime() - getNormalizedLocalDate(currentTime).getTime(); //ms from start of day
    for (let i = 0; i < columns.length; i++) {
        const column = columns[i] as HTMLElement;
        const columnDateString: string | undefined = column.getAttribute("data-calendar-day")?.toString();
        if (columnDateString === undefined) throw new AttributeError("Cannot get data-calendar-day attribute");
        const columnDate: Date = new Date(columnDateString);
        if (isSameDay(columnDate, currentTime)){
            const currentTimeGraphicTop: number = (columnHeight * timeOfDay / TIME_IN_A_DAY_MS);
            const currentTimeGraphic: HTMLElement = createCurrentTimeGraphicElement(currentTimeGraphicTop, i);
            eventOverlay.appendChild(currentTimeGraphic);
        }
    }
}

function createCurrentTimeGraphicElement(currentTimeGraphicTop: number, currentTimeGraphicColumn: number){
    const currentTimeGraphic: HTMLElement = document.createElement("div");
    currentTimeGraphic.style.position = "absolute";
    currentTimeGraphic.style.top = currentTimeGraphicTop + "px";
    currentTimeGraphic.style.gridColumn = `${currentTimeGraphicColumn+1} / span 1`;
    currentTimeGraphic.classList.add("calendar-event-overlay__current-time-graphic");

    const currentTimeGraphicLine: HTMLElement = document.createElement("div");
    currentTimeGraphicLine.classList.add("current-time-graphic__line");
    currentTimeGraphic.appendChild(currentTimeGraphicLine);

    const currentTimeGraphicBauble: HTMLElement = document.createElement("div");
    currentTimeGraphicBauble.style.position = "absolute";
    currentTimeGraphicBauble.classList.add("current-time-graphic__bauble");
    currentTimeGraphic.appendChild(currentTimeGraphicBauble);
    return currentTimeGraphic;
}

function removeCurrentTimeGraphic() {
    const currentTimeGraphics = Array.from(document.getElementsByClassName("calendar-event-overlay__current-time-graphic")) as HTMLElement[];
    for (let i = 0; i < currentTimeGraphics.length; i++) {
        const currentTimeGraphic: HTMLElement = currentTimeGraphics[i];
        currentTimeGraphic.remove();
    }
}