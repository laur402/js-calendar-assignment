"use strict";

let weekOffset: number = 0;

async function loadWeekView(){
    loadCalendarGrid(7);
    loadTimezoneLabel();
    await reloadWeekView();
}

async function reloadWeekView(){
    loadCalendarDateLabels();
    await loadEvents();
    loadHeaderDate(getOffsetDate());
}

function getOffsetDate(){
    return new Date(LOAD_TIME.getTime() + weekOffset * 7 * TIME_IN_A_DAY_MS);
}

function loadTimezoneLabel(){
    let timezoneElement = document.getElementsByClassName("week-view__dates-header-timezone")[0] as HTMLElement;
    let timezoneOffset = LOAD_TIME.toString().split("GMT")[1].slice(0, 3);
    timezoneElement.innerText = `UTC${timezoneOffset}`;
}

function loadCalendarDateLabels(){
    const firstDayOfTheWeek = getOffsetDate().getFirstDayOfWeek();

    let elements = document.getElementsByClassName("week-view__dates-header-date");
    let dateColumns = document.getElementsByClassName("calendar-grid__calendar-column");
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        const elementWeekdayLabel = element.getElementsByClassName("calendar-date-weekday")[0] as HTMLElement;
        const elementDateLabel = element.getElementsByClassName("calendar-date-day")[0] as HTMLElement;
        elementWeekdayLabel.innerText = THREE_LETTER_WEEK_DAYS[firstDayOfTheWeek.getDay()];
        elementDateLabel.innerText = firstDayOfTheWeek.getDate().toString();

        const date = `${firstDayOfTheWeek.getFullYear()}-${firstDayOfTheWeek.getMonth() + 1}-${firstDayOfTheWeek.getDate()}`;
        dateColumns[i].setAttribute("data-calendar-day", date);

        if (firstDayOfTheWeek.toDateString() === LOAD_TIME.toDateString()){
            element.classList.add("week-view__dates-header-date--active");
        }
        else element.classList.remove("week-view__dates-header-date--active");

        firstDayOfTheWeek.setDate(firstDayOfTheWeek.getDate() + 1);
    }
}

function loadCalendarGrid(columnCount: number) {
    const calendarGrid = document.getElementsByClassName("week-view__calendar-grid")[0] as HTMLElement;

    const calendarGridTimeColumn = document.createElement("section");
    calendarGridTimeColumn.classList.add("calendar-grid__time-column");
    for (let i = 1; i <= 24; i++){
        const calendarGridTimeColumnCell = document.createElement("div");
        calendarGridTimeColumnCell.classList.add("time-column__cell");
        calendarGridTimeColumnCell.innerText = i===24? "" : `${i.leftPad(2)}:00`;
        calendarGridTimeColumn.appendChild(calendarGridTimeColumnCell);
    }
    calendarGrid.appendChild(calendarGridTimeColumn);
    for (let i = 0; i < columnCount; i++){
        const calendarGridColumn = document.createElement("section");
        calendarGridColumn.classList.add("calendar-grid__calendar-column");
        for (let j = 0; j < 24; j++){
            const calendarGridColumnCell = document.createElement("div");
            calendarGridColumnCell.classList.add("calendar-column__calendar-cell");

            const calendarGridColumnCellButton = document.createElement("button");
            calendarGridColumnCellButton.classList.add("calendar-cell__button");
            calendarGridColumnCell.appendChild(calendarGridColumnCellButton);

            calendarGridColumn.appendChild(calendarGridColumnCell);
        }
        calendarGrid.appendChild(calendarGridColumn);
    }
}

async function loadEvents() {
    clearEventOverlay();
    const events = await fetchEvents();
    events.forEach(event => {
        renderEvent(event.eventId, event.eventName, new Date(event.eventStart), new Date(event.eventEnd));
    })
}

function loadHeaderDate(date: Date){
    const element = document.getElementsByClassName("header__month-year-date")[0] as HTMLElement;
    const firstDayOfTheWeek = date.getFirstDayOfWeek();
    const lastDayOfTheWeek = date.getLastDayOfWeek();
    //console.log(firstDayOfTheWeek);
    //console.log(lastDayOfTheWeek);
    if (firstDayOfTheWeek.getMonth() !== lastDayOfTheWeek.getMonth()){
        if (firstDayOfTheWeek.getFullYear() !== lastDayOfTheWeek.getFullYear()){
            element.innerText = `${firstDayOfTheWeek.getFullYear()} ${MONTHS[firstDayOfTheWeek.getMonth()]} - ${lastDayOfTheWeek.getFullYear()} ${MONTHS[lastDayOfTheWeek.getMonth()]}`;
        }
        else element.innerText = `${firstDayOfTheWeek.getFullYear()} ${MONTHS[firstDayOfTheWeek.getMonth()]} - ${MONTHS[lastDayOfTheWeek.getMonth()]}`;
    }
    else element.innerText = `${firstDayOfTheWeek.getFullYear()} ${MONTHS[firstDayOfTheWeek.getMonth()]}`;
}