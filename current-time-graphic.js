"use strict";

function loadCurrentTimeGraphic(currentTime) {
    const columns = document.getElementsByClassName("calendar-grid__calendar-column-0");
    const columnHeight = columns[0].getBoundingClientRect().height;
    const eventOverlay = document.getElementsByClassName("week-view__calendar-event-overlay")[0];
    const timeOfDay = currentTime.getTime() - new Date(currentTime.toDateString()).getTime(); //ms from start of day
    const timeInADay = 86400000; //ms in a day
    for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        const columnDate = new Date(column.getAttribute("data-calendar-day"));
        if (columnDate.toDateString() === currentTime.toDateString()){
            const currentTimeGraphic = document.createElement("div");
            const currentTimeGraphicTop = (columnHeight * timeOfDay / timeInADay);
            currentTimeGraphic.style.position = "absolute";
            currentTimeGraphic.style.top = currentTimeGraphicTop + "px";
            currentTimeGraphic.style.gridColumn = `${i+1} / span 1`;
            currentTimeGraphic.classList.add("calendar-event-overlay__current-time-graphic");

            const currentTimeGraphicLine = document.createElement("div");
            currentTimeGraphicLine.classList.add("current-time-graphic__line");
            currentTimeGraphic.appendChild(currentTimeGraphicLine);

            const currentTimeGraphicBauble = document.createElement("div");
            currentTimeGraphicBauble.style.position = "absolute";
            currentTimeGraphicBauble.classList.add("current-time-graphic__bauble");
            currentTimeGraphic.appendChild(currentTimeGraphicBauble);

            eventOverlay.appendChild(currentTimeGraphic);
        }
    }
}

function removeCurrentTimeGraphic() {
    const currentTimeGraphics = Array.from(document.getElementsByClassName("calendar-event-overlay__current-time-graphic"));
    for (let i = 0; i < currentTimeGraphics.length; i++) {
        const currentTimeGraphic = currentTimeGraphics[i];
        currentTimeGraphic.remove();
    }
}