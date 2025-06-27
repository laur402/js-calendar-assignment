function renderEvent(eventStart, eventEnd) {
    const cells = document.getElementsByClassName("calendar-column__calendar-cell");
    const cellHeight = cells[0]?.getBoundingClientRect().height;

    const columns = document.getElementsByClassName("calendar-grid__calendar-column-0");
    const columnHeight = columns[0].getBoundingClientRect().height;
    const columnWidth = columns[0].getBoundingClientRect().width;

    const eventOverlay = document.getElementsByClassName("week-view__calendar-event-overlay")[0];


    const eventTime = eventStart.getTime() - new Date(eventStart.toDateString()).getTime(); //current event ms
    const timeInADay = 86400000; //ms in a day

    for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        const columnDate = new Date(column.getAttribute("data-calendar-day"));
        if (columnDate.toDateString() === eventStart.toDateString()) {
            const eventBox = document.createElement("div");
            eventBox.style.position = "absolute";
            eventBox.style.left = (columnWidth * i) + "px";
            eventBox.style.top = ((columnHeight * eventTime)/timeInADay) + "px";
            eventBox.style.width = columnWidth + "px";
            eventBox.style.height = cellHeight + "px";
            eventBox.style.backgroundColor = "dodgerblue";
            eventBox.style.borderRadius = "0.5rem";
            //eventBox.onclick = () => {console.log("Hello!")};
            eventBox.style.pointerEvents = "auto";




            eventOverlay.appendChild(eventBox);
        }
    }
}