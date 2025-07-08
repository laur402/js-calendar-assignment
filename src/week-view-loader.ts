"use strict";

const THREE_LETTER_WEEK_DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const TODAY = new Date();
let weekOffset = 0;

async function loadWeekView(){
    loadTimezoneLabel();
    loadCalendarDateLabels();
    await loadEvents();
    loadHeaderDate(getOffsetDate());
}

function getOffsetDate(){
    return new Date(TODAY.getTime() + weekOffset * (7 * 24 * 60 * 60 * 1000));
}

function loadTimezoneLabel(){
    let timezoneElement = document.getElementsByClassName("week-view__dates-header-timezone")[0] as HTMLElement;
    let timezoneOffset = TODAY.toString().split("GMT")[1].slice(0, 3);
    timezoneElement.innerText = `UTC${timezoneOffset}`;
}

function loadCalendarDateLabels(){
    const firstDayOfTheWeek = getOffsetDate().getFirstDayOfWeek();

    let elements = document.getElementsByClassName("week-view__dates-header-date");
    let dateColumns = document.getElementsByClassName("calendar-grid__calendar-column-0");
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        const elementWeekdayLabel = element.getElementsByClassName("calendar-date-weekday")[0] as HTMLElement;
        const elementDateLabel = element.getElementsByClassName("calendar-date-day")[0] as HTMLElement;
        elementWeekdayLabel.innerText = THREE_LETTER_WEEK_DAYS[firstDayOfTheWeek.getDay()];
        elementDateLabel.innerText = firstDayOfTheWeek.getDate().toString();

        const date = `${firstDayOfTheWeek.getFullYear()}-${firstDayOfTheWeek.getMonth() + 1}-${firstDayOfTheWeek.getDate()}`;
        dateColumns[i].setAttribute("data-calendar-day", date);

        if (firstDayOfTheWeek.toDateString() === TODAY.toDateString()){
            element.classList.add("week-view__dates-header-date--active");
        }
        else element.classList.remove("week-view__dates-header-date--active");

        firstDayOfTheWeek.setDate(firstDayOfTheWeek.getDate() + 1);
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