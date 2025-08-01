"use strict";

let weekOffset: number = 0;
function getWeekOffset(){
    return weekOffset;
}
function setWeekOffset(setValue: number){
    weekOffset = setValue;
}

async function loadWeekView(){
    loadCalendarGrid(7);
    loadTimezoneLabel();
    await reloadWeekView();
}

async function reloadWeekView(){
    loadCalendarDateLabels(getOffsetDate());
    await loadEvents();
    loadHeaderDate(getOffsetDate());
}

function getOffsetDate(){
    return new Date(LOAD_TIME.getTime() + getWeekOffset() * 7 * TIME_IN_A_DAY_MS);
}

function loadTimezoneLabel(){
    const timezoneElement = document.getElementsByClassName(CLASSES.WeekView_DatesHeader_DateContainer_Timezone)[0] as HTMLElement;
    const timezoneOffset = getTimezone(LOAD_TIME);
    let timezoneOffsetString = leftPad(timezoneOffset, 2);
    timezoneElement.innerText = `UTC${timezoneOffset < 0 ? "-" : "+"}${timezoneOffsetString}`;
}

function loadCalendarDateLabels(offsetDate: Date){
    const weekDateIterator: Date = getFirstDayOfWeek(offsetDate);

    let elements = document.getElementsByClassName(CLASSES.WeekView_DatesHeader_DateContainer_Date);
    let dateColumns = document.getElementsByClassName(CLASSES.WeekView_CalendarGrid_CalendarColumn);
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        const elementWeekdayLabel = element.getElementsByClassName(CLASSES.WeekView_DatesHeader_DateContainer_Date_Weekday)[0] as HTMLElement;
        const elementDateLabel = element.getElementsByClassName(CLASSES.WeekView_DatesHeader_DateContainer_Date_Day)[0] as HTMLElement;
        elementWeekdayLabel.innerText = THREE_LETTER_WEEK_DAYS[weekDateIterator.getDay()];
        elementDateLabel.innerText = weekDateIterator.getDate().toString();

        const date: string = getDateString(weekDateIterator);
        dateColumns[i].setAttribute(ATTRIBUTES.CalendarDay, date);

        if (isSameDay(weekDateIterator, LOAD_TIME)){
            element.classList.add(CLASSES.WeekView_DatesHeader_DateContainer_Date_Active);
        }
        else element.classList.remove(CLASSES.WeekView_DatesHeader_DateContainer_Date_Active);

        weekDateIterator.setDate(weekDateIterator.getDate() + 1);
    }
}

function createCalendarGridTimeColumn(hoursInADay: number) {
    const calendarGridTimeColumn: HTMLElement = document.createElement("section");
    calendarGridTimeColumn.classList.add(CLASSES.WeekView_CalendarGrid_TimeColumn);
    for (let hour = 1; hour <= hoursInADay; hour++) {
        const calendarGridTimeColumnCell: HTMLElement = document.createElement("div");
        calendarGridTimeColumnCell.classList.add(CLASSES.WeekView_CalendarGrid_TimeColumn_Cell);
        calendarGridTimeColumnCell.innerText = hour === hoursInADay ? "" : `${leftPad(hour, 2)}:00`;
        calendarGridTimeColumn.appendChild(calendarGridTimeColumnCell);
    }
    return calendarGridTimeColumn;
}

function createCalendarGridColumn(hoursInADay: number) {
    const calendarGridColumn: HTMLElement = document.createElement("section");
    calendarGridColumn.classList.add(CLASSES.WeekView_CalendarGrid_CalendarColumn);
    for (let j = 0; j < hoursInADay; j++) {
        const calendarGridColumnCell: HTMLElement = document.createElement("div");
        calendarGridColumnCell.classList.add(CLASSES.WeekView_CalendarGrid_CalendarColumn_Cell);

        const calendarGridColumnCellButton: HTMLElement = document.createElement("button");
        calendarGridColumnCellButton.classList.add(CLASSES.WeekView_CalendarGrid_CalendarColumn_Cell_Button);
        calendarGridColumnCell.appendChild(calendarGridColumnCellButton);

        calendarGridColumn.appendChild(calendarGridColumnCell);
    }
    return calendarGridColumn
}

function loadCalendarGrid(columnCount: number) {
    const hoursInADay = 24;
    const calendarGrid = document.getElementsByClassName(CLASSES.WeekView_CalendarGrid)[0] as HTMLElement;
    const calendarGridTimeColumn = createCalendarGridTimeColumn(hoursInADay);
    calendarGrid.appendChild(calendarGridTimeColumn);
    for (let i = 0; i < columnCount; i++) {
        const gridColumn = createCalendarGridColumn(hoursInADay);
        calendarGrid.appendChild(gridColumn);
    }
}

async function loadEvents() {
    clearEventOverlay();
    const events: CalendarEvent[] = await fetchEvents();
    events.forEach(event => {
        renderEvent(event);
    })
}

function loadHeaderDate(date: Date){
    const element = document.getElementsByClassName(CLASSES.Header_MonthYearDate)[0] as HTMLElement;
    const firstDayOfTheWeek = getFirstDayOfWeek(date);
    const lastDayOfTheWeek = getLastDayOfWeek(date);
    if (firstDayOfTheWeek.getMonth() !== lastDayOfTheWeek.getMonth()){
        if (firstDayOfTheWeek.getFullYear() !== lastDayOfTheWeek.getFullYear()){
            element.innerText = `${firstDayOfTheWeek.getFullYear()} ${MONTHS[firstDayOfTheWeek.getMonth()]} - ${lastDayOfTheWeek.getFullYear()} ${MONTHS[lastDayOfTheWeek.getMonth()]}`;
        }
        else element.innerText = `${firstDayOfTheWeek.getFullYear()} ${MONTHS[firstDayOfTheWeek.getMonth()]} - ${MONTHS[lastDayOfTheWeek.getMonth()]}`;
    }
    else element.innerText = `${firstDayOfTheWeek.getFullYear()} ${MONTHS[firstDayOfTheWeek.getMonth()]}`;
}