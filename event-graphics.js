function renderEvent(eventID, eventTitle, eventStart, eventEnd) {
    const cells = document.getElementsByClassName("calendar-column__calendar-cell");
    const cellHeight = cells[0]?.getBoundingClientRect().height;

    const columns = document.getElementsByClassName("calendar-grid__calendar-column-0");
    const columnHeight = columns[0].getBoundingClientRect().height;
    const columnWidth = columns[0].getBoundingClientRect().width;

    const eventOverlay = document.getElementsByClassName("week-view__calendar-event-overlay")[0];

    const eventTime = eventStart.getTime() - new Date(eventStart.toDateString()).getTime(); //ms from start of day
    const eventDuration = eventEnd.getTime() - eventStart.getTime(); //ms event duration
    const timeInADay = 86400000; //ms in a day

    for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        const columnDate = new Date(column.getAttribute("data-calendar-day"));
        if (columnDate.toDateString() === eventStart.toDateString()) {
            const eventBox = document.createElement("div");
            eventBox.style.position = "absolute";
            eventBox.style.gridColumn = `${i+1} / span 1`;
            eventBox.style.top = ((columnHeight * eventTime)/timeInADay) + "px";
            eventBox.style.width = "100%";
            eventBox.style.height = (columnHeight * eventDuration / timeInADay) + "px";
            eventBox.style.backgroundColor = "dodgerblue";
            eventBox.style.border = "2px solid #125699";
            eventBox.style.borderRadius = "0.5rem";
            eventBox.style.padding = "0.3rem 0.5rem";
            eventBox.onclick = () => {removeEvent(eventID); eventBox.remove();}; //TODO: Open modal to modify data
            eventBox.style.pointerEvents = "auto";
            eventBox.style.display = "grid";
            eventBox.style.gridTemplateRows = "calc(100% - 0.8rem) 0.8rem";

            const eventTitleText = document.createElement("div");
            eventTitleText.innerText = eventTitle;
            eventTitleText.style.fontSize = "0.8rem";
            eventTitleText.style.gridRow = "1";
            eventTitleText.style.overflowWrap = "anywhere";
            eventTitleText.style.overflow = "hidden";

            eventBox.appendChild(eventTitleText);

            const startTimeText = eventStart.toTimeString().split(":").slice(0, 2).join(":");
            const endTimeText = eventEnd.toTimeString().split(":").slice(0, 2).join(":"); //TODO: Redo this for multiple days

            const eventTimeText = document.createElement("div");
            eventTimeText.innerText = `${startTimeText} - ${endTimeText}`;
            eventTimeText.style.fontSize = "0.6rem";
            eventTimeText.style.gridRow = "2"
            eventBox.appendChild(eventTimeText);

            eventOverlay.appendChild(eventBox);
        }
    }
}