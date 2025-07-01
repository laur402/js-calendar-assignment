"use strict";

const threeLetterWeekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const today = new Date();
let weekOffset = 0;

function loadWeekView(){
    loadTimezoneLabel();
    loadCalendarDateLabels();
    loadEvents();
    loadHeaderDate(getOffsetDate());
}

function getOffsetDate(){
    return new Date(today.getTime() + weekOffset * (7 * 24 * 60 * 60 * 1000));
}

function loadTimezoneLabel(){
    let timezoneElement = document.getElementsByClassName("week-view__dates-header-timezone")[0];
    let timezoneOffset = today.toString().split("GMT")[1].slice(0, 3);
    timezoneElement.innerText = `UTC${timezoneOffset}`;
}

function loadCalendarDateLabels(){
    const firstDayOfTheWeek = getOffsetDate().getFirstDayOfWeek();

    let elements = document.getElementsByClassName("week-view__dates-header-date");
    let dateColumns = document.getElementsByClassName("calendar-grid__calendar-column-0");
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        element.getElementsByClassName("calendar-date-weekday")[0].innerText = threeLetterWeekDays[firstDayOfTheWeek.getDay()];
        element.getElementsByClassName("calendar-date-day")[0].innerText = firstDayOfTheWeek.getDate();

        const date = `${firstDayOfTheWeek.getFullYear()}-${firstDayOfTheWeek.getMonth() + 1}-${firstDayOfTheWeek.getDate()}`;
        dateColumns[i].setAttribute("data-calendar-day", date);

        if (firstDayOfTheWeek.toDateString() === today.toDateString()){
            element.classList.add("week-view__dates-header-date--active");
        }
        else element.classList.remove("week-view__dates-header-date--active");

        firstDayOfTheWeek.setDate(firstDayOfTheWeek.getDate() + 1);
    }
}

function loadEvents() {
    clearEventOverlay();
    const events = fetchEvents();
    events.forEach(event => {
        renderEvent(event.eventId, event.eventName, new Date(event.eventStart), new Date(event.eventEnd));
    })
}

function loadHeaderDate(date){
    const element = document.getElementsByClassName("header__month-year-date");
    const firstDayOfTheWeek = date.getFirstDayOfWeek();
    const lastDayOfTheWeek = date.getLastDayOfWeek();
    //console.log(firstDayOfTheWeek);
    //console.log(lastDayOfTheWeek);
    if (firstDayOfTheWeek.getMonth() !== lastDayOfTheWeek.getMonth()){
        if (firstDayOfTheWeek.getFullYear() !== lastDayOfTheWeek.getFullYear()){
            element[0].innerText = `${firstDayOfTheWeek.getFullYear()} ${months[firstDayOfTheWeek.getMonth()]} - ${lastDayOfTheWeek.getFullYear()} ${months[lastDayOfTheWeek.getMonth()]}`;
        }
        else element[0].innerText = `${firstDayOfTheWeek.getFullYear()} ${months[firstDayOfTheWeek.getMonth()]} - ${months[lastDayOfTheWeek.getMonth()]}`;
    }
    else element[0].innerText = `${firstDayOfTheWeek.getFullYear()} ${months[firstDayOfTheWeek.getMonth()]}`;
}