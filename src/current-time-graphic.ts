"use strict";

function loadCurrentTimeGraphic(currentTime: Date) {
    const columns: HTMLCollection = document.getElementsByClassName("calendar-grid__calendar-column-0");
    const columnHeight: number = columns[0].getBoundingClientRect().height;
    const eventOverlay: HTMLElement = document.getElementsByClassName("week-view__calendar-event-overlay")[0] as HTMLElement;
    const timeOfDay: number = currentTime.getTime() - new Date(currentTime.toDateString()).getTime(); //ms from start of day
    const timeInADay: number = 86400000; //ms in a day
    for (let i = 0; i < columns.length; i++) {
        const column: HTMLElement = columns[i] as HTMLElement;
        const columnDate: Date = new Date(column.getAttribute("data-calendar-day")?.toString() ?? ""); //TODO: Replace with error
        if (columnDate.toDateString() === currentTime.toDateString()){
            const currentTimeGraphic: HTMLElement = document.createElement("div");
            const currentTimeGraphicTop: number = (columnHeight * timeOfDay / timeInADay);
            currentTimeGraphic.style.position = "absolute";
            currentTimeGraphic.style.top = currentTimeGraphicTop + "px";
            currentTimeGraphic.style.gridColumn = `${i+1} / span 1`;
            currentTimeGraphic.classList.add("calendar-event-overlay__current-time-graphic");

            const currentTimeGraphicLine: HTMLElement = document.createElement("div");
            currentTimeGraphicLine.classList.add("current-time-graphic__line");
            currentTimeGraphic.appendChild(currentTimeGraphicLine);

            const currentTimeGraphicBauble: HTMLElement = document.createElement("div");
            currentTimeGraphicBauble.style.position = "absolute";
            currentTimeGraphicBauble.classList.add("current-time-graphic__bauble");
            currentTimeGraphic.appendChild(currentTimeGraphicBauble);

            eventOverlay.appendChild(currentTimeGraphic);
        }
    }
}

function removeCurrentTimeGraphic() {
    const currentTimeGraphics: HTMLElement[] = Array.from(document.getElementsByClassName("calendar-event-overlay__current-time-graphic")) as HTMLElement[];
    for (let i = 0; i < currentTimeGraphics.length; i++) {
        const currentTimeGraphic: HTMLElement = currentTimeGraphics[i];
        currentTimeGraphic.remove();
    }
}