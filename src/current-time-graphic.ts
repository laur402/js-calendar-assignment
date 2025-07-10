"use strict";

function loadCurrentTimeGraphic(currentTime: Date) {
    const columns: HTMLCollection = document.getElementsByClassName(CLASSES.WeekView_CalendarGrid_CalendarColumn);
    const columnHeight: number = columns[0].getBoundingClientRect().height;
    const eventOverlay = document.getElementsByClassName(CLASSES.WeekView_CalendarEventOverlay)[0] as HTMLElement;
    const timeOfDay: number = currentTime.getTime() - getNormalizedLocalDate(currentTime).getTime(); //ms from start of day
    for (let i = 0; i < columns.length; i++) {
        const column = columns[i] as HTMLElement;
        const columnDateString: string | undefined = column.getAttribute(ATTRIBUTES.CalendarDay)?.toString();
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
    currentTimeGraphic.classList.add(CLASSES.WeekView_CalendarEventOverlay_CurrentTimeGraphic);

    const currentTimeGraphicLine: HTMLElement = document.createElement("div");
    currentTimeGraphicLine.classList.add(CLASSES.WeekView_CalendarEventOverlay_CurrentTimeGraphic_Line);
    currentTimeGraphic.appendChild(currentTimeGraphicLine);

    const currentTimeGraphicBauble: HTMLElement = document.createElement("div");
    currentTimeGraphicBauble.style.position = "absolute";
    currentTimeGraphicBauble.classList.add(CLASSES.WeekView_CalendarEventOverlay_CurrentTimeGraphic_Bauble);
    currentTimeGraphic.appendChild(currentTimeGraphicBauble);
    return currentTimeGraphic;
}

function removeCurrentTimeGraphic() {
    const currentTimeGraphics = Array.from(document.getElementsByClassName(CLASSES.WeekView_CalendarEventOverlay_CurrentTimeGraphic)) as HTMLElement[];
    for (let i = 0; i < currentTimeGraphics.length; i++) {
        const currentTimeGraphic: HTMLElement = currentTimeGraphics[i];
        currentTimeGraphic.remove();
    }
}