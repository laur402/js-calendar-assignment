"use strict";

function addEvent(eventId, eventName, eventStart, eventEnd, eventDescription) {
    const eventList = fetchEvents();
    const eventToAdd = new CalendarEvent(eventId, eventName, eventStart, eventEnd, eventDescription);
    eventList.push(eventToAdd);
    storeEvents(eventList);
}

function removeEvent(eventId) {
    const eventList = fetchEvents();
    for (let i = 0; i < eventList.length; i++) {
        const event = eventList[i];
        if (event.eventId === eventId) {
            eventList.splice(i, 1);
        }
    }
    storeEvents(eventList);
}
function modifyEvent(eventId, eventName, eventStart, eventEnd, eventDescription) {
    const eventList = fetchEvents();
    for (let i = 0; i < eventList.length; i++) {
        const event = eventList[i];
        if (event.eventId === eventId) {
            eventList[i] = new CalendarEvent(eventId, eventName, eventStart, eventEnd, eventDescription);
        }
    }
    storeEvents(eventList);
}

function getEvent(eventId){
    const eventList = fetchEvents();
    for (let i = 0; i < eventList.length; i++) {
        const event = eventList[i];
        if (event.eventId === eventId) {
            return event;
        }
    }
    return null;
}

function fetchEvents() {
    return JSON.parse(localStorage.getItem("events"), (key, value) => {
        if (key === "eventStart" || key === "eventEnd") {
            return new Date(value);
        }
        else return value;
    }) ?? [];
}
function storeEvents(eventList) {
    localStorage.setItem("events", JSON.stringify(eventList));
}

function CalendarEvent(eventId, eventName, eventStart, eventEnd, eventDescription) {
    this.eventId = eventId;
    this.eventName = eventName;
    this.eventStart = eventStart;
    this.eventEnd = eventEnd;
    this.eventDescription = eventDescription;
}