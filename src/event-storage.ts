"use strict";

function addEvent(eventId: string, eventName: string, eventStart: Date, eventEnd: Date, eventDescription: string) {
    const eventList = fetchEvents();
    const eventToAdd: CalendarEvent = {eventId, eventName, eventStart, eventEnd, eventDescription};
    eventList.push(eventToAdd);
    storeEvents(eventList);
}

function removeEvent(eventId: string) {
    const eventList = fetchEvents();
    for (let i = 0; i < eventList.length; i++) {
        const event = eventList[i];
        if (event.eventId === eventId) {
            eventList.splice(i, 1);
        }
    }
    storeEvents(eventList);
}
function modifyEvent(eventId: string, eventName: string, eventStart: Date, eventEnd: Date, eventDescription: string) {
    const eventList = fetchEvents();
    for (let i = 0; i < eventList.length; i++) {
        let event = eventList[i];
        if (event.eventId === eventId) {
            event = {eventId, eventName, eventStart, eventEnd, eventDescription};
        }
    }
    storeEvents(eventList);
}

function getEvent(eventId: string): CalendarEvent | null {
    const eventList = fetchEvents();
    for (let i = 0; i < eventList.length; i++) {
        const event = eventList[i];
        if (event.eventId === eventId) {
            return event;
        }
    }
    return null;
}

function fetchEvents(): CalendarEvent[] {
    const eventList: CalendarEvent[] = JSON.parse(localStorage.getItem("events") ?? "{}", (key, value) => {
        if (key === "eventStart" || key === "eventEnd") {
            return new Date(value);
        }
        else return value;
    });
    eventList.sort((a: CalendarEvent, b: CalendarEvent) => a.eventStart.getTime() - b.eventStart.getTime());
    return eventList;
}
function storeEvents(eventList: CalendarEvent[]) {
    localStorage.setItem("events", JSON.stringify(eventList));
}

type CalendarEvent = {
    eventId: string;
    eventName: string;
    eventStart: Date;
    eventEnd: Date;
    eventDescription: string;
}